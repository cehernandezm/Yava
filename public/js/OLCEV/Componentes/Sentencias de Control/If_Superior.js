var If_Superior = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista
     */
    function If_Superior(lista) {
        this.lista = lista;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    If_Superior.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        this.lista.forEach(function (element) {
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
        salida.saltos = [];
        return salida;
    };
    /**
     * LA PRIMERA PASADA OBTIENE
     * TODOS LOS TAMAÑOS DE LOS IF
     * Y LOS RETORNA A UN PADRE
     * @param entorno
     */
    If_Superior.prototype.primeraPasada = function (entorno) {
        var i = 0;
        this.lista.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    };
    return If_Superior;
}());
