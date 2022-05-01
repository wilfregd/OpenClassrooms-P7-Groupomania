const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

//----- POSTS -----
module.exports.getAllPost = (req, res, next) => {
    console.log(req.params);
    const options = {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['nom', 'prenom', 'profilePic']
            },
            {
                model: Comment,
                as: 'comments',
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['nom', 'prenom', 'profilePic']
                    },
                ]
            }
        ]
    };

    if(req.params.id){
        options.where = {
            userId: req.params.id
        }
    }

    Post.findAll(options)
    .then(posts => {
        return res.status(200).json(posts);
    })
    .catch(err =>
        {
        console.log(err);
        return res.status(404).json({err})}
        );
};

module.exports.getPost = (req, res, next) => {
    Post.findOne({ where: { id: req.body.id }})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(404).json({err}));
};

module.exports.createPost = (req, res, next) => {
    console.log("creating post");
    //Check if post is empty
    if(!req.file && req.body.text === ""){
        console.error("Trying to create post without content.");
        return res.status(400).json({ error: 'Le post ne peut pas être vide.' });
    }

    console.log("creating post");
    
    //Obtention de l'utilisateur créant le post
    User.findOne({
        attributes: { include: ['id', 'nom', 'prenom'] },
        where: { id: req.session.user.id }
    })
    .then(user => {
        console.log("Creating post from user '"+ user.getFullName() + " (" + user.id + ")'"); 
        
        //Création de l'instance du post
        Post.create({
            text: req.body.text, //TODO sanitize this
            image: (req.file ? `${req.file.path.substr(7)}` : ""),
            userId: user.id
        },{
            include: [
                {
                    model: User,
                    attributes: ["id"]
                }
            ]
        })
        .then(post => {
            //Insertion du post dans la BDD
            post.save()
            .then(result => {
                console.log("Post created!");
                console.log(post.timestamp);
                return res.status(201).json({ message: "Post créé." });
            })
            .catch(error => res.status(400).json({ error: 'Paramètres invalides.' }));
        });
    })
    .catch(error => res.status(500).json(error));
};

module.exports.removePostImage = (req, res, next) => {
    //On trouve le post correspondant, il permet de s'occuper de l'image
    Post.findOne({ where: { id: req.body.id }})
    .then(post => {
        if(post){
            //Vérification de l'utilisateur qui a créé le post
            if(post.userId == req.session.user.id || req.session.user.isAdmin){
                //Suppression du fichier
                if(post.image !== "")
                {
                    const imgStr = `${process.env.STATIC_PATH_IMG}/${post.image.substr(4)}`;
                    fs.unlink(imgStr, () => {
                        console.log("Image deleted: " + imgStr);
                    });
                }
                //Suppression de l'image dans la BDD
                Post.update({
                    image: "",
                },
                {
                    where: { id: req.body.id }
                })
                .then(() => {
                    const updatedPostData = {
                        id: post.id,
                        text: post.text,
                        isImageEdited: true,
                        image: "",
                    };

                    return res.status(200).json(updatedPostData);
                })
                .catch(err => res.status(400).json(err));       
            }
            else{
                return res.status(401).json({ error: 'Modification non autorisée.'});
            }
        }
        else{
            return res.status(404).json({ error: 'Post introuvable.'});
        }
    })
    .catch(err => res.status(500).json(err));
};

module.exports.updatePost = (req, res, next) => {
    //On trouve le post correspondant, il permet de s'occuper de l'image
    Post.findOne({ where: { id: req.body.id }})
    .then(post => {
        if(post){

            if((!req.file && req.body.text === "") && post.image == ""){
                console.error("Trying to edit post without content.");
                return res.status(400).json({ error: 'Le post ne peut pas être vide.' });
            }

            //Vérification de l'utilisateur qui a créé le post
            if(post.userId == req.session.user.id || req.session.user.isAdmin){
                //Suppression de l'ancienne image si une nouvelle est uploadée
                if(req.file){
                    if(post.image !== "")
                    {
                        const imgStr = `${process.env.STATIC_PATH_IMG}/${post.image.substr(4)}`;
                        fs.unlink(imgStr, () => {
                            console.log("Image deleted: " + imgStr);
                        });
                    }
                }

                //Mise à jour du post
                const selectObj = {
                    text: req.body.text
                };
                
                if(req.file){
                    selectObj.image = `${req.file.path.substr(7)}`;
                }

                Post.update(selectObj,
                {
                    where: { id: req.body.id }
                })
                .then(() => {
                    console.log("Post updated successfully!");
                    
                    const updatedPostData = {
                        id: post.id,
                        text: req.body.text,
                        isImageEdited: req.file ? true : false,
                        image: (req.file ? `${req.file.path.substr(7)}` : ""),
                    };

                    return res.status(200).json(updatedPostData);
                })
                .catch(err => res.status(400).json(err));
            }
            else{
                return res.status(401).json({ error: 'Modification non autorisée.'});
            }
        }
        else{
            return res.status(404).json({ error: 'Post introuvable.'});
        }
    })
    .catch(err => res.status(500).json(err));
};

