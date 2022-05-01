const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const User = require('./user');
const Post = require('./post');

const Comment = sequelize.define('comment', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    text:{
        type: Sequelize.TEXT,
        allowNull: false
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

module.exports = Comment;