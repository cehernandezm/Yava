var asignarAtributo = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto
     * @param id
     * @param l
     * @param c
     */
    function asignarAtributo(objeto, id, expresion, l, c) {
        this.objeto = objeto;
        this.id = id;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    asignarAtributo.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoExpresion = resultado;
        salida.codigo = salida.codigo.concat(nodoExpresion.codigo);
        if (nodoExpresion.tipo === Tipo.BOOLEAN)
            nodoExpresion = Aritmetica.arreglarBoolean(nodoExpresion, salida);
        resultado = this.objeto.ejecutar(entorno);
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
            if (!(Asignacion.casteoImplicito(simbolo.tipo, nodoExpresion.tipo))) {
                var mensaje = new MensajeError("Semantico", "No se le puede asignar el valor: " + Tipo[nodoExpresion.tipo] + " al atributo de tipo: " + Tipo[simbolo.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + nodo.resultado, "Posicion del objeto"));
            salida.codigo.push(Auxiliar.crearLinea(posicionHeap + " = " + posicion + " + " + simbolo.posRelativa, "Nos movemos a la posicion del atributo"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[" + posicionHeap + "] = " + nodoExpresion.resultado, "Almacenamos el valor en el atributo: " + simbolo.id));
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
    asignarAtributo.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return asignarAtributo;
}());
