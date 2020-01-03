var Return = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASEs
     * @param expresion
     * @param l
     * @param c
     */
    function Return(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Return.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.BOOLEAN)
            nodo = Aritmetica.arreglarBoolean(nodo, salida);
        var posicion = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + (entorno.tamaño - 1), "Posicion del return"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Asignamos el return"));
        var retorno = Auxiliar.generarEtiqueta();
        salida.codigo.push(Auxiliar.saltoIncondicional(retorno));
        salida.retornos.push(retorno);
        salida.tipo = nodo.tipo;
        salida.valor = nodo.valor;
        return salida;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    Return.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Return;
}());
