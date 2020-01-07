var super_sentece = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param parametros
     * @param l
     * @param c
     */
    function super_sentece(parametros, l, c) {
        this.parametros = parametros;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    super_sentece.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var valores = [];
        if (entorno.extendida === null) {
            var mensaje = new MensajeError("Semantico", "Esta clase no esta extendiendo a ninguna otra", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        this.parametros.forEach(function (element) {
            var resultado = element.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodo = resultado;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN)
                nodo = Aritmetica.arreglarBoolean(nodo, salida);
            valores.push(nodo);
        });
        var identificador = this.construirIdentificador(valores, entorno.extendida.nombre);
        var encontrado = entorno.extendida.buscarConstructor(identificador);
        if (!encontrado) {
            var mensaje = new MensajeError("Semantico", "La clase: " + entorno.extendida.nombre + " no tiene ninguna constructor: " + identificador, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var posicion = Auxiliar.generarTemporal();
        var valor = Auxiliar.generarTemporal();
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(valor + " = Stack[" + posicion + "]");
        salida.codigo.push("P = P + " + entorno.tamaño);
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + valor, "Pasamos la referencia del this actual"));
        var index = 1; //----- Empezamos en 1 porque el this ocupa la posicion 0
        valores.forEach(function (element) {
            salida.codigo.push(posicion + " = P + " + index);
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Seteamos los parametros"));
            index++;
        });
        salida.codigo.push("call constructor_" + identificador);
        salida.codigo.push("P = P - " + entorno.tamaño);
        return salida;
    };
    /**
     * METODO QUE CREA UN IDENTIFICADOR
     * PARA EL CONSTRUCTOR A LLAMAR
     */
    super_sentece.prototype.construirIdentificador = function (valores, id) {
        var identificador = id + "_";
        valores.forEach(function (element) {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    super_sentece.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return super_sentece;
}());
