var MensajeError = /** @class */ (function () {
    function MensajeError(tipo, detalle, archivo, l, c) {
        this.tipo = tipo;
        this.detalle = detalle;
        this.archivo = archivo;
        this.l = l;
        this.c = c;
    }
    return MensajeError;
}());
