var CallFuncion = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param l
     * @param c
     * @param posicion
     */
    function CallFuncion(id, l, c, posicion) {
        this.id = id;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    CallFuncion.prototype.ejecutar = function (ambito) {
        ambito.entornos.push(this.id);
        var funcion = buscarFuncion(this.id);
        if (funcion === null)
            addMensajeError("Semantico", "La funcion: " + this.id + " no existe", this.l, this.c);
        else
            funcion.ejecutar(ambito);
        ambito.limpiarEntorno(ambito.getEntorno());
        ambito.entornos.pop();
        return -1;
    };
    return CallFuncion;
}());
