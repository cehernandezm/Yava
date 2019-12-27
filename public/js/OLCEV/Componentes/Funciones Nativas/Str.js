var Str = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function Str(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    Str.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.STRING)
            return salida;
        else if (nodo.tipo === Tipo.INT) {
            salida.codigo.push(";############################### CAST INT TO STRING ######################");
            var posicion = Auxiliar.generarTemporal();
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Almacenamos el numero a convertir"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = H", "Almacenamos el inicio de la cadena"));
            salida.codigo.push("call numberToCadena");
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
            salida.tipo = Tipo.STRING;
            salida.resultado = temporal;
        }
        return salida;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Str.prototype.primeraPasada = function (entorno) {
        return null;
    };
    return Str;
}());
