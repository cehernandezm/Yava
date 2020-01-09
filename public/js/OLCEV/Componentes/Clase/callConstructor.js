var callConstructor = /** @class */ (function () {
    /**
     * CONTRUCTOR DE LA CLASE
     * @param id
     * @param parametros
     * @param l
     * @param c
     */
    function callConstructor(id, parametros, l, c) {
        this.id = id;
        this.parametros = parametros;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    callConstructor.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var clase = getClase(this.id);
        var valores = [];
        if (clase == null) {
            var mensaje = new MensajeError("Semantico", "No existe la clase: " + this.id, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        this.parametros.forEach(function (element) {
            var result = element.ejecutar(entorno);
            if (result instanceof MensajeError)
                return result;
            var nodo = result;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN)
                nodo = Aritmetica.arreglarBoolean(nodo, salida);
            valores.push(nodo);
        });
        var identificador = this.construirIdentificador(valores);
        var resultado = clase.buscarConstructor(identificador);
        if (!resultado) {
            var mensaje = new MensajeError("Semantico", "La clase no posee este tipo de constructor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var temporal = Auxiliar.generarTemporal();
        var posicion = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = H", "Inicio del Objeto"));
        salida.codigo.push(Auxiliar.crearLinea("H = H +" + (clase.tamaño), "Apartamos el espacio de los atributos"));
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del this"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal, "This tendra el valor del inicio del Objeto"));
        var index = 1;
        valores.forEach(function (element) {
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + index, "Parametro: " + index));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Seteamos el parametro: " + index));
            index++;
        });
        salida.codigo.push("call constructor_" + identificador);
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin Simulacion de cambio de ambito"));
        salida.tipo = Tipo.ID;
        salida.resultado = temporal;
        salida.id = this.id;
        return salida;
    };
    /**
     * METODO QUE CREA UN IDENTIFICADOR
     * PARA EL CONSTRUCTOR A LLAMAR
     */
    callConstructor.prototype.construirIdentificador = function (valores) {
        var identificador = this.id + "_";
        valores.forEach(function (element) {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    callConstructor.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return callConstructor;
}());
