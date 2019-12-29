var Continue = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     */
    function Continue() {
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUALs
     */
    Continue.prototype.ejecutar = function (entorno) {
        var nodo = new Nodo([]);
        var salto = Auxiliar.generarEtiqueta();
        nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoIncondicional(salto), "Salto de continue"));
        nodo.continue.push(salto);
        return nodo;
    };
    /**
     * PRIMERA PASADA RETORNA UN 0
     * @param entorno
     */
    Continue.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Continue;
}());
