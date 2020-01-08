var Write = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function Write(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    Write.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        if (nodo.tipo != Tipo.STRING) {
            var mensaje = new MensajeError("Semantico", "Se necesita que sea una cadena la que se escribira en el archivo", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        var f = Auxiliar.generarEtiqueta();
        var s = Auxiliar.generarEtiqueta();
        var valor = Auxiliar.generarTemporal();
        salida.codigo.push(valor + " = Heap[" + nodo.resultado + "]");
        salida.codigo.push(Auxiliar.saltoCondicional(valor + " == 0", f));
        salida.codigo.push(f + ":");
        salida.codigo.push("exit(0)");
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Write.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Write;
}());
