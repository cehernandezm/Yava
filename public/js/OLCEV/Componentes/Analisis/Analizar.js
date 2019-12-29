var Analizar = /** @class */ (function () {
    function Analizar(instrucciones) {
        this.instrucciones = instrucciones;
    }
    Analizar.prototype.ejecutar = function (id) {
        var nodo = new Nodo();
        nodo.codigo = [];
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionTrunk().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.functionNumberToCadena().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionPow().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.stringToNumber().codigo);
        this.instrucciones.forEach(function (clase) {
            var entorno = new Entorno(id);
            if (clase instanceof Clase) {
                var resultado = clase.primeraPasada(entorno);
                if (!(resultado instanceof MensajeError)) {
                    var res = resultado;
                    nodo.codigo = nodo.codigo.concat(res.codigo);
                }
            }
        });
        nodo.codigo.push("call constructor_hola");
        return nodo;
    };
    return Analizar;
}());
