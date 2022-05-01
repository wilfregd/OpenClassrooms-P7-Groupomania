const fs = require('fs');
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

            //Mise à jour du post
            const selectObj = {
                nom: req.body.nom,
                prenom: req.body.prenom,
                description: req.body.description,
            };

            if(req.file){
                console.log(req.file);
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
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    description: req.body.description,
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