var Import = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param direccion
     * @param l
     * @param c
     */
    function Import(direccion, l, c) {
        this.direccion = direccion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Import.prototype.ejecutar = function (entorno) {
        var _this = this;
        this.direccion = this.direccion.substring(1, this.direccion.length - 1);
        var resultado = analizarImport(this.direccion);
        if (resultado.error === false) {
            var codigo = resultado.codigo;
            GramaticaOLCEV.parse(codigo);
            var analizar = GramaticaOLCEV.arbol.raiz;
            var salida_1 = new Nodo([]);
            var instrucciones = analizar.instrucciones;
            instrucciones.forEach(function (clase) {
                var entorno = new Entorno(_this.direccion);
                if (clase instanceof Import) {
                    var resultado_1 = clase.ejecutar(entorno);
                    if (resultado_1 instanceof MensajeError)
                        return resultado_1;
                    var res = resultado_1;
                    salida_1.codigo = salida_1.codigo.concat(res.codigo);
                }
                if (clase instanceof Clase) {
                    var resultado_2 = clase.primeraPasada(entorno);
                    if (!(resultado_2 instanceof MensajeError)) {
                        var res = resultado_2;
                        salida_1.codigo = salida_1.codigo.concat(res.codigo);
                    }
                    else
                        return resultado_2;
                }
            });
            return salida_1;
        }
        var mensaje = new MensajeError("Semantico", "El archivo: " + this.direccion + " no existe", entorno.archivo, this.l, this.c);
        Auxiliar.agregarError(mensaje);
        return mensaje;
    };
    /**
     * ESTE METODO NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Import.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return Import;
}());
