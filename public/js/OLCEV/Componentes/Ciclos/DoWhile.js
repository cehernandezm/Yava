var DoWhile = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param condicion
     * @param cuerpo
     * @param l
     * @param c
     */
    function DoWhile(condicion, cuerpo, l, c) {
        this.condicion = condicion;
        this.cuerpo = cuerpo;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADREs
     * @param entorno
     */
    DoWhile.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.condicion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoCondicion = resultado;
        if (nodoCondicion.tipo != Tipo.BOOLEAN) {
            var mensaje = new MensajeError("Semantico", "La condicion tiene que ser de tipo BOOLEAN no se reconoce: " + Tipo[nodoCondicion.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var ciclo = Auxiliar.generarEtiqueta();
        var nuevo = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        salida.codigo.push(Auxiliar.crearLinea(ciclo + ":", "Etiqueta encargada del ciclo"));
        salida.codigo.push(";############################ VERDADERA #######################################");
        this.cuerpo.forEach(function (element) {
            var result = element.ejecutar(nuevo);
            if (result instanceof MensajeError)
                return result;
            var nodo = result;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.continue = salida.continue.concat(nodo.continue);
            salida.retornos = salida.retornos.concat(nodo.retornos);
        });
        salida.codigo.push(";########################### CONTINUE | SALTOS | CICLO | VERDADERA ######################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.continue).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.saltos).codigo);
        salida.codigo = salida.codigo.concat(nodoCondicion.codigo);
        nodoCondicion = Logica.arreglarBoolean(nodoCondicion, salida);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.verdaderas).codigo);
        salida.codigo.push(Auxiliar.saltoIncondicional(ciclo));
        salida.codigo.push(";########################### FALSAS | BREAK    ######################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.falsas).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.breaks).codigo);
        salida.breaks = [];
        salida.continue = [];
        salida.saltos = [];
        return salida;
    };
    /**
     * BUSCAMOS DECLARACIONES
     * @param entorno
     */
    DoWhile.prototype.primeraPasada = function (entorno) {
        var i = 0;
        this.cuerpo.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    };
    return DoWhile;
}());
