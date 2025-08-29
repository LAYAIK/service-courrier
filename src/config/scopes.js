// Ex: Dans un fichier de configuration ou une constante
const DEFINED_SCOPES = {
    'document:statut:brouillon': 'Accès aux documents en brouillon',
    'document:statut:publie': 'Accès aux documents publiés',
    'document:statut:archive': 'Accès aux documents archivés',
    'utilisateur:profil:base': 'Accès au profil utilisateur de base',
    'utilisateur:profil:complet': 'Accès au profil utilisateur complet incluant informations sensibles'
};

const PERMISSION_SCOPE_REQUIREMENTS = {
    'document.modifier': { // La permission de modifier
        requiresOneOf: ['document:statut:brouillon', 'document:statut:publie'] // Peut modifier les brouillons ou les publiés
    },
    'document.supprimer': { // La permission de supprimer
        requires: 'document:statut:archive' // Ne peut supprimer que les documents archivés
    },
    'document.lire': { // La permission de lire
        // Par défaut, lire peut accéder à tout, mais on peut affiner
        // Ou on peut avoir une logique "dynamique" basée sur le document lui-même
    }
};