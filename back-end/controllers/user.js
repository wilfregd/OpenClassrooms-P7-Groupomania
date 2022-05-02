const fs = require('fs');
const Sanitizer = require('../utils/sanitizer');
const sequelize = require('../sequelize');
const User = require('../models/user');

module.exports.getUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
    .then((user) => {
        if(user){
            return res.status(200).json(JSON.stringify(user));
        }
        else{
            return res.status(404).json(JSON.stringify({ error: 'User not found.' }));
        }
    })
    .catch(error => res.status(500).json(error));
};

module.exports.updateUserInfo = (req, res, next) => {
	
    if(!req.file && req.body.text === ""){
        console.error("Trying to edit post without content.");
        return res.status(400).json({ error: 'Le post ne peut pas être vide.' });
    }

    //On trouve l'utilisateur correspondant, il permet de s'occuper de l'image
    User.findOne({ where: { id: req.session.user.id }})
    .then(user => {
        if(user){
            //Vérification de l'utilisateur
            if(user.id == req.session.user.id || req.session.user.isAdmin){
                //Suppression de l'ancienne photo de profil si besoin
                if(req.file){
                    if(user.profilePic !== "" && !user.profilePic.includes('default.jpg')){
                        const imgStr = `${process.env.STATIC_PATH_IMG}/${user.profilePic.substr(7)}`;
                        fs.unlink(imgStr, () => {
                            console.log("Image deleted: " + imgStr);
                        });
                    }
                }
            }

            //Vérification des inputs
            const sanitizer = new Sanitizer(false);

            //Nom
            if(!sanitizer.isEmpty(req.body.nom, 'nom', "Le nom ne peut pas être vide.")){
                if(sanitizer.isSimpleString(req.body.nom, 'nom', "Le nom ne peut contenir que des lettres et/ou des tirets '-'")){
                    sanitizer.isLength(req.body.nom, 1, 25, 'nom', "Le nom doit être entre 1 et 25 caractères");
                }
            }

            //Prénom
            if(!sanitizer.isEmpty(req.body.prenom, 'prenom', "Le prénom ne peut pas être vide.")){
                if(sanitizer.isSimpleString(req.body.prenom, 'prenom', "Le prénom ne peut contenir que des lettres et/ou des tirets '-'")){
                    sanitizer.isLength(req.body.prenom, 1, 25, 'prenom', "Le prénom doit être entre 1 et 25 caractères");
                }
            }

            if(sanitizer.hasError){
                return res.status(400).json(sanitizer.errors);
            }

            const selectObj = {
                nom: sanitizer.sanitizeString(req.body.nom),
                prenom: sanitizer.sanitizeString(req.body.prenom),
                description: sanitizer.sanitizeString(req.body.description)
            };

            //Valide
            if(req.file){
                selectObj.profilePic = `${req.file.path.substr(7)}`;
            }

            //Mise à jour de l'utilisateur
            User.update(selectObj,
            {
                where: {
                    id: req.session.user.id
                }
            })
            .then(() => {

                console.log("User updated successfully!");
                const updatedUserData = {
                    id: req.session.user.id,
                    nom: selectObj.nom,
                    prenom: selectObj.prenom,
                    description: selectObj.description,
                    profilePic: (req.file ? "http://localhost:8000/" + `${req.file.path.substr(7)}` : user.profilePic),
                };

                return res.status(200).json(updatedUserData);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err)});
        }
        else{
            return res.status(404).json({ error: 'Utilisateur introuvable.'});
        }
    })
    .catch(err => res.status(500).json(err));
};

module.exports.deleteAccount = (req, res, next) => {
    if(req.body.id == req.session.user.id || req.session.user.isAdmin){
        //Obtention de l'utilisateur
        User.findOne({ where: {id: req.body.id}})
        .then(user => {
            //Delete pic if needed

            //Delete all comments

            //Delete all posts

            User.destroy({ where: { id: req.body.id }})
            .then(() => {
                req.session.destroy(err => {
                    res.clearCookie(process.env.SESSION_COOKIE_NAME);
                    return res.status(200).json({ message: 'Utilisateur supprimé.' });
                });
            })
            .catch(error => {
                console.error(error);
                return res.status(404).json(error);
            });      
        })
        .catch(error => res.status(500).json(error));   
    }
    else{
        return res.status(401).json({ error: 'Modification non autorisée.'});
    }
};