var accederAFunciones = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto
     * @param id
     * @param parametros
     * @param l
     * @param c
     */
    function accederAFunciones(objeto, id, parametros, l, c) {
        this.objeto = objeto;
        this.id = id;
        this.parametros = parametros;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     */
    accederAFunciones.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var valores = [];
        var resultado = this.objeto.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodo = resultado;
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.ID) {
            var clase = getClase(nodo.id);
            if (clase === null) {
                var mensaje = new MensajeError("Semantico", "La clase: " + nodo.id + " no existe", entorno.archivo, this.l, this.c);
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
            var identificador = this.construirIdentificador(valores);
            var f = clase.entorno.buscarFuncion(identificador, []);
            if (f === null) {
                var mensaje = new MensajeError("Semantico", "No existe la funcion: " + this.id, entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var visibilidad = f.atributos['visibilidad'];
            if (visibilidad !== Visibilidad.PUBLIC) {
                var mensaje = new MensajeError("Semantico", "El metodo tiene una visibilidad, " + Visibilidad[visibilidad], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var temporal = Auxiliar.generarTemporal();
            var posicion = Auxiliar.generarTemporal();
            salida.codigo.push(temporal + " = " + nodo.resultado);
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion de this"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal, "Pasamos la posicion de this"));
            var i_1 = 1; //Iniciamos en 1 porque el 0 es apartado para this
            valores.forEach(function (element) {
                var posicion = Auxiliar.generarTemporal();
                salida.codigo.push(posicion + " = P + " + i_1);
                salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Valor del parametro: " + i_1));
                i_1++;
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
        }
        else if (nodo.tipo === Tipo.CLASE) {
            var clase = getClase(nodo.id);
            if (clase === null) {
                var mensaje = new MensajeError("Semantico", "La clase: " + nodo.id + " no existe", entorno.archivo, this.l, this.c);
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
            var identificador = this.construirIdentificador(valores);
            var f = clase.entorno.buscarFuncion(identificador, []);
            if (f === null) {
                var mensaje = new MensajeError("Semantico", "No existe la funcion: " + this.id, entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var visibilidad = f.atributos['visibilidad'];
            if (visibilidad !== Visibilidad.PUBLIC) {
                var mensaje = new MensajeError("Semantico", "El metodo tiene una visibilidad, " + Visibilidad[visibilidad], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var isStatic = f.atributos['isStatic'];
            if (!isStatic) {
                var mensaje = new MensajeError("Semantico", "El metodo tiene que ser static", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var posicion = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion de this"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = -1", "Un metodo estatico no posee una referencia a this"));
            var i_2 = 1; //Iniciamos en 1 porque el 0 es apartado para this
            valores.forEach(function (element) {
                var posicion = Auxiliar.generarTemporal();
                salida.codigo.push(posicion + " = P + " + i_2);
                salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Valor del parametro: " + i_2));
                i_2++;
            });
            salida.codigo.push(Auxiliar.crearLinea("call " + identificador, "Llamamos a la funcion: " + this.id));
            if (f.tipo != Tipo.VOID) {
                var posicion_2 = Auxiliar.generarTemporal();
                var temporal = Auxiliar.generarTemporal();
                salida.codigo.push(Auxiliar.crearLinea(posicion_2 + " = P + " + (f.tamaño - 1), "Posicion del retorno"));
                salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion_2 + "]", "Obtenemos el valor del retorno"));
                salida.resultado = temporal;
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
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede acceder a los elementos de un tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        return salida;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno
     */
    accederAFunciones.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    /**
    * METODO ENCARGADO DE REALIZAR
    * LA CONSTRUCCION
    * DEL IDENTIFICADOR DE LA FUNCION A LLAMAR
    */
    accederAFunciones.prototype.construirIdentificador = function (valores) {
        var identificador = this.id + "_";
        valores.forEach(function (element) {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    };
    return accederAFunciones;
}());
