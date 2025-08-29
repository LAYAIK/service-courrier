# Dockerfile pour le service de messagerie

FROM node:lts

# Étape 1: Définir les métadonnées du conteneur
LABEL name="service-courrier-et-autres"

LABEL author="Cabrel Nya"

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances (package.json et package-lock.json)
COPY package*.json ./

# Étape 4: Installer les dépendances de l'application

RUN npm install

# Étape 5: Copier le reste du code de l'application
# vers le répertoire de travail (/app) dans le conteneur.
COPY . .

# Étape 6: Exposer le port sur lequel l'application Node.js écoute
EXPOSE 3002

# Étape 7: Définir la commande pour démarrer l'application
CMD ["npm", "start"]
