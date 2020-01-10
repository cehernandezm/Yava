var AccesoArreglo = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param lista
     * @param l
     * @param c
     */
    function AccesoArreglo(id, lista, l, c) {
        this.id = id;
        this.lista = lista;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    AccesoArreglo.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.id.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            resultado;
        var nodoID = resultado;
        if (nodoID.tipo != Tipo.ARREGLO) {
            var mensaje = new MensajeError("Semantico", "La variable tiene que ser de tipo ARREGLO no se reconoce: " + Tipo[nodoID.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodoID.codigo);
        var arreglo = nodoID.valor;
        resultado = AsignarArreglo.mapear(nodoID, entorno, this.lista, this.l, this.c);
        if (resultado instanceof MensajeError)
            return resultado;
        var acceso = resultado;
        salida.codigo = salida.codigo.concat(acceso.codigo);
        var temporal = Auxiliar.generarTemporal();
        salida.tipo = acceso.tipo;
        salida.valor = acceso.valor;
        salida.id = acceso.id;
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + acceso.resultado, "Obtenemos el valor de la posicion"));
        salida.resultado = temporal;
        salida.localizacion = Localizacion.HEAP;
        salida.posicion = acceso.resultado;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    AccesoArreglo.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return AccesoArreglo;
}());
