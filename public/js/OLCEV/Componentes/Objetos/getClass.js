var getClass = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param l
     * @param c
     */
    function getClass(expresion, l, c) {
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    getClass.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo !== Tipo.ID && nodo.tipo !== Tipo.ARREGLO) {
            var mensaje = new MensajeError("Semantico", "getClass no acepta este tipo de valor: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        if (nodo.tipo === Tipo.ID) {
            var temp = getClass.crearCadena(nodo.id);
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.resultado = temp.resultado;
        }
        else {
            var temp = getClass.crearCadena("Array");
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.resultado = temp.resultado;
        }
        salida.tipo = Tipo.STRING;
        return salida;
    };
    /**
     * METODO PARA CREAR UNA CADENA EN CODIGO 3D
     * @param cadena
     */
    getClass.crearCadena = function (cadena) {
        var salida = new Nodo([]);
        var temporal = Auxiliar.generarTemporal();
        salida.codigo.push(temporal + " = H");
        for (var i = 0; i < cadena.length; i++) {
            salida.codigo.push("Heap[H] = " + cadena.charCodeAt(i));
            salida.codigo.push("H = H + 1");
        }
        salida.codigo.push("Heap[H] = 0");
        salida.codigo.push("H = H + 1");
        salida.resultado = temporal;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    getClass.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return getClass;
}());
