//Effacer la console pour rendre l'éxecution du serveur plus lisible
console.clear();

const http = require('http');
const app = require('./app');

const normalizedPort = (port) => {
    const normalized = parseInt(port);

    if(isNaN(port)){
        return normalized;
    }
    else if(normalized >= 0){
        return normalized;
    }
    return false;
}

const onErrorHandler = (error) => {
    console.error(error);
};

//Server init
const port = normalizedPort(process.env.PORT);
app.set('port', port);

//Server
const server = http.createServer(app);

server.on("error", onErrorHandler);
server.on("listening", () => {
    console.log('\x1b[36m%s\x1b[0m', "Server ready and listening on port " + port + '\n');
});

server.listen(port);