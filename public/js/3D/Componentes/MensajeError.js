var MensajeError = /** @class */ (function () {
    function MensajeError(tipo, detalle, linea, columna) {
        this.tipo = tipo;
        this.detalle = detalle;
        this.linea = linea;
        this.columna = columna;
    }
    return MensajeError;
}());
