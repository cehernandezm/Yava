var Aritmetica = /** @class */ (function () {
    function Aritmetica(izq, der, operacion, l, c) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }
    Aritmetica.prototype.ejecutar = function (ambito) {
        var valueIzq = this.izq.ejecutar(ambito);
        var valueDer = this.der.ejecutar(ambito);
        if (valueIzq instanceof MensajeError)
            return valueIzq;
        if (valueDer instanceof MensajeError)
            return valueIzq;
        var nodoIzq = valueIzq;
        var nodoDer = valueDer;
        var nodo = new Nodo([]);
        nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
        nodo.codigo = nodo.codigo.concat(nodoDer.codigo);
        var temporal = Auxiliar.generarTemporal();
        nodo.codigo.push(Auxiliar.crearLinea(temporal + " =" + nodoIzq.resultado + "+" + nodoDer.resultado, ""));
        nodo.resultado = temporal;
        nodo.tipo = Tipo.INT;
        return nodo;
    };
    return Aritmetica;
}());
