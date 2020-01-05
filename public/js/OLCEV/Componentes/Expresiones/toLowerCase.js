var toLowerCase = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function toLowerCase(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    toLowerCase.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        if (nodo.tipo != Tipo.STRING) {
            var mensaje = new MensajeError("Semantico", "No se le puede aplicar toLowerCase() al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        var posicion = Auxiliar.generarTemporal();
        var temporal = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Pasamos la referencia de la cadena"));
        salida.codigo.push("call toLowerCase");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
        salida.tipo = Tipo.STRING;
        salida.valor = "";
        salida.localizacion = Localizacion.HEAP;
        salida.resultado = temporal;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    toLowerCase.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return toLowerCase;
}());
