var toUpperCase = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function toUpperCase(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    toUpperCase.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        if (nodo.tipo != Tipo.STRING) {
            var mensaje = new MensajeError("Semantico", "No se le puede aplicar toUpperCase() al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        var posicion = Auxiliar.generarTemporal();
        var temporal = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Pasamos la referencia de la cadena"));
        salida.codigo.push("call toUpperCase");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
        salida.tipo = Tipo.STRING;
        salida.valor = "";
        salida.localizacion = Localizacion.HEAP;
        salida.resultado = temporal;
        return salida;
    };
    toUpperCase.prototype.primeraPasada = function (entorno) {
        throw new Error("Method not implemented.");
    };
    return toUpperCase;
}());
