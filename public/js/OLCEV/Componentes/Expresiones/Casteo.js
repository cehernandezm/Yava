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
var Casteo = /** @class */ (function (_super) {
    __extends(Casteo, _super);
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param tipo
     * @param valor
     * @param expresion
     * @param l
     * @param c
     */
    function Casteo(tipo, valor, expresion, l, c) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.expresion = expresion;
        _this.l = l;
        _this.c = c;
        return _this;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    Casteo.prototype.ejecutar = function (entorno) {
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        var salida = new Nodo([]);
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (this.tipo === Tipo.INT && nodo.tipo === Tipo.DOUBLE) {
            salida.tipo = Tipo.INT;
            var posicion = Auxiliar.generarTemporal();
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(";############################## CASTEO TO INT ###########################");
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del primer parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Seteamos el valor del double a truncar"));
            salida.codigo.push("call trunk");
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1", "Obtenemos la posicion del return"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del return"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
            salida.resultado = temporal;
        }
        else if (this.tipo === Tipo.CHAR && nodo.valor === Tipo.DOUBLE) {
            salida.tipo = Tipo.CHAR;
            var posicion = Auxiliar.generarTemporal();
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(";############################## CASTEO TO CHAR ###########################");
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del primer parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Seteamos el valor del double a truncar"));
            salida.codigo.push("call trunk");
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1", "Obtenemos la posicion del return"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del return"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));
            salida.resultado = temporal;
        }
        else if (this.tipo === Tipo.CHAR && nodo.valor === Tipo.INT) {
            salida.tipo = Tipo.CHAR;
            salida.resultado = nodo.resultado;
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede castear el tipo:" + Tipo[this.tipo] + " de esta forma", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        return salida;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    Casteo.prototype.primeraPasada = function (entorno) {
        return null;
    };
    return Casteo;
}(Valor));
