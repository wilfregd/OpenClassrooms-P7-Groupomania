const sequelize = require('./sequelize');

//Models
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

//L'attribution des associations se fait a l'éxtérieur des modèles
//pour être sûr que tous soient créés avant les références.
function createAssociations(){
    console.log('> Creating Associations...');

    //Users
    User.hasMany(Post, {
        onDelete: 'CASCADE', hooks: true
    });
    Post.belongsTo(User, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
        foreignKey: 'userId'
    });

    //Posts
    Post.hasMany(Comment, {
        onDelete: 'CASCADE', hooks: true
    });
    Comment.belongsTo(Post, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
        foreignKey: 'postId'
    });

    //Comments
    User.hasMany(Comment);
    Comment.belongsTo(User, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
        foreignKey: 'userId'
    });
}

module.exports = createAssociations;