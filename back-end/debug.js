const bcrypt = require('bcrypt');

//Models
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

function createDebugData(){

    //Création de l'admin
    bcrypt.hash(process.env.DEBUG_ADMIN_PASSWORD, 10)
    .then(hash => {
        const userData = {
            nom: "admin",
            prenom: 'groupomania',
            email: process.env.DEBUG_ADMIN_EMAIL,
            password: hash,
            isAdmin: true,
            profilePic: "img/debug/user/groupomania.png",
            description: "Administrateur Groupomania",
        };

        User.findOne({ where: { email: userData.email }})
        .then(user => {
            if(!user){
                const newUser = User.build(userData)
                newUser.save()
                .then(() => {})
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

    //Création de faux comptes utilisateurs
    bcrypt.hash(process.env.DEBUG_ACCOUNTS_PASSWORD, 10)
    .then(hash => {
        User.bulkCreate([
            //H
            { nom: "doe", prenom: "john", email: "johndoe@groupomania.com", password: hash, profilePic: "img/debug/user/default.jpg", description: "Membre de Groupomania !"},
            { nom: "martin", prenom: "léo", email: "leomartin@groupomania.com", password: hash, profilePic: "img/debug/user/maleA.png", description: "Membre de Groupomania !"},
            { nom: "bernard", prenom: "gabriel", email: "gabrielbernard@groupomania.com", password: hash, profilePic: "img/debug/user/maleB.png", description: "Membre de Groupomania !"},
            { nom: "dubois", prenom: "arthur", email: "arthurdubois@groupomania.com", password: hash, profilePic: "img/debug/user/maleC.png", description: "Membre de Groupomania !"},
            { nom: "legrand", prenom: "quentin", email: "quentinlegrand@groupomania.com", password: hash, profilePic: "img/debug/user/maleD.png", description: "Membre de Groupomania !"},
            
            //F
            { nom: "doe", prenom: "jane", email: "janedoe@groupomania.com", password: hash, profilePic: "img/debug/user/default.jpg", description: "Membre de Groupomania !"},
            { nom: "martin", prenom: "jade", email: "jademartin@groupomania.com", password: hash, profilePic: "img/debug/user/femaleA.png", description: "Membre de Groupomania !"},
            { nom: "faure", prenom: "louise", email: "louisefaure@groupomania.com", password: hash, profilePic: "img/debug/user/femaleB.png", description: "Membre de Groupomania !"},
            { nom: "dubois", prenom: "emma", email: "emmadubois@groupomania.com", password: hash, profilePic: "img/debug/user/femaleC.png", description: "Membre de Groupomania !"},
            { nom: "legrand", prenom: "alice", email: "alicelegrand@groupomania.com", password: hash, profilePic: "img/debug/user/femaleD.png", description: "Membre de Groupomania !"},
        ],
        {
          ignoreDuplicates: true,
        })
		.then(() => {
			console.log("(Debug data created)");
		});
    })
}

module.exports = createDebugData;