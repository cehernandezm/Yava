var Clase = /** @class */ (function () {
    function Clase(modificiador, nombre, instrucciones, extender, l, c) {
        this.modificador = modificiador;
        this.nombre = nombre;
        this.instrucciones = instrucciones;
        this.extender = extender;
        this.l = l;
        this.c = c;
    }
    Clase.prototype.ejecutar = function (entorno) {
        return null;
    };
    Clase.prototype.primeraPasada = function (entorno) {
        var _this = this;
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
        var tam = this.instrucciones.length;
        var s = new Simbolo(this.nombre, Rol.CLASE, tam, Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract), this.instrucciones);
        s.entorno = entorno;
        agregarClase(s);
        this.instrucciones.forEach(function (element) {
            if (element instanceof Declaracion)
                element.ejecutar(entorno);
        });
        return true;
    };
    return Clase;
}());
