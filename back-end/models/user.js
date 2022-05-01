const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Comment = require('./comment');
const Post = require('./post');

const User = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    nom:{
        type: Sequelize.STRING,
        allowNull: false,
        get(){
            const value = this.getDataValue('nom');
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },

    prenom:{
        type: Sequelize.STRING,
        allowNull: false,
        get(){
            const value = this.getDataValue('prenom');
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },

    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'email'
    },

    password:{
        type: Sequelize.STRING,
        allowNull: false
    },

    description:{
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
        get(){
            return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus sem in arcu tempus pharetra. Sed nisi enim, porta vitae porttitor sed, consequat eget risus. Suspendisse velit orci, ornare nec mollis at, aliquam nec felis. Proin pulvinar turpis sed fermentum luctus. Fusce dignissim tincidunt laoreet. Nulla cursus iaculis purus. Etiam eu ornare velit. Vivamus congue diam nec nisi convallis vehicula vel vitae erat.';
        }
    },

    profilePic:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        get(){
            let string = this.getDataValue('profilePic');
            if(string === ''){
                string = process.env.USER_DEFAULT_PIC; //Valeurs vides utilisent l'image par défaut (process.env.USER_DEFAULT_PIC)
            }
            return "http://localhost:8000/" + string;
        }
    },

    isAdmin:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    isBanned:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

User.prototype.getFullName = function(){
    return this.prenom + " " + this.nom;
};

module.exports = User;