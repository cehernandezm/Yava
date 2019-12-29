var Valor = /** @class */ (function () {
    function Valor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
    }
    return Valor;
}());
var Tipo;
(function (Tipo) {
    Tipo[Tipo["INT"] = 0] = "INT";
    Tipo[Tipo["DOUBLE"] = 1] = "DOUBLE";
    Tipo[Tipo["STRING"] = 2] = "STRING";
    Tipo[Tipo["CHAR"] = 3] = "CHAR";
    Tipo[Tipo["BOOLEAN"] = 4] = "BOOLEAN";
    Tipo[Tipo["ID"] = 5] = "ID";
})(Tipo || (Tipo = {}));
;
var Operacion;
(function (Operacion) {
    Operacion[Operacion["SUMA"] = 0] = "SUMA";
    Operacion[Operacion["RESTA"] = 1] = "RESTA";
    Operacion[Operacion["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operacion[Operacion["DIVISION"] = 3] = "DIVISION";
    Operacion[Operacion["POTENCIA"] = 4] = "POTENCIA";
    Operacion[Operacion["NEGATIVO"] = 5] = "NEGATIVO";
    Operacion[Operacion["INCREMENTOPRE"] = 6] = "INCREMENTOPRE";
    Operacion[Operacion["DECREMENTOPRE"] = 7] = "DECREMENTOPRE";
    Operacion[Operacion["INCREMENTOPOS"] = 8] = "INCREMENTOPOS";
    Operacion[Operacion["DECREMENTOPOS"] = 9] = "DECREMENTOPOS";
    Operacion[Operacion["OR"] = 10] = "OR";
    Operacion[Operacion["AND"] = 11] = "AND";
    Operacion[Operacion["NEGACION"] = 12] = "NEGACION";
})(Operacion || (Operacion = {}));
;
var Modificador;
(function (Modificador) {
    Modificador[Modificador["PUBLIC"] = 0] = "PUBLIC";
    Modificador[Modificador["PROTECTED"] = 1] = "PROTECTED";
    Modificador[Modificador["PRIVATE"] = 2] = "PRIVATE";
    Modificador[Modificador["STATIC"] = 3] = "STATIC";
    Modificador[Modificador["FINAL"] = 4] = "FINAL";
    Modificador[Modificador["ABSTRACT"] = 5] = "ABSTRACT";
})(Modificador || (Modificador = {}));
var Visibilidad;
(function (Visibilidad) {
    Visibilidad[Visibilidad["PUBLIC"] = 0] = "PUBLIC";
    Visibilidad[Visibilidad["PROTECTED"] = 1] = "PROTECTED";
    Visibilidad[Visibilidad["PRIVATE"] = 2] = "PRIVATE";
})(Visibilidad || (Visibilidad = {}));
var Localizacion;
(function (Localizacion) {
    Localizacion[Localizacion["HEAP"] = 0] = "HEAP";
    Localizacion[Localizacion["STACK"] = 1] = "STACK";
})(Localizacion || (Localizacion = {}));
var Rol;
(function (Rol) {
    Rol[Rol["CLASE"] = 0] = "CLASE";
    Rol[Rol["VARIABLE"] = 1] = "VARIABLE";
})(Rol || (Rol = {}));
