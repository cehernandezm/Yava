var Analizar = /** @class */ (function () {
    function Analizar(instrucciones) {
        this.instrucciones = instrucciones;
    }
    Analizar.prototype.ejecutar = function (id) {
        this.instrucciones.forEach(function (clase) {
            var entorno = new Entorno(id);
            entorno.ambito.push(id);
            if (clase instanceof Clase) {
                var resultado = clase.primeraPasada(entorno);
                console.log(resultado);
            }
            //console.log(entorno);
        });
    };
    return Analizar;
}());
