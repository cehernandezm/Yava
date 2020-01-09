var Switch = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista
     */
    function Switch(condicion, lista) {
        this.condicion = condicion;
        this.lista = lista;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Switch.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resul = this.condicion.ejecutar(entorno);
        if (resul instanceof MensajeError)
            return resul;
        var nodoCon = resul;
        salida.codigo = salida.codigo.concat(nodoCon.codigo);
        if (nodoCon.tipo === Tipo.BOOLEAN)
            nodoCon = Aritmetica.arreglarBoolean(nodoCon, salida);
        this.lista.forEach(function (element) {
            element.comparar = nodoCon;
            var resultado = element.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodo = resultado;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.continue = salida.continue.concat(nodo.continue);
            salida.retornos = salida.retornos.concat(nodo.retornos);
            if (nodo.retornos.length > 0) {
                salida.tipo = nodo.tipo;
                salida.valor = nodo.valor;
            }
        });
        salida.codigo.push(";##################### SALTOS DE SALIDA ###############");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.saltos).codigo);
        salida.codigo.push(";##################### SALTOS DE BREAK ###############");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.breaks).codigo);
        salida.saltos = [];
        salida.breaks = [];
        return salida;
    };
    /**
     * LA PRIMERA PASADA OBTIENE
     * TODOS LOS TAMAÑOS DE LOS CASE
     * Y LOS RETORNA A UN PADRE
     * @param entorno
     */
    Switch.prototype.primeraPasada = function (entorno) {
        var i = 0;
        this.lista.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    };
    return Switch;
}());
