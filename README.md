# OpenClassrooms-P7 - Groupomania

- VueJs
- NodeJs + express + sequelize
- Mysql

## Base de données

Se connecter au serveur **MySql** de votre choix.
Créer la base de données "groupomania"
Les tables seront générées par le serveur au lancement si elles n'existent pas déjà.
Vérifiez les identifiants en haut du fichier .env du dossier back-end.


## Frontend

Ouvrir le dossier front-end dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    npm run serve

si le navigateur ne s'ouvre pas automatiquement allez à :

- http://localhost:8080/

## Backend

Ouvrir le dossier back-end dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    node server

## Utilisation

Pour s'inscrire sur sire, il vous faut renseigner :

- Un nom (de 1 à 20 caractères)
- Un prénom (de 1 à 20 caractères)
- Une adresse mail valide
- Un mot de passe (de 8 à 25 caractères, lettres, chiffres, espaces et symboles '@', '-', '_'" sont autorisés).

Une fois connecté:

- Voir les publications de tout les utilisateurs
- Poster une publication text, image, ou les deux (au choix)
- Commenter les publications
- Modifier/Supprimer ses propres publications et commentaires
- Voir le profil d'un utilisateur en particulier ainsi que ses propres publications
- Modifier ses informations personnelles
- Supprimer son compte
- (Si administrateur) Modifier/Supprimer les publications et commentaires des membres

Compte administrateur: 
email: admin@groupomania.com
mot de passe: secret_123