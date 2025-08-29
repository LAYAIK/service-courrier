import db from '../models/index.js'; 

// C'est un objet qui mappe une permission à ses exigences de scope spécifiques.
const PERMISSION_SCOPE_REQUIREMENTS = {
    'document.modifier': { 
        requiresOneOf: ['document:statut:brouillon', 'document:id_status:id_status'] 
    },
    'document.supprimer': { 
        requires: 'document:statut:archive' 
    },
    'document.lire': { 
    }

    // Ajoutez d'autres permissions et leurs exigences de scope ici
};
const authorizeWithScopes = (requiredPermission, scopeContext = null) => {
    return async (req, res, next) => {
        // Vérifier l'authentification de l'utilisateur 
        if (!req.user || !req.user.id_utilisateur) {
            return res.status(401).json({ message: 'Authentification requise.' });
        }
        try {
            //Récupérer les rôles et permissions de l'utilisateur 
            const user = await db.Utilisateur.findByPk(req.user.id_utilisateur, {
                include: {
                    model: db.Role,
                    include: {
                        model: db.Permission, 
                        attributes: ['nom'] 
                    }
                }
            });
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
            // Collecte toutes les permissions uniques que l'utilisateur possède
            const userPermissions = new Set();
            user.Roles.forEach(role => {
                role.Permissions.forEach(permission => {
                    userPermissions.add(permission.nom);
                });
            });
            // Vérifier si l'utilisateur a la permission de base 
            if (!userPermissions.has(requiredPermission)) {
                return res.status(403).json({ message: 'Accès refusé : Permissions insuffisantes.' });
            }
            // Vérifier les exigences de scope (si définies pour cette permission)
            const scopeRequirements = PERMISSION_SCOPE_REQUIREMENTS[requiredPermission];

            if (scopeRequirements) { 
                if (scopeRequirements.requires && scopeRequirements.requires !== scopeContext) {
                    return res.status(403).json({ message: `Accès refusé : Le scope "${scopeRequirements.requires}" est requis.` });
                }

                // Vérification du scope 'requiresOneOf' (un des scopes d'une liste est requis)
                if (scopeRequirements.requiresOneOf && !scopeRequirements.requiresOneOf.includes(scopeContext)) {
                    return res.status(403).json({ message: `Accès refusé : Un des scopes suivants est requis : ${scopeRequirements.requiresOneOf.join(', ')}.` });
                }
            }
            next();

        } catch (error) {
            console.error('Erreur d\'autorisation avec scopes :', error);
            res.status(500).json({ message: 'Erreur interne du serveur lors de l\'autorisation.' });
        }
    };
};
 
export default authorizeWithScopes;