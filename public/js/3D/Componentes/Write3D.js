var Write3D = /** @class */ (function () {
    function Write3D(numero, l, c, posicion) {
        this.numero = numero;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    Write3D.prototype.ejecutar = function (ambito) {
        var resultado = (this.numero == null) ? null : this.numero.ejecutar(ambito);
        if (resultado instanceof MensajeError)
            return resultado;
        var nu = resultado.valor;
        if (ambito.cadena == null)
            ambito.cadena = String.fromCharCode(+nu);
        else
            ambito.cadena += String.fromCharCode(+nu);
        return -1;
    };
    return Write3D;
}());
