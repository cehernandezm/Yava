var Clase = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param modificiador Modificador que afectara a la clase
     * @param nombre nombre de la clase
     * @param instrucciones lista de instrucciones
     * @param extender nombre de la clase a la que extendera
     * @param l linea de la instruccion
     * @param c columna de la instruccion
     */
    function Clase(modificiador, nombre, instrucciones, extender, l, c) {
        this.tamaño = 0;
        this.constructores = [];
        this.modificador = modificiador;
        this.nombre = nombre;
        this.instrucciones = instrucciones;
        this.extender = extender;
        this.l = l;
        this.c = c;
    }
    /**
     * ESTA CLASE NO IMPLEMENTA EL METODO EJECUTAR
     * @param entorno Entorno actual
     */
    Clase.prototype.ejecutar = function (entorno) {
        return null;
    };
    /**
     * PRIMERA PASADA DE LA CLASE
     * Donde se alamcenara en listaClase
     * se obtendra su tamaño
     * atributos y metodos
     * @param entorno Entorno Actual
     */
    Clase.prototype.primeraPasada = function (entorno) {
        var _this = this;
        var salida = new Nodo();
        salida.codigo = [];
        var claseTemp = getClase(this.nombre);
        if (claseTemp != null) {
            var mensaje = new MensajeError("Semantico", "La clase: " + this.nombre + " ya existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var visibilidad = null;
        var isStatic = false;
        var isAbstract = false;
        var isFinal = false;
        /**
         * VERIFICAMOS QUE NO TENGA MODIFICADORES DE MAS
         * Y QUE VENGAN SOLO UNA VEZ
         */
        if (this.modificador != null) {
            this.modificador.forEach(function (element) {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            var mensaje = new MensajeError("Semantico", "La clase ya es Static", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            var mensaje = new MensajeError("Semantico", "La clase ya es Final", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            var mensaje = new MensajeError("Semantico", "La clase ya es Abstract", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isAbstract = true;
                        break;
                }
            });
        }
        if (visibilidad == null)
            visibilidad = Modificador.PUBLIC;
        this.atributos = Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract);
        /**
         * SI VAMOS A EXTENDER DE UNA CLASE
         */
        if (this.extender != null) {
            claseTemp = getClase(this.extender);
            if (claseTemp == null) {
                var mensaje = new MensajeError("Semantico", "No existe la clase: " + this.extender + " que se quiere extender", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            this.instrucciones = this.instrucciones.concat(claseTemp.instrucciones);
        }
        entorno.clase = this.nombre;
        /**
         * ALMACENAMOS TODOS SUS ATRIBUTOS
         */
        this.instrucciones.forEach(function (element) {
            if (element instanceof Declaracion) {
                var resultado = element.ejecutar(entorno);
                if (resultado instanceof MensajeError)
                    return resultado;
                _this.tamaño++;
            }
            else if (element instanceof Asignacion) {
                var resultado = element.ejecutar(entorno);
                if (resultado instanceof MensajeError)
                    return resultado;
                var nodo_1 = resultado;
                salida.codigo = salida.codigo.concat(nodo_1.codigo);
            }
            if (element instanceof FuncionOLCEV)
                element.primeraPasada(entorno);
        });
        /**
         * BUSCAMOS SI TIENE UN CONSTRUCTOR
         * DE LO CONTRARIO GENERAMOS UNO
         * AUTOMATICAMENTE
         */
        var flag = false;
        this.instrucciones.forEach(function (element) {
            if (element instanceof Constructor) {
                var e = Auxiliar.clonarEntorno(entorno);
                e.localizacion = Localizacion.STACK;
                e.posRelativaStack = 1;
                element.primeraPasada(e); //----- Realizamos la primera pasada obteniendo el tamaño total del constructor
                var resultado = element.ejecutar(e);
                if (!(resultado instanceof MensajeError)) {
                    var nodo_2 = resultado;
                    salida.codigo = salida.codigo.concat(nodo_2.codigo);
                    _this.constructores.push(element.identificador);
                }
                else
                    return resultado;
                flag = true;
            }
        });
        /**
         * SI NO SE ENCONTRO NINGUN CONSTRUCTOR SE CREA UNO CON TODOS LOS ATRIBUTOS
         */
        if (!flag) {
            var nodo_3 = new Nodo();
            nodo_3.codigo = [];
            nodo_3.codigo.push(";#############################");
            nodo_3.codigo.push(";########CONSTRUCTOR " + this.nombre);
            nodo_3.codigo.push(";#############################");
            nodo_3.codigo.push("proc contructor_" + this.nombre + "{");
            entorno.listaSimbolos.forEach(function (s) {
                //--------------------------- SIGNIFICA QUE ES UNA VARIABLE ESTATICA ---------------------------------------------
                if (s.localizacion == Localizacion.STACK)
                    nodo_3.codigo.push(Auxiliar.crearLinea("Stack[" + s.posAbsoluta + "] = 0", "iniciando variable: " + s.id));
                else {
                    var pos = Auxiliar.generarTemporal();
                    nodo_3.codigo.push(Auxiliar.crearLinea(pos + " = P + 0", "Obtenemos la posicion de referencia this"));
                    nodo_3.codigo.push(Auxiliar.crearLinea(pos + " = " + pos + " + " + s.posRelativa, "Nos movemos hacia la variable que necesitamos"));
                    nodo_3.codigo.push(Auxiliar.crearLinea("Heap[" + pos + "] = 0", "Iniciando variable: " + s.id));
                }
                s.isNull = false;
            });
            nodo_3.codigo.push("}");
            salida.codigo = salida.codigo.concat(nodo_3.codigo);
        }
        var nodo = new Nodo([]);
        this.instrucciones.forEach(function (element) {
            if (element instanceof FuncionOLCEV) {
                var resultado = element.ejecutar(entorno);
                if (resultado instanceof MensajeError)
                    return resultado;
                var temp = resultado;
                nodo.codigo = nodo.codigo.concat(temp.codigo);
            }
        });
        salida.codigo = nodo.codigo.concat(salida.codigo);
        this.entorno = entorno;
        agregarClase(this);
        return salida;
    };
    /**
     * METODO QUE BUSCA UN CONSTRUCTOR
     * EN EL LISTADO DE CONSTRUCTORES
     * @param id
     */
    Clase.prototype.buscarConstructor = function (id) {
        for (var i = 0; i < this.constructores.length; i++) {
            if (this.constructores[i] === id)
                return true;
        }
        return false;
    };
    return Clase;
}());
