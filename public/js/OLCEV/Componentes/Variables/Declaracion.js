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
var Declaracion = /** @class */ (function (_super) {
    __extends(Declaracion, _super);
    function Declaracion(id, modificador, tipo, valor, l, c, dimesiones) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.id = id;
        _this.modificador = modificador;
        _this.l = l;
        _this.c = c;
        _this.dimensiones = dimesiones;
        return _this;
    }
    /**
     * PRIMERA PASADA EN ESTA INSTRUCCION
     * NO TIENE ACCION
     * @param entorno Entorno Actual
     */
    Declaracion.prototype.primeraPasada = function (entorno) {
        return 1;
    };
    /**
     * METODO CUANDO SE EJECUTE
     * GUARADARA LA VARIABLE
     * @param entorno Entorno actual
     */
    Declaracion.prototype.ejecutar = function (entorno) {
        var _this = this;
        var s = entorno.buscarSimbolo(this.id);
        //---------------------------------------------- Si ya existe una variable con ese nombre
        if (s != null) {
            var mensaje = new MensajeError("Semantico", "El identificador: " + this.id + " ya existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var visibilidad = null;
        var isStatic = false;
        var isAbstract = false;
        var isFinal = false;
        if (this.modificador != null) {
            this.modificador.forEach(function (element) {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            var mensaje = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            var mensaje = new MensajeError("Semantico", "La variable ya es Static", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            var mensaje = new MensajeError("Semantico", "La variable ya es Final", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            var mensaje = new MensajeError("Semantico", "La variable ya es Abstract", entorno.archivo, _this.l, _this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isAbstract = true;
                        break;
                }
            });
        }
        if (visibilidad == null)
            visibilidad = Modificador.PRIVATE;
        var atributo = Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract);
        var simbolo = new Simbolo();
        simbolo.id = this.id;
        simbolo.rol = Rol.VARIABLE;
        simbolo.isNull = true;
        simbolo.tipo = this.tipo;
        if (this.tipo === Tipo.ARREGLO) {
            simbolo.dimensiones = this.dimensiones;
            simbolo.valor = this.valor;
        }
        simbolo.posRelativa = entorno.getPosRelativa();
        if (isStatic) {
            simbolo.localizacion = Localizacion.STACK;
            simbolo.posAbsoluta = Auxiliar.posicionAbsoluta();
        }
        else {
            simbolo.localizacion = entorno.localizacion;
            simbolo.posAbsoluta = -1;
        }
        simbolo.atributo = atributo;
        simbolo.objeto = this.valor.toString();
        entorno.agregarSimbolo(simbolo);
        var nodo = new Nodo();
        nodo.codigo = [];
        return nodo;
    };
    return Declaracion;
}(Valor));
