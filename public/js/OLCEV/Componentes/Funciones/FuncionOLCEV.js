var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FuncionOLCEV = /** @class */ (function (_super) {
    __extends(FuncionOLCEV, _super);
    function FuncionOLCEV(id, modificadores, dimensiones, tipo, valor, cuerpo, parametros, l, c, override) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.tamaño = 0;
        _this.id = id;
        _this.modificadores = modificadores;
        _this.dimensiones = dimensiones;
        _this.cuerpo = cuerpo;
        _this.parametros = parametros;
        _this.l = l;
        _this.c = c;
        _this.override = override;
        return _this;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    FuncionOLCEV.prototype.ejecutar = function (entorno) {
        var _this = this;
        var salida = new Nodo([]);
        if (this.dimensiones > 0) {
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(this.tipo, this.dimensiones);
        }
        salida.codigo.push(";##########################################################################");
        salida.codigo.push(";################################# METODO " + this.id + " ######################");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push("proc " + this.identificador + "{");
        var nuevo = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        nuevo.tamaño = this.tamaño;
        nuevo.posRelativaStack = 1;
        this.parametros.forEach(function (element) {
            var d = element;
            d.parametro = true;
            var resultado = d.ejecutar(nuevo);
            if (resultado instanceof MensajeError)
                return resultado;
            var s = nuevo.buscarSimbolo(d.id);
            s.isNull = false;
        });
        this.cuerpo.forEach(function (element) {
            var resultado = element.ejecutar(nuevo);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodo = resultado;
            salida.retornos = salida.retornos.concat(nodo.retornos);
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.retornos.length > 0 && _this.tipo !== Tipo.VOID) {
                if (salida.tipo === Tipo.ARREGLO && nodo.tipo === Tipo.ARREGLO) {
                    var arreglo2 = nodo.valor;
                    if (_this.tipo != arreglo2.tipo) {
                        var mensaje = new MensajeError("Semantico", "La funcion: " + _this.id + " su arreglo es de tipo " + Tipo[_this.tipo] + " y se esta retornando un arreglo de tipo valor: " + Tipo[arreglo2.tipo], entorno.archivo, _this.l, _this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }
                    if (_this.dimensiones !== +arreglo2.valor) {
                        var mensaje = new MensajeError("Semantico", "La funcion: " + _this.id + " su arreglo tiene " + _this.dimensiones + " dimensiones y se esta retornando un arreglo de : " + arreglo2.valor + " dimensiones", entorno.archivo, _this.l, _this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }
                }
                else if (!(Asignacion.casteoImplicito(_this.tipo, nodo.tipo))) {
                    var mensaje = new MensajeError("Semantico", "La funcion: " + _this.id + " es de tipo " + Tipo[_this.tipo] + " y se esta retornando una valor: " + Tipo[nodo.tipo], entorno.archivo, _this.l, _this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }
            }
        });
        if (salida.retornos.length > 0 && this.tipo === Tipo.VOID) {
            var mensaje = new MensajeError("Semantico", "La funcion: " + this.id + " es de tipo VOID no puede retornar ningun valor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        if (salida.retornos.length < 1 && this.tipo !== Tipo.VOID) {
            var mensaje = new MensajeError("Semantico", "La funcion: " + this.id + " tiene que retornar un valor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo.push(";###################### ETIQUETAS DE RETORNO: ############################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.retornos).codigo);
        salida.codigo.push("}");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push(";########################## FIN METODO " + this.id + " ################");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        if (this.dimensiones > 0) {
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(this.tipo, this.dimensiones);
        }
        else {
            salida.tipo = this.tipo;
            salida.valor = this.valor;
        }
        return salida;
    };
    /**
     * RETORNAMOS EL TAMAÑO DE NUESTRO METODO
     * RETORNAMOS UN 0 YA QUE LAS FUNCIONES
     * SE EJECUTARAN EN UN ENTORNO DIFERENTE
     * AL ENTORNO PRINCIPAL
     * @param entorno
     */
    FuncionOLCEV.prototype.primeraPasada = function (entorno) {
        var _this = this;
        /**
         * SI ES VOID EMPIEZA EN 1 RESERVANDO EL 0 PARA EL THIS
         * SI ES DIFERENTE A VOID EMPIEZA EN 2 RESERVANDO EL 0 PARA EL THIS Y LA ULTIMA POSICION PARA
         * EL RETURN
         */
        var i = (this.tipo === Tipo.VOID) ? 1 : 2;
        i += this.parametros.length; // Apartamos el lugar para los parametros
        this.cuerpo.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        this.tamaño = i; // Almacenamos el valor del entorno de la funcion
        var visibilidad = null;
        var isStatic = false;
        var isAbstract = false;
        var isFinal = false;
        /**
         * VERIFICAMOS QUE NO TENGA MODIFICADORES DE MAS
         * Y QUE VENGAN SOLO UNA VEZ
         */
        if (this.modificadores != null) {
            this.modificadores.forEach(function (element) {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya es Static", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya es Final", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            var mensaje = new MensajeError("Semantico", "La funcion ya es Abstract", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isAbstract = true;
                        break;
                }
            });
        }
        if (visibilidad == null)
            visibilidad = Modificador.PUBLIC;
        this.atributos = Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract);
        this.construirIdentificador();
        entorno.metodos.push(this); //------------------ AGREGAMOS LA FUNCION A LA LISTA DE METODOS
        return 0;
    };
    /**
     * CONSTRUIMOS EL IDENTIFICADOR DE LA FUNCION
     * ESTE METODO FALLARA SI EN LOS OBJETOS PASAMOS
     * PARAMETROS NULL
     */
    FuncionOLCEV.prototype.construirIdentificador = function () {
        var temp = this.id + "_";
        this.parametros.forEach(function (element) {
            var d = element;
            if (d.dimensiones > 0)
                temp += Tipo[Tipo.ARREGLO] + "_";
            else
                temp += Tipo[d.tipo] + "_";
        });
        this.identificador = temp;
    };
    return FuncionOLCEV;
}(Valor));
