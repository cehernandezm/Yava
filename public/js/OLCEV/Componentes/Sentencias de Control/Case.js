var Case = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param condicion
     * @param cuerpo
     * @param l
     * @param c
     */
    function Case(condicion, cuerpo, l, c) {
        this.condicion = condicion;
        this.cuerpo = cuerpo;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Case.prototype.ejecutar = function (entorno) {
        var nuevo = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        var salida = new Nodo([]);
        var v = [];
        var f = [];
        if (this.condicion != null) {
            var resultado = this.condicion.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodo = resultado;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            var result = Relacional.comparacionComplicada(salida, nodo, this.comparar, entorno, this.l, this.c, "==");
            if (result instanceof MensajeError)
                return result;
            var nodoResult = result;
            v = nodoResult.verdaderas;
            f = nodoResult.falsas;
        }
        salida.codigo.push(";######################## VERDADERAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(v).codigo);
        this.cuerpo.forEach(function (element) {
            var result = element.ejecutar(nuevo);
            if (result instanceof MensajeError)
                return result;
            var temp = result;
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            salida.continue = salida.continue.concat(temp.continue);
            salida.retornos = salida.retornos.concat(temp.retornos);
            if (temp.retornos.length > 0) {
                salida.tipo = temp.tipo;
                salida.valor = temp.valor;
            }
        });
        salida.codigo.push(";######################## FALSAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(f).codigo);
        return salida;
    };
    /**
     * PRIMERA PASADO
     * PASAMOS OBTENIENDO EL TAMAÑO DEL IF
     * @param entorno ENTORNO ACTUAL
     */
    Case.prototype.primeraPasada = function (entorno) {
        var i = 0;
        this.cuerpo.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    };
    return Case;
}());
