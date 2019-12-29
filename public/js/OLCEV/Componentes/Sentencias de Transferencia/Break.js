var Break = /** @class */ (function () {
    function Break() {
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    Break.prototype.ejecutar = function (entorno) {
        var nodo = new Nodo([]);
        var salto = Auxiliar.generarEtiqueta();
        nodo.codigo.push(Auxiliar.saltoIncondicional(salto));
        nodo.breaks.push(salto);
        return nodo;
    };
    /**
     * PRIMERA PASADA RETORNA UN 0
     * @param entorno
     */
    Break.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Break;
}());
