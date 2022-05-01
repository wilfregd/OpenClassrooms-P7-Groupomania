const bcrypt = require('bcrypt');

//Models
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

function createDebugData(){
    console.log("> Creating debug data...");

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
}

module.exports = createDebugData;