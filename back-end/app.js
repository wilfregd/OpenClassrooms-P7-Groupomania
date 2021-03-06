//Server
require('dotenv').config();
var fs = require('fs');
const debug = require('./debug');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const FileStore = require('session-file-store')(session);
const app = express();

//Database
const sequelize = require('./sequelize');
const createAssociations = require('./associations');

//Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

//Création des dossiers par défaut
const folders = [
    "./sessions",
    "./public/img/post",
    "./public/img/user",
    "./public/img/debug/posts",
    "./public/img/debug/user"
]

folders.forEach(folder => {
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder, {recursive: true});
    }
});

//Attribution des associations
createAssociations();

//Synchronisation des tables
console.log('> Synchronizing tables to database...');
sequelize.sync({ logging: false, alter: true })
.then(() => {
	//Creéation des données debug
	debug();
})
.catch(error => console.error(error));


//Default middlewares
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(express.static("public"));
app.use(express.json());

//Session midddleware
const storeOptions = {
    reapInterval: parseInt(process.env.SESSION_CLEANUP_INTERVAL)
};

const fileStore = new FileStore(storeOptions);

app.use(session({
    key: process.env.SESSION_COOKIE_NAME,
    secret: process.env.COOKIE_ENCRYPT_KEY,
    resave: false,
    saveUninitialized: false,
    store: fileStore,
    cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE)
    }
}));

//Access middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + parseFloat(process.env.CLIENT_PORT));
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Définition des routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);

module.exports = app;