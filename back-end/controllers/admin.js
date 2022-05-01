const User = require("../models/user");

module.exports.banUser = (req, res, next) => {
    processBan(req, res, next, true);
};

module.exports.unbanUser = (req, res, next) => {
    processBan(req, res, next, false);
};

function processBan(req, res, next, banState){ //TODO test this + test with admin auth
    const userId = req.body.id;
    User.findOne({ where: { id: userId }})
    .then(user => {
        if(user){
            user.isBanned = banState;
            user.save()
            .then(result => {
                if(result == 1){
                    return res.status(200).json({ message: 'User "' +  user.getFullName() + '" was banned' });
                }
                else{
                    return res.status(500).json({ message: 'User "' +  user.getFullName() + '" was not banned' });
                }
            })
            .catch(error => res.status(400).json(error));      
        }
        else{
            return res.status(404).json({ error: 'User not found.' });
        }
    })
    .catch(error => res.status(500).json(error));
}