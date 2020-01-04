var accederAtributo = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto
     * @param id
     * @param l
     * @param c
     */
    function accederAtributo(objeto, id, l, c) {
        this.objeto = objeto;
        this.id = id;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    accederAtributo.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.objeto.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.ID) {
            var identificador = nodo.id;
            var clase = getClase(identificador);
            if (clase === null) {
                var mensaje = new MensajeError("Semantico", "No existe la clase: " + identificador, entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var entornoTemp = clase.entorno;
            var simbolo = entornoTemp.buscarSimbolo(this.id);
            if (simbolo === null) {
                var mensaje = new MensajeError("Semantico", "No existe el atributo: " + this.id + " en la clase: " + nodo.id, entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var atributos = simbolo.atributo;
            var visibilidad = atributos['visibilidad'];
            if (visibilidad !== Visibilidad.PUBLIC) {
                var mensaje = new MensajeError("Semantico", "El atributo: " + this.id + " tiene una visibilidad: " + Visibilidad[visibilidad], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var posicion = Auxiliar.generarTemporal();
            var posicionHeap = Auxiliar.generarTemporal();
            var temporal = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + nodo.resultado, "Posicion del objeto"));
            salida.codigo.push(Auxiliar.crearLinea(posicionHeap + " = " + posicion + " + " + simbolo.posRelativa, "Nos movemos a la posicion del atributo"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + posicionHeap + "]", "Obtenemos el valor del atributo: " + simbolo.id));
            salida.tipo = simbolo.tipo;
            salida.atributos = simbolo.atributo;
            salida.verdaderas = simbolo.verdaderas;
            salida.falsas = simbolo.falsas;
            salida.resultado = temporal;
            salida.valor = simbolo.valor;
            salida.id = simbolo.objeto;
            salida.posicion = posicionHeap;
            if (simbolo.tipo === Tipo.ARREGLO) {
                var simArreglo = simbolo.valor;
                nodo.valor = new Arreglo(simArreglo.tipo, simbolo.dimensiones);
            }
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede acceder a un atributo de un tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    accederAtributo.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return accederAtributo;
}());
