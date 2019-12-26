var Aritmetica = /** @class */ (function () {
    function Aritmetica(izq, der, operacion, l, c) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUAL
     */
    Aritmetica.prototype.ejecutar = function (entorno) {
        var valueIzq = this.izq.ejecutar(entorno);
        var valueDer = this.der.ejecutar(entorno);
        if (valueIzq instanceof MensajeError)
            return valueIzq;
        if (valueDer instanceof MensajeError)
            return valueIzq;
        var nodoIzq = valueIzq;
        var nodoDer = valueDer;
        var nodo = new Nodo([]);
        nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
        nodo.codigo = nodo.codigo.concat(nodoDer.codigo);
        switch (this.operacion) {
            case Operacion.SUMA: return this.suma(nodoIzq, nodoDer, nodo, entorno);
        }
    };
    /**
     * METODO QUE SE ENCARGARA DE RESOLVER LA SUMA
     * @param izq Operando izquierdo
     * @param der Operando derecho
     * @param salida nodo de resultado
     */
    Aritmetica.prototype.suma = function (izq, der, salida, entorno) {
        if ((izq.tipo === Tipo.INT && der.tipo === Tipo.DOUBLE) || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.INT)
            || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.CHAR) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.DOUBLE)
            || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.DOUBLE)) {
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + izq.resultado + " + " + der.resultado, ""));
            salida.tipo = Tipo.DOUBLE;
            salida.resultado = temporal;
            return salida;
        }
        else if ((izq.tipo === Tipo.INT && der.tipo === Tipo.CHAR) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.INT)
            || (izq.tipo === Tipo.INT && der.tipo === Tipo.INT) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.CHAR)) {
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + izq.resultado + " + " + der.resultado, ""));
            salida.tipo = Tipo.INT;
            salida.resultado = temporal;
            return salida;
        }
        else if (izq.tipo === Tipo.STRING || der.tipo === Tipo.STRING) {
            salida.tipo = Tipo.STRING;
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = H + 0", "Inicio de la nueva cadena"));
            salida.codigo = salida.codigo.concat(Auxiliar.concatenar(izq.resultado, izq.tipo, entorno).codigo);
            salida.codigo = salida.codigo.concat(Auxiliar.concatenar(der.resultado, der.tipo, entorno).codigo);
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            salida.resultado = temporal;
            return salida;
        }
        var mensaje = new MensajeError("Semantico", "No se puede sumar: " + izq.tipo + " con: " + der.tipo, entorno.archivo, this.l, this.c);
        Auxiliar.agregarError(mensaje);
        return mensaje;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno ENTORNO ACTUAL
     */
    Aritmetica.prototype.primeraPasada = function (entorno) {
        throw new Error("Method not implemented.");
    };
    return Aritmetica;
}());
