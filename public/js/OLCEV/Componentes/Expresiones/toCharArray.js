var toCharArray = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function toCharArray(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    toCharArray.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        if (nodo.tipo != Tipo.STRING) {
            var mensaje = new MensajeError("Semantico", "No se le puede aplicar toCharArray() al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        var posicion = Auxiliar.generarTemporal();
        var temporal = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Pasamos la referencia de la cadena"));
        salida.codigo.push("call toCharArray");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
        salida.tipo = Tipo.ARREGLO;
        salida.valor = new Arreglo(Tipo.CHAR, 1);
        salida.localizacion = Localizacion.HEAP;
        salida.resultado = temporal;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    toCharArray.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return toCharArray;
}());
