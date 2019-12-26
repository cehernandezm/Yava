var Print = /** @class */ (function () {
    function Print(operacion, valor, l, c, posicion) {
        this.operacion = operacion;
        this.valor = valor;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    Print.prototype.ejecutar = function (ambito) {
        var resultado = (this.valor == null) ? null : this.valor.ejecutar(ambito);
        if (!(resultado instanceof MensajeError)) {
            if (this.operacion === 0)
                addMessage(Math.floor(resultado.valor));
            else if (this.operacion === 1) {
                var modulo = resultado.valor % 1;
                if (modulo === 0) {
                    if (resultado.valor === 10) {
                        addMessage("<br>");
                    }
                    else
                        addMessage(String.fromCharCode(resultado.valor));
                }
                else
                    addMessage(resultado.valor - 48);
            }
            else
                addMessage(resultado.valor);
        }
        return -1;
    };
    return Print;
}());
