var Constructor = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id Nombre del constructor
     * @param parametros lista de parametros
     * @param instrucciones lista de instrucciones
     * @param l linea de la instruccion
     * @param c columna de la instruccion
     */
    function Constructor(id, parametros, instrucciones, l, c) {
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno Actual
     */
    Constructor.prototype.ejecutar = function (entorno) {
        if (entorno.clase !== this.id) {
            var mensaje = new MensajeError("Semantico", "El nombre de la clase es: " + entorno.clase + " y el del constructor es: " + this.id, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        this.parametros.forEach(function (element) {
            var d = element;
            d.parametro = true;
            var resultado = d.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var s = entorno.buscarSimbolo(d.id);
            s.isNull = false;
        });
        var salida = new Nodo();
        salida.codigo = [];
        salida.codigo.push(";#############################");
        salida.codigo.push(";########CONSTRUCTOR " + this.identificador);
        salida.codigo.push(";#############################");
        salida.codigo.push("proc constructor_" + this.identificador + "{");
        this.instrucciones.forEach(function (element) {
            var resultado = element.ejecutar(entorno);
            if (!(resultado instanceof MensajeError)) {
                var nodo = resultado;
                salida.codigo = salida.codigo.concat(nodo.codigo);
            }
            else
                return resultado;
        });
        salida.codigo.push("}");
        return salida;
    };
    /**
     * Se encargara de verificar cuantas declaraciones tiene el constructor
     * @param entorno Entorno actual
     */
    Constructor.prototype.primeraPasada = function (entorno) {
        var _this = this;
        var i = 1; //--------------------------- THIS --------------------------------------------
        this.identificador = this.id + "_";
        this.instrucciones.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        /**
         * CREAMOS UN IDENTIFICADOR DEL TIPO
         * ID_ [TIPO]*
         */
        this.parametros.forEach(function (element) {
            var d = element;
            if (d.dimensiones > 0)
                _this.identificador += Tipo[Tipo.ARREGLO] + "_";
            else
                _this.identificador += Tipo[d.tipo] + "_";
        });
        entorno.tamaño = i + this.parametros.length;
        return entorno.tamaño;
    };
    return Constructor;
}());
