const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Sanitizer = require('../utils/sanitizer');
const User = require('../models/user');

module.exports.isUserLoggedIn = (req, res, next) => {
    if(!req.session || !req.session.user){
        return res.status(200).json({ message: 0 });
    }
    else{
        //Get logged in user info
        User.findOne({ where: { id: req.session.user.id }})
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports.signup = (req, res, next) => { //TODO don't allow if already logged in
    console.log("Réception de requête d'inscription: " + req.body.email);

    //Nettoyage de l'email
    const sanitizer = new Sanitizer();
    req.body.email = sanitizer.sanitizeString(req.body.email);

    //Vérification de l'email
    User.findOne({ where: { email: req.body.email } })
    .then(user => {
        const emailInUse = user != null;

        //Vérification des inputs
        try
        {
            //Email
            if(!emailInUse){
                if(!sanitizer.isEmpty(req.body.email, 'email_empty', "L'email ne peut pas être vide.")){
                    sanitizer.isEmail(req.body.email, "L'email est invalide. Le format doit être sous la forme 'john.doe@mail.com'");
                }
            }
            else{
                sanitizer.writeError('email', "L'email est déjà utilisé.");
            }

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

            //Mot de passe
            if(!sanitizer.isEmpty(req.body.password, 'password', "Le mot de passe ne peut pas être vide.")){
                sanitizer.isPassword(req.body.password, "Le mot de passe est invalide. Il doit contenir au moins un chiffre et/ou les symboles '@', '-', '_'");
                sanitizer.isLength(req.body.password, 8, 25, 'password', "Le mot de passe doit être entre 8 et 25 caractères");
            }        
            
        }
        catch(error){
            return res.status(400).json({ error: 'Paramètres invalides.' });
        }

        if(sanitizer.hasError){
            return res.status(400).json({ errors: sanitizer.errors });
        }

        //Vérifier si l'utilisateur existe
        if(!emailInUse)
        {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = User.build({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    password: hash,
                });

                user.save()
                .then(() => {
                    console.log('User created: ' + user.email);

                    //Get or create user session
                    req.session.user = {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        isBanned: user.isBanned
                    };
                    return res.status(201).json(user);
                })
                .catch(error => res.status(400).json(error));
            })
            .catch(error => {
                console.log(error);
                return res.status(400).json(error);
            });
        }
    })
    .catch(error => {
        console.log(error);
        return res.status(501).json(error);
    })
};

module.exports.login = (req, res, next) => { //TODO don't allow if already logged in
    console.log("Réception de requête de connection: " + req.body.email);

    //Nettoyage de l'email
    const sanitizer = new Sanitizer();
    req.body.email = sanitizer.sanitizeString(req.body.email);

    //Vérification de l'email
    User.findOne({ where: { email: req.body.email } })
    .then(user => {
        if(!user){
            return res.status(400).json({ error: "L'email ne corresond à aucun compte."});
        }

        //L'utilisateur existe, verification du mot de passe
        else{
            bcrypt.compare(req.body.password, user.password)
            .then(result => {
                if(!result){
                    return res.status(400).json({ error: 'Le mot de passe est incorrect. '});
                }
                else{
                    console.log("L'utilisateur '" + req.body.email + "' est connecté.");
                    
                    //Get or create user session
                    req.session.user = {
                        id: user.id,
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        isBanned: user.isBanned
                    };
                    return res.status(200).json(user);
                }
            })
            .catch(error => res.status(400).json(error));
        }
    })
    .catch(error => {
        console.log(error);
        return res.status(501).json(error);
    })
};

module.exports.logout = (req, res, next) => {
    if(req.session.user){
        const email = req.session.user.email;
        req.session.destroy(err => {
            if(err){
                console.error(err);
                return res.status(400).json({ error: 'Impossible de se déconnecter.'});
            }
            else{
                console.log("L'utilisateur '" + email + "' est déconnecté.");
                res.clearCookie(process.env.SESSION_COOKIE_NAME);
                return res.status(200).json({ error: 'Utilisateur déconnecté.'});
            }
        });
    }
    else{
        return res.status(401).json({ error: 'Utilisateur non connecté.'});
    }
};