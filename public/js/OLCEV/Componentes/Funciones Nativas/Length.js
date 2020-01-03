var Length = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param l
     * @param c
     */
    function Length(id, l, c) {
        this.id = id;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUAL
     */
    Length.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.id.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        if (nodo.tipo != Tipo.ARREGLO) {
            var mensaje = new MensajeError("Semantico", "no se le puede aplicar la funcion length al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        var temporal = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + nodo.resultado + "]", "Obtenemos el tamanio del arreglo"));
        salida.tipo = Tipo.INT;
        salida.resultado = temporal;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Length.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Length;
}());
