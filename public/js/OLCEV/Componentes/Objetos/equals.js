var equals = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresionIzq
     * @param expresionDer
     * @param l
     * @param c
     */
    function equals(expresionIzq, expresionDer, l, c) {
        this.expresionIzq = expresionIzq;
        this.expresionDer = expresionDer;
        this.l = l;
        this.c = c;
    }
    equals.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresionIzq.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoIzq = resultado;
        resultado = this.expresionDer.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoDer = resultado;
        salida.codigo = salida.codigo.concat(nodoIzq.codigo);
        salida.codigo = salida.codigo.concat(nodoDer.codigo);
        var v = Auxiliar.generarEtiqueta();
        var f = Auxiliar.generarEtiqueta();
        if (nodoIzq.tipo === Tipo.ID && nodoDer.tipo === Tipo.ID) {
        }
        else if (nodoIzq.tipo === Tipo.ARREGLO && nodoDer.tipo === Tipo.ARREGLO) {
        }
        else {
            var mensaje = new MensajeError("Semantica", "equals no puede comparar los tipos: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo.push(Auxiliar.saltoCondicional(nodoIzq.resultado + " == " + nodoDer.resultado, v));
        salida.codigo.push(Auxiliar.saltoIncondicional(f));
        salida.tipo = Tipo.BOOLEAN;
        salida.verdaderas = [v];
        salida.falsas = [f];
        return salida;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    equals.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return equals;
}());
