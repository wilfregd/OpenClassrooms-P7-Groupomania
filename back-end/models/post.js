const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const User = require('./user');
const Comment = require('./comment');

const Post = sequelize.define('post', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    text:{
        type: Sequelize.TEXT,
        allowNull: true
    },

    image:{
        type: Sequelize.STRING,
        allowNull: true
    },

    timestamp:{
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: () => {
            const date = new Date();
            const zone = date.getTimezoneOffset() * 60000;
            return Date.now() - zone;
        },
    },
});

module.exports = Post;