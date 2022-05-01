require('dotenv').config();

const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (isAdmin = false) => (req, res, next) => {
    try {
        if(!req.session || !req.session.user){
            return res.status(401).json({ error: 'Auth required.' });
        }

        const user = req.session.user;

        if(req.body.userId && req.body.userId !== user.id){
            throw 'Invalid user Id';
        }
        else{
            if((isAdmin == false && !user.isAdmin) || user.isAdmin){
                next();
            }
            else{
                return res.status(403).json({ error: 'Access denied.' });
            }
        }
    }
    catch {
        return res.status(403).json({ error: 'Access denied.'});
    }
};