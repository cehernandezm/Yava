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
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionLength().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toCharArray().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toUpperCase().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toLoweCase().codigo);
        var claseActual = null;
        this.instrucciones.forEach(function (clase) {
            var entorno = new Entorno(id);
            if (clase instanceof Import) {
                var resultado = clase.ejecutar(entorno);
                if (resultado instanceof MensajeError)
                    return resultado;
                var res = resultado;
                nodo.codigo = nodo.codigo.concat(res.codigo);
            }
            if (clase instanceof Clase) {
                var resultado = clase.primeraPasada(entorno);
                if (resultado instanceof MensajeError)
                    return resultado;
                var f = clase.entorno.buscarFuncion("main_ARREGLO_", []);
                if (f != null)
                    claseActual = clase;
                console.log(clase);
                if (!(resultado instanceof MensajeError)) {
                    var res = resultado;
                    nodo.codigo = nodo.codigo.concat(res.codigo);
                }
            }
        });
        if (claseActual === null) {
            var mensaje = new MensajeError("Semantico", "No se encontro ningun metodo main para ejecutar", "principal", 0, 0);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var temporal = Auxiliar.generarTemporal();
        nodo.codigo.push("P = P + " + Auxiliar.posicion);
        nodo.codigo.push(temporal + " = P + 0");
        nodo.codigo.push("Stack[" + temporal + "] = H");
        nodo.codigo.push("H = H + " + claseActual.tamaño);
        nodo.codigo = nodo.codigo.concat(claseActual.codigo);
        nodo.codigo.push("call main_ARREGLO_");
        return nodo;
    };
    return Analizar;
}());
