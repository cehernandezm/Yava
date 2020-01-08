var Declaracion3D = /** @class */ (function () {
    function Declaracion3D(id, expresion, l, c, posicion) {
        this.id = id;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    Declaracion3D.prototype.ejecutar = function (ambito) {
        var resultado = this.expresion.ejecutar(ambito);
        if (resultado instanceof MensajeError)
            return -1;
        return ambito.agregarTemporal({ id: this.id, valor: resultado.valor, tipo: "number", ambito: ambito.getEntorno() });
    };
    return Declaracion3D;
}());
