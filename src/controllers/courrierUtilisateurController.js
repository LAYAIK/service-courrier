import db from '../models/index.js';
const { CourrierUtilisateur } = db;

export const createCourrierUtilisateurController = async (req, res) => {
    try {
        const { id_courrier, id_utilisateur, date_transmission, date_reception, date_traitement,id_destinataire } = req.body;
        if (!id_courrier || !id_utilisateur) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }
        const existingCourrierUtilisateur = await CourrierUtilisateur.findOne({
            where: {
                id_courrier,
                id_utilisateur
            }
        });
        if (existingCourrierUtilisateur) {
            return res.status(400).json({ message: 'Ce courrier est déjà associé à cet utilisateur' });
        }
        const courrierUtilisateur = await CourrierUtilisateur.create({ id_courrier, id_utilisateur });
        if (date_transmission) courrierUtilisateur.date_transmission = date_transmission;
        if (date_reception) courrierUtilisateur.date_reception = date_reception;
        if (date_traitement) courrierUtilisateur.date_traitement = date_traitement;
        if (id_destinataire) courrierUtilisateur.id_destinataire = id_destinataire;
        await courrierUtilisateur.save();
        res.status(201).json({ message: 'Courrier utilisateur créé', data: courrierUtilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du courrier utilisateur' });
    }
};

export const getAllCourrierUtilisateursController = async (req, res) => {
    try {
        const courrierUtilisateurs = await CourrierUtilisateur.findAll();
        if (courrierUtilisateurs.length === 0) {
            return res.status(404).json({ message: 'Aucun courrier utilisateur trouvée' });
        }
        res.status(200).json({ message: 'Liste des courriers utilisateurs', data: courrierUtilisateurs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des courriers utilisateurs' });
    }
};

export const getCourrierUtilisateurByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID est requis' });
        }
        const courrierUtilisateur = await CourrierUtilisateur.findByPk(id);
        if (!courrierUtilisateur) {
            return res.status(404).json({ message: 'Courrier utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Courrier utilisateur trouvé', data: courrierUtilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du courrier utilisateur' });
    }
};

export const updateCourrierUtilisateurController = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_courrier, id_utilisateur, date_transmission, date_reception, date_traitement, id_destinataire } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID est requis' });
        }
        const courrierUtilisateur = await CourrierUtilisateur.findByPk(id);
        if (!courrierUtilisateur) {
            return res.status(404).json({ message: 'Courrier utilisateur non trouvé' });
        }
        if (id_courrier) courrierUtilisateur.id_courrier = id_courrier;
        if (id_utilisateur) courrierUtilisateur.id_utilisateur = id_utilisateur;
        if (date_transmission) courrierUtilisateur.date_transmission = date_transmission;
        if (date_reception) courrierUtilisateur.date_reception = date_reception;
        if (date_traitement) courrierUtilisateur.date_traitement = date_traitement;
        if (id_destinataire) courrierUtilisateur.id_destinataire = id_destinataire;
        const updatedCourrierUtilisateur = await courrierUtilisateur.save();
        res.status(200).json({ message: 'Courrier utilisateur mis à jour', data: updatedCourrierUtilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du courrier utilisateur' });
    }
};

export const deleteCourrierUtilisateurController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID est requis' });
        }
        const courrierUtilisateur = await CourrierUtilisateur.findByPk(id);
        if (!courrierUtilisateur) {
            return res.status(404).json({ message: 'Courrier utilisateur non trouvé' });
        }
        await courrierUtilisateur.destroy();
        res.status(200).json({ message: 'Courrier utilisateur supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du courrier utilisateur' });
    }
};
