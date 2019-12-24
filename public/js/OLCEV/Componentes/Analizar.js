var Analizar = /** @class */ (function () {
    function Analizar(instrucciones) {
        this.instrucciones = instrucciones;
    }
    Analizar.prototype.ejecutar = function (id) {
        this.instrucciones.forEach(function (clase) {
            var entorno = new Entorno(id);
            entorno.ambito = id;
            if (clase instanceof Clase)
                clase.primeraPasada(entorno);
            console.log(entorno);
        });
    };
    return Analizar;
}());
