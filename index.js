const http = require('http');

const express = require('express');

const app = express();

const path = require('path');

const server = require('http').createServer(app);

const bodyParser = require('body-parser');

const fs = require('fs');

//---------------------------------------------------- Configuracion del Servidor-----------------------------
const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

/**
 * DIRECCION DE INICIO
 */
app.get("/", function (solictud, respuesta) {
    respuesta.sendFile(path.join(__dirname + '/public/Pages/index.html'));
});

/**
 * localhost:3000/checkFile
 */

 app.post("/searchFile",function(solictud,respuesta){
    let direccion = solictud.body.direccion;
    let dir = path.join(__dirname,'public/Files/' + direccion);
    if(fs.existsSync(dir)){
        let content = fs.readFileSync(dir,).toString('utf8');
        salida = {
            error: false,
            codigo : content
        };
        respuesta.send(salida);
    }
    else{
        salida = {
            error: true
        };
        respuesta.send(salida);
    }
    
 });





app.get('*', function (solictud, respuesta) {
    respuesta.send("Error 404");
});


//------------------------------------------------- Configuracion de IP Y PUERTO -------------------------------------------------
server.listen(port, hostname, () => {
    console.log("Servidor Iniciado");
});