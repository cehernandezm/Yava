var Incondicional = /** @class */ (function () {
    function Incondicional(pos, l, c, etiqueta) {
        this.posicion = pos;
        this.l = l;
        this.c = c;
        this.etiqueta = etiqueta;
    }
    Incondicional.prototype.ejecutar = function (ambito) {
        var etiqueta = buscarEtiqueta(this.etiqueta);
        if (etiqueta != null)
            return etiqueta.posicion;
        addMensajeError("Semantico", "La etiqueta: " + this.etiqueta + " no existe", this.l, this.c);
        return -1;
    };
    return Incondicional;
}());
