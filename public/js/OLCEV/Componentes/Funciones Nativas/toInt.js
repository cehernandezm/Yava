var toInt = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function toInt(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    toInt.prototype.ejecutar = function (entorno) {
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var salida = new Nodo([]);
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.STRING) {
            salida.tipo = Tipo.INT;
            var posicion = Auxiliar.generarTemporal();
            var retorno = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del primer parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Le pasamos el apuntador de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1", "Posicion del segundo parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = 0", "Pasamos un acarreo inicial"));
            salida.codigo.push("call stringToNumber");
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 2", "Obtenemos la posicion del retorno"));
            salida.codigo.push(Auxiliar.crearLinea(retorno + " = Stack[" + posicion + "]", "Obtenemos el valor numerico de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
            salida.resultado = retorno;
            return salida;
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede aplicar la funcion toInt al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    toInt.prototype.primeraPasada = function (entorno) {
        return null;
    };
    return toInt;
}());
