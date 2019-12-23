var Valor = /** @class */ (function () {
    function Valor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
    }
    Valor.prototype.getTipo = function () {
        return this.tipo;
    };
    Valor.prototype.setTipo = function (tipo) {
        this.tipo = tipo;
    };
    Valor.prototype.getValor = function () {
        return this.valor;
    };
    Valor.prototype.setValor = function (valor) {
        this.valor = valor;
    };
    return Valor;
}());
var Tipo;
(function (Tipo) {
    Tipo[Tipo["INT"] = 0] = "INT";
    Tipo[Tipo["DOUBLE"] = 1] = "DOUBLE";
    Tipo[Tipo["STRING"] = 2] = "STRING";
    Tipo[Tipo["CHAR"] = 3] = "CHAR";
    Tipo[Tipo["ID"] = 4] = "ID";
})(Tipo || (Tipo = {}));
;
var Operacion;
(function (Operacion) {
    Operacion[Operacion["SUMA"] = 0] = "SUMA";
})(Operacion || (Operacion = {}));
;