module.exports.deletePost = (req, res, next) => {
    //On trouve le post correspondant, il permet de s'occuper de l'image
    Post.findOne({ where: { id: req.params.id }})
    .then(post => {
        if(post){
            //Vérification de l'utilisateur qui a créé le post
            if(post.userId == req.session.user.id || req.session.user.isAdmin){
                //On supprime l'image si besoin
                if(post.image !== "")
                {
                    const imgStr = `${process.env.STATIC_PATH_IMG}/${post.image.substr(4)}`;
                    fs.unlink(imgStr, () => {
                        console.log("Image deleted: " + imgStr);
                    });
                }

                //On supprime le post de la BDD
                Post.destroy({ where: { id: req.params.id }})
                .then(result => {
                    if(result == 1){
                        console.log("Post (" + req.params.id + ") was deleted from database.");
                        return res.status(200).json({ message: 'Post supprimé.' });
                    }
                    else{
                        console.error("Post (" + req.params.id + ") was not found or not deleted from database.");
                        return res.status(500).json({ error: 'Post non supprimé.' });
                    }
                })
                .catch(error => {
                    console.error(error);
                    return res.status(404).json(error);
                });
            }
            else{
                return res.status(401).json({ error: 'Modification non autorisée.'});
            }
        }
        else{
            return res.status(400).json({ error: 'Post introuvable. '});
        }
    })
    .catch(err => res.status(500).json(err));
}

//----- COMMENTS -----
module.exports.getComment = (req, res, next) => {
    Comment.findOne({
         where: { 
             id: req.body.id 
        },
        include: [
            {
                model: Post,
                as: 'post',
                attributes: ["id"]
            },
            {
                model: User,
                as: 'user',
                attributes: ["id", "nom", "prenom", "profilePic"],
            }
        ]
    })
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(404).json({ err}));
};

module.exports.createComment = (req, res, next) => {
    //Obtention de l'utilisateur créant le commentaire
    User.findOne({
        attributes: { include: ['id', 'nom', 'prenom'] },
        where: { id: req.session.user.id }
    })
    .then(user => {
        //Obtention du post possédant le commentaire
        Post.findOne({ where: { id: req.body.id }})
        .then(post => {
            //Création du commentaire
            Comment.create({
                text: req.body.text, //TODO sanitize this
                postId: post.id,
                userId: user.id
            }, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ["id", "nom", "prenom", "profilePic"],
                    }
                ]
            })
            .then(comment => {
                //Insertion du commentaire dans la BDD
                comment.save({
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ["id", "nom", "prenom", "profilePic"],
                        }
                    ]
                })
                .then(result => {
                    console.log("Comment created!");
                    return res.status(201).json(comment);
                })
                .catch(error => res.status(500).json({ error: 'Commentaire non créé.' }));
            })
            .catch(error => res.status(400).json({ error: 'Paramètres invalides.' }));
        })
        .catch(error => res.status(500).json(error));
    })
    .catch(error => res.status(500).json(error));
};

module.exports.updateComment = (req, res, next) => {
    //Obtention du commentaire
    Comment.findOne({ where: { id: req.body.id }})
    .then(comment => {
        if(comment)
        {
            //Vérification de l'utilisateur qui a créé le commentaire
            if(comment.userId == req.session.user.id || req.session.user.isAdmin){
                Comment.update({
                    text: req.body.text
                },
                {
                    where: { id: req.body.id }
                })
                .then(result => {
                    console.log("Comment updated successfully!");
                    return res.status(200).json({ message: "Le commentaire a été modifié." });
                })
                .catch(err => res.status(500).json(err));
            }
            else{
                return res.status(401).json({ error: 'Modification non autorisée.'});
            }
        }
        else{
            return res.status(404).json({ error: "Le commentaire n'existe pas." });
        }
    })
    .catch(err => res.status(500).json(err)); 
};

module.exports.deleteComment = (req, res, next) => {
    //Obtention du commentaire
    Comment.findOne({ where: {id: req.params.id}})
    .then(comment => {
        //Vérification de l'utilisateur
        if(comment.userId == req.session.user.id || req.session.user.isAdmin){
            Comment.destroy({ where: { id: req.params.id }})
            .then(() => {
                console.log("Comment (" + req.params.id + ") was deleted from database.");
                return res.status(200).json({ message: 'Comment successfully deleted' });
            })
            .catch(error => {
                console.error(error);
                return res.status(500).json(error);
            });
        }
        else{
            return res.status(401).json({ error: 'Modification non autorisée.'});
        }
    })
    .catch(error => {
        console.error(error);
        return res.status(404).json(error);
    });
};