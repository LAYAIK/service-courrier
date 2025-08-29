// src/controllers/reportController.js
import  db from '../models/index.js';
const { Courrier } = db;
import { Op, Sequelize } from 'sequelize'; // N'oubliez pas Sequelize pour les fonctions d'agrégation
import { Parser } from 'json2csv'; // Installez : npm install json2csv
import PDFDocument from 'pdfkit'; // Installez : npm install pdfkit
//import ExcelJS from 'exceljs'; // Installez : npm install exceljs



// API: GET /api/reports/stats/by-status
export const getCouriersByStatus = async (req, res, next) => {
    try {
        const summary = await Courrier.findAll({
            attributes: [
                'status', // Assurez-vous que cette colonne existe et est bien orthographiée
                [Sequelize.fn('COUNT', Sequelize.col('id_courrier')), 'totalCouriers'] // Assurez-vous que cette colonne existe
            ],
            group: ['status'],
            raw: true // Renvoie des objets JavaScript simples
        });
        res.status(200).json(summary);

    } catch (error) {
    // Passer l'erreur au prochain middleware (votre gestionnaire d'erreurs global)
        next(error);
    }
};

// API: GET /api/reports/stats/by-month
export const getCouriersByMonth = async (req, res, next) => {
    try {
        const result = await Courrier.findAll({
            attributes: [
                [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "date_depot"')), 'year'], // Extrait l'année
                [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "date_depot"')), 'month'], // Extrait le mois
                [Sequelize.fn('COUNT', Sequelize.col('id_courrier')), 'count']
            ],
            group: [
                Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "date_depot"')),
                Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "date_depot"'))
            ],
            order: [
                [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "date_depot"')), 'ASC'],
                [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "date_depot"')), 'ASC']
            ],
            raw: true
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers par mois:', error);
        next(error);
    }
};

// API: GET /api/reports/stats/daily-trend (exemple simplifié)
export const getCouriersDailyTrend = async (req, res, next) => {
    try {
        // Optionnel: filtrer par une plage de dates si nécessaire
        // const { startDate, endDate } = req.query;
        // let whereClause = {};
        // if (startDate && endDate) { /* ... */ }

        const result = await Courrier.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date_depot')), 'day'], // Tronque à la journée
                [Sequelize.fn('COUNT', Sequelize.col('id_courrier')), 'count']
            ],
            group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date_depot'))],
            order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('date_depot')), 'ASC']],
            raw: true
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des tendances quotidiennes:', error);
        next(error);
    }
};
// 
export const getDetailedActivityReport = async (req, res, next) => {
    try {
        const {
            startDate,       // pour Filtrage: plage de dates
            endDate,
            serviceExpeditor, // pour Filtrage: service expéditeur (si applicable)
            serviceRecipient, // pour Filtrage: service destinataire (si applicable)
            status,          // pour Filtrage: statut du courrier
            nature,          // pour Filtrage: nature du courrier
            searchQuery,     // pour Recherche: mot-clé dans l'objet/contenu
            sortBy,          // pour Tri: champ par lequel trier (ex: 'date_depot', 'numero_courrier')
            sortOrder = 'ASC', // pour Tri: ordre de tri ('ASC' ou 'DESC')
            limit = 10,      // pour Pagination (optionnel)
            offset = 0       // pour Pagination (optionnel)
        } = req.query; // Récupérer les paramètres de la requête

        let whereConditions = {}; // Conditions de filtrage pour Sequelize
        let orderConditions = []; // Conditions de tri pour Sequelize
        let includeConditions = []; // Conditions d'inclusion pour les associations

        // 1. Filtration
        // Filtrage par plage de dates
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                whereConditions.date_depot = {
                    [Op.between]: [start, end]
                };
            }
        } else if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) {
                whereConditions.date_depot = {
                    [Op.gte]: start
                };
            }
        } else if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) {
                whereConditions.date_depot = {
                    [Op.lte]: end
                };
            }
        }

        // Filtrage par statut
        if (status) {
            whereConditions.status = status;
        }

        // Filtrage par nature
        if (nature) {
            whereConditions.nature = nature;
        }

        // Filtrage par service expéditeur/destinataire (si vous avez des associations)
        // Ceci est un exemple. Les noms exacts dépendent de vos associations Sequelize.
        /*
        if (serviceExpeditor) {
            includeConditions.push({
                model: Service, // Votre modèle Service
                as: 'expeditorService', // L'alias défini dans l'association
                where: { id: serviceExpeditor },
                attributes: [] // Ne pas ramener les attributs du service si pas nécessaire
            });
        }
        if (serviceRecipient) {
            includeConditions.push({
                model: Service,
                as: 'recipientService',
                where: { id: serviceRecipient },
                attributes: []
            });
        }
        */

        // 2. Recherche par mot-clé (dans objet ou contenu)
        if (searchQuery) {
            whereConditions[Op.or] = [
                { objet: { [Op.iLike]: `%${searchQuery}%` } },
                // Ajoutez d'autres champs textuels pertinents ici, par exemple 'contenu'
                // { contenu: { [Op.iLike]: `%${searchQuery}%` } }
            ];
            // Si vous aviez déjà des conditions dans whereConditions, assurez-vous de les combiner correctement.
            // Une approche plus robuste serait de construire d'abord un tableau de conditions, puis de le combiner avec Op.and.
        }

        // 3. Tri
        if (sortBy) {
            const validSortOrders = ['ASC', 'DESC'];
            const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
            orderConditions.push([sortBy, order]);
        } else {
            // Tri par défaut
            orderConditions.push(['date_depot', 'DESC']);
        }

        // Exécuter la requête Sequelize
        const { count, rows } = await Courrier.findAndCountAll({
            where: whereConditions,
            order: orderConditions,
            include: includeConditions, // Inclure les associations si configurées
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            distinct: true // Important si vous utilisez des includes pour éviter les doublons dans le count
            // attributes: ['id_courrier', 'objet', 'date_depot', 'numero_courrier', 'nature', 'statut', ...] // Spécifiez les colonnes à retourner
        });

        res.status(200).json({
            total: count,
            data: rows
        });

    } catch (error) {
        console.error('Erreur lors de la génération du rapport détaillé:', error);
        next(error); // Passer l'erreur au middleware de gestion des erreurs
    }
};

