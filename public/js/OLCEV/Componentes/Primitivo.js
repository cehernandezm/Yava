var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Primitivo = /** @class */ (function (_super) {
    __extends(Primitivo, _super);
    function Primitivo(tipo, valor, l, c) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.l = l;
        _this.c = c;
        return _this;
    }
    Primitivo.prototype.ejecutar = function (ambito) {
        return new Nodo([], this.valor.toString(), this.tipo, "");
    };
    return Primitivo;
}(Valor));
