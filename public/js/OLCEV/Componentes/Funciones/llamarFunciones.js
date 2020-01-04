var llamarFunciones = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param objeto
     * @param parametro
     * @param l
     * @param c
     */
    function llamarFunciones(id, objeto, parametro, l, c) {
        this.id = id;
        this.objeto = objeto;
        this.parametros = parametro;
        this.l = l;
        this.c = c;
    }
    llamarFunciones.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var valores = [];
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
        var identificador = this.construirIdentificador(valores);
        var f = entorno.buscarFuncion(identificador, []);
        if (f === null) {
            var mensaje = new MensajeError("Semantico", "No existe la funcion: " + this.id, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var temporal = Auxiliar.generarTemporal();
        var posicion = Auxiliar.generarTemporal();
        salida.codigo.push(temporal + " = P + 0");
        salida.codigo.push(temporal + " = Stack[" + temporal + "]");
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion de this"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal, "Pasamos la posicion de this"));
        var i = 1; //Iniciamos en 1 porque el 0 es apartado para this
        valores.forEach(function (element) {
            var posicion = Auxiliar.generarTemporal();
            salida.codigo.push(posicion + " = P + " + i);
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Valor del parametro: " + i));
            i++;
        });
        salida.codigo.push(Auxiliar.crearLinea("call " + identificador, "Llamamos a la funcion: " + this.id));
        if (f.tipo != Tipo.VOID) {
            var posicion_1 = Auxiliar.generarTemporal();
            var temporal_1 = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(posicion_1 + " = P + " + (f.tamaño - 1), "Posicion del retorno"));
            salida.codigo.push(Auxiliar.crearLinea(temporal_1 + " = Stack[" + posicion_1 + "]", "Obtenemos el valor del retorno"));
            salida.resultado = temporal_1;
        }
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Simulacion de cambio de ambito"));
        if (f.dimensiones > 0) {
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(f.tipo, f.dimensiones);
        }
        else {
            salida.tipo = f.tipo;
            salida.valor = f.valor;
        }
        salida.id = f.valor.toString();
        return salida;
    };
    /**
     * METODO ENCARGADO DE REALIZAR
     * LA CONSTRUCCION
     * DEL IDENTIFICADOR DE LA FUNCION A LLAMAR
     */
    llamarFunciones.prototype.construirIdentificador = function (valores) {
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
    llamarFunciones.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return llamarFunciones;
}());