// API: GET /api/reports/export/csv
export const exportCouriersToCsv = async (req, res, next) => {
    try {
        // Récupérer les mêmes paramètres de filtrage que pour le rapport détaillé
        const { startDate, endDate, status, nature, searchQuery, sortBy, sortOrder } = req.query;

        let whereConditions = {};
        let orderConditions = [];

        // Appliquer les mêmes logiques de filtrage/recherche/tri que dans getDetailedActivityReport
        // (Copiez/adaptez la logique de construction de whereConditions et orderConditions)

        // Exemple simple de filtrage par date pour cet exemple
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                whereConditions.date_depot = {
                    [Op.between]: [start, end]
                };
            }
        }
        if (searchQuery) {
            whereConditions[Op.or] = [
                { objet: { [Op.iLike]: `%${searchQuery}%` } },
                { numero_courrier: { [Op.iLike]: `%${searchQuery}%` } }
            ];
        }
        if (sortBy) {
            const order = (sortOrder && sortOrder.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
            orderConditions.push([sortBy, order]);
        }


        // 2. Récupérer toutes les données non paginées
        const couriers = await Courrier.findAll({
            where: whereConditions,
            order: orderConditions,
            raw: true // Important pour obtenir des objets JavaScript plats pour json2csv
        });

        // 3. Définir les champs CSV (correspondant aux colonnes de votre modèle)
        const fields = [
            { label: 'ID Courrier', value: 'id_courrier' },
            { label: 'Objet', value: 'objet' },
            { label: 'Date Dépôt', value: 'date_depot' },
            { label: 'Numéro Courrier', value: 'numero_courrier' },
            { label: 'Nature', value: 'nature' },
            { label: 'Statut', value: 'statut' },
            // Ajoutez tous les autres champs que vous voulez exporter
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(couriers);

        // 4. Définir les en-têtes de réponse
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="rapport_courriers_${Date.now()}.csv"`);

        // 5. Envoyer le CSV
        res.status(200).send(csv);

    } catch (error) {
        console.error('Erreur lors de l\'exportation CSV:', error);
        next(error);
    }
};


export const exportCouriersToPdf = async (req, res, next) => {
    try {
        // Récupérer les mêmes paramètres de filtrage/tri
        const { startDate, endDate, status, nature, searchQuery, sortBy, sortOrder } = req.query;

        let whereConditions = {};
        let orderConditions = [];

        // Appliquer les mêmes logiques de filtrage/recherche/tri
         // 1. Filtration
        // Filtrage par plage de dates
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                whereConditions.date_depot = {
                    [Op.between]: [start, end]
                };
            }
        } else if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) {
                whereConditions.date_depot = {
                    [Op.gte]: start
                };
            }
        } else if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) {
                whereConditions.date_depot = {
                    [Op.lte]: end
                };
            }
        }

        // Filtrage par statut
        if (status) {
            whereConditions.status = status;
        }

        // Filtrage par nature
        if (nature) {
            whereConditions.nature = nature;
        }

        // 2. Recherche par mot-clé (dans objet ou contenu)
        if (searchQuery) {
            whereConditions[Op.or] = [
                { objet: { [Op.iLike]: `%${searchQuery}%` } },
                // Ajoutez d'autres champs textuels pertinents ici, par exemple 'contenu'
                // { contenu: { [Op.iLike]: `%${searchQuery}%` } }
            ];
            // Si vous aviez déjà des conditions dans whereConditions, assurez-vous de les combiner correctement.
            // Une approche plus robuste serait de construire d'abord un tableau de conditions, puis de le combiner avec Op.and.
        }

        // 3. Tri
        if (sortBy) {
            const validSortOrders = ['ASC', 'DESC'];
            const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
            orderConditions.push([sortBy, order]);
        } else {
            // Tri par défaut
            orderConditions.push(['date_depot', 'DESC']);
        }

        const couriers = await Courrier.findAll({
            where: whereConditions,
            order: orderConditions,
            raw: true
        });

        const doc = new PDFDocument();
        const filename = `rapport_courriers_${Date.now()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res); // Diriger le PDF vers la réponse HTTP

        // Contenu du PDF
        doc.fontSize(20).text('Rapport des Courriers', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Date de génération: ${new Date().toLocaleDateString()}`).moveDown();

        // Ajouter les données sous forme de tableau simple dans le PDF
        // Ceci est une implémentation simple. Pour des tableaux complexes, vous pourriez avoir besoin de libs comme 'pdfkit-table'
        couriers.forEach((courier, index) => {
            doc.text(`--- Courrier #${index + 1} ---`);
            doc.text(`Objet: ${courier.objet}`);
            doc.text(`Numéro: ${courier.numero_courrier}`);
            doc.text(`Date Dépôt: ${new Date(courier.date_depot).toLocaleDateString()}`);
            doc.text(`Statut: ${courier.statut}`);
            doc.moveDown();
        });

        doc.end(); // Finaliser le document PDF

    } catch (error) {
        console.error('Erreur lors de l\'exportation PDF:', error);
        next(error);
    }
};
