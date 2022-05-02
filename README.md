# OpenClassrooms-P7 - Groupomania

- VueJs
- NodeJs + express + sequelize
- Mysql

## Base de données

- Se connecter au serveur **MySql** de votre choix.
- Créer la base de données "groupomania".
- Les identifiants et informations de connection à modifier se trouvent dans le fichier .env du dossier back-end
> Les tables seront générées par le serveur au lancement si elles n'existent pas déjà.
Vérifiez les identifiants en haut du fichier .env du dossier back-end.


## Frontend

Ouvrir le dossier front-end dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    npm run serve

si le navigateur ne s'ouvre pas automatiquement allez à :

- http://localhost:8080/auth

## Backend

Ouvrir le dossier back-end dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    node server
	
Après le démarrage du serveur ("Server ready and listening on port"), des données "debug" seront ajoutées à la base de données.
Elles donnent accès à des utilisateurs fictifs et leur création sera notifiée quelque secondes après le lancement du serveur.

## Utilisation

Pour s'inscrire sur le site, il vous faut renseigner :

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

## Compte administrateur: 
- email: admin@groupomania.com
- mot de passe: secret_123

## Comptes par défaut

Un certain nombre de comptes sont générés par défaut lors du démarrage du serveur.
Ils sont tous accessibles via leur adresse mail et le mot de passe "secret_123":

- johndoe@groupomania.com
- leomartin@groupomania.com
- gabrielbernard@groupomania.com
- arthurdubois@groupomania.com
- quentinlegrand@groupomania.com

- janedoe@groupomania.com
- jademartin@groupomania.com
- louisefaure@groupomania.com
- emmadubois@groupomania.com
- alicelegrand@groupomania.com