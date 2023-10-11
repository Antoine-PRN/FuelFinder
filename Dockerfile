# Utilisez une image Node.js pour le front-end
FROM node:18-alpine

# Définissez le répertoire de travail
WORKDIR /FuelFinder/

# Copiez les fichiers du front-end dans le conteneur
COPY public/ /FuelFinder/public
COPY src/ /FuelFinder/src
COPY package.json /FuelFinder/

# Installez les dépendances
RUN npm install

# Construisez l'application React
RUN npm run build

# Exposez le port sur lequel le serveur web du front-end écoute (par défaut 3000 pour React)
EXPOSE 3000

# Commande pour démarrer le serveur web du front-end
CMD ["npm", "start"]
