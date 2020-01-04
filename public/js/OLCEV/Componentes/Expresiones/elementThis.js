var elementThis = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param l
     * @param c
     */
    function elementThis(id, l, c) {
        this.id = id;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    elementThis.prototype.ejecutar = function (entorno) {
        var s = entorno.buscarSimboloThis(this.id);
        if (s === null) {
            var mensaje = new MensajeError("Semantico", "El atributo: " + this.id + " no existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        return Primitivo.crearNodo(s);
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    elementThis.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return elementThis;
}());
