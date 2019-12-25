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
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param tipo TIPO DE PRIMITIVO
     * @param valor VALOR DEL PRIMITIVO
     * @param l LINEA DE LA INSTRUCCION
     * @param c COLUMNA DE LA INSTRUCCION
     */
    function Primitivo(tipo, valor, l, c) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.l = l;
        _this.c = c;
        return _this;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Primitivo.prototype.ejecutar = function (entorno) {
        switch (this.tipo) {
            case Tipo.INT:
            case Tipo.DOUBLE:
                return new Nodo([], this.valor.toString(), this.tipo, "");
            case Tipo.CHAR:
                var ascii = this.valor.toString().charCodeAt(1);
                return new Nodo([], ascii, this.tipo, "");
            case Tipo.STRING:
                return this.setearCadena(this.valor.toString());
        }
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno Entorno Actual
     */
    Primitivo.prototype.primeraPasada = function (entorno) {
        return null;
    };
    /**
     * METODO QUE SE ENCARGARA DE GUARDAR LA CADENA
     * EN EL HEAP Y A SU VEZ
     * ARREGLAR LAS SECUENCIAS DE ESCAPE
     * @param cadena cadena a transformar
     */
    Primitivo.prototype.setearCadena = function (cadena) {
        var nodo = new Nodo();
        nodo.codigo = [];
        nodo.tipo = Tipo.STRING;
        cadena = cadena.substring(1, cadena.length - 1);
        var cadenaTemp = cadena;
        cadena = cadena.replace("\\n", "\n");
        cadena = cadena.replace("\\t", "\t");
        cadena = cadena.replace("\\\"", "\"");
        cadena = cadena.replace("\\\'", "\'");
        nodo.codigo.push(";########### GUARDANDO CADENA: " + cadenaTemp + " ############################");
        for (var i = 0; i < cadena.length; i++) {
            var temporal = Auxiliar.generarTemporal();
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = H ", ""));
            nodo.codigo.push(Auxiliar.crearLinea("Heap[temporal] = " + cadena.charCodeAt(i), "Guardamos en el Heap el caracter: " + cadena.charAt(i)));
            nodo.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            if (i === 0)
                nodo.resultado = temporal;
        }
        nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
        nodo.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        return nodo;
    };
    return Primitivo;
}(Valor));
