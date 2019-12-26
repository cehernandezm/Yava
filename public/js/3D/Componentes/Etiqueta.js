var Etiqueta = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param nombre
     * @param l
     * @param c
     * @param pos
     */
    function Etiqueta(nombre, l, c, pos) {
        this.nombre = nombre;
        this.l = l;
        this.c = c;
        this.posicion = pos;
    }
    /**
     * METODO DE LA CLASE PADRE
     */
    Etiqueta.prototype.ejecutar = function (ambito) {
        var resultado = buscarEtiqueta(this.nombre);
        agregarEtiqueta({ nombre: this.nombre, posicion: this.posicion });
        return -1;
    };
    return Etiqueta;
}());
