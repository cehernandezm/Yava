const http = require('http');

const express = require('express');

const app = express();

const path = require('path');

const server = require('http').createServer(app);

//---------------------------------------------------- Configuracion del Servidor-----------------------------
const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));


app.get("/", function (solictud, respuesta) {
    respuesta.sendFile(path.join(__dirname + '/public/Pages/index.html'));
});

app.get('*', function (solictud, respuesta) {
    respuesta.send("Error 404");
});

//------------------------------------------------- Configuracion de IP Y PUERTO -------------------------------------------------
server.listen(port, hostname, () => {
    console.log("Servidor Iniciado");
});