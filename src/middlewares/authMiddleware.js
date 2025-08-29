import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig.js'; // Assurez-vous que le secret JWT est importé correctement
import db from '../models/index.js';

const { Utilisateur } = db;

// Middleware pour protéger les routes (vérifier le token)
 const authenticateToken = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token (ignorer "Bearer ")
      token = req.headers.authorization.split(' ')[1];
       console.log('Token extrait:', token); // Pour débogage, à supprimer en production
      // Vérifier le token
      if (!token) {
        return res.status(401).json({ message: 'Non autorisé, token manquant.' });
      };
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token décodé:', decoded); // Pour débogage, à supprimer en production


      const user = await Utilisateur.findByPk( decoded.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(401).json({ message: 'Non autorisé, utilisateur non rencontré.' });
      };
      req.user = {
        id_utilisateur: user.id_utilisateur
      }; 
      next(); // Passer au middleware ou contrôleur suivant

    } catch (error) {
      console.error('Erreur de validation du token:', error.message);
      return res.status(401).json({ message: 'Non autorisé, token invalide ou expiré.' });
    }
  } else {
    return res.status(401).json({ message: 'Non autorisé, pas de token fourni.' });
  } 
};

// Middleware pour restreindre l'accès basé sur les rôles

const authorize = (...roles) => { // Prend un tableau de rôles autorisés (ex: 'admin', 'agent')
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé, vous n\'avez pas la permission pour cette action.' });
    }
    next();
  };
};

export { authenticateToken, authorize };