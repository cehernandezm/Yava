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
        var salida = new Nodo();
        salida.codigo = [];
        salida.codigo.push(";#############################");
        salida.codigo.push(";########CONSTRUCTOR " + this.id);
        salida.codigo.push(";#############################");
        salida.codigo.push("proc contructor_" + this.id + "{");
        this.instrucciones.forEach(function (element) {
            var resultado = element.ejecutar(entorno);
            if (!(resultado instanceof MensajeError)) {
                var nodo = resultado;
                salida.codigo = salida.codigo.concat(nodo.codigo);
            }
        });
        salida.codigo.push("}");
        return salida;
    };
    /**
     * Se encargara de verificar cuantas declaraciones tiene el constructor
     * @param entorno Entorno actual
     */
    Constructor.prototype.primeraPasada = function (entorno) {
        this.instrucciones.forEach(function (element) {
            if (element instanceof Declaracion)
                entorno.tamaño++;
        });
        return "";
    };
    return Constructor;
}());
