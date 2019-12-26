var Funcion = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param instrucciones
     * @param l
     * @param c
     * @param posicion
     */
    function Funcion(id, instrucciones, l, c, posicion) {
        this.id = id;
        this.instrucciones = instrucciones;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    Funcion.prototype.ejecutar = function (ambito) {
        var instruccion = new Instruccion(this.instrucciones, ambito);
        instruccion.ejecutar();
        return -1;
    };
    return Funcion;
}());
