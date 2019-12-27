var Asignacion = /** @class */ (function () {
    function Asignacion(id, expresion, l, c) {
        this.id = id;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno Actual
     */
    Asignacion.prototype.ejecutar = function (entorno) {
        var s = entorno.buscarSimbolo(this.id);
        //------------------------------------------ SI NO EXISTE EL SIMBOLO ----------------------------------------------------------------
        if (s == null) {
            var mensaje = new MensajeError("Semantico", "La variable: " + this.id + " no existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var result = this.expresion.ejecutar(entorno);
        if (result instanceof MensajeError)
            return result;
        var salida = new Nodo();
        salida.codigo = [];
        var nodo = result;
        if (!(Asignacion.casteoImplicito(s.tipo, nodo.tipo))) {
            var mensaje = new MensajeError("Semantico", "No se le puede asignar un tipo: " + Tipo[nodo.tipo] + " a : " + Tipo[s.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (s.atributo['isStatic'] == true)
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + s.posAbsoluta + "] = " + nodo.resultado, " Accedemos a la variable estatica " + s.id));
        else if (s.localizacion == Localizacion.STACK) {
            var temp = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temp + " = P + " + s.posRelativa, "Accedemos a la posicion de la variable: " + s.id));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + temp + "] = " + nodo.resultado, "Asignamos el valor a la variable: " + s.id));
        }
        else {
            var temp = Auxiliar.generarTemporal();
            var posHeap = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temp + " = P + 0", "Accedemos al atributo this"));
            salida.codigo.push(Auxiliar.crearLinea(posHeap + " = Stack[" + temp + "]", "Obtenemos la posicion en el heap de this"));
            salida.codigo.push(Auxiliar.crearLinea(posHeap + " = " + posHeap + " + " + s.posRelativa, "Nos movemos en el heap"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[" + posHeap + "] = " + nodo.resultado, "Le asignamos valor a la variable: " + s.id));
        }
        return salida;
    };
    /**
     * ESTA ACCION NO TIENE PRIMERA PASADA
     * @param entorno Entorno Actual
     */
    Asignacion.prototype.primeraPasada = function (entorno) {
        return "";
    };
    Asignacion.casteoImplicito = function (tipo, tipoValor) {
        if (tipo === Tipo.INT && tipoValor === Tipo.CHAR)
            return true;
        else if (tipo === Tipo.DOUBLE && tipoValor === Tipo.CHAR)
            return true;
        else if (tipo === Tipo.DOUBLE && tipoValor === Tipo.INT)
            return true;
        else
            return tipo === tipoValor;
    };
    return Asignacion;
}());
