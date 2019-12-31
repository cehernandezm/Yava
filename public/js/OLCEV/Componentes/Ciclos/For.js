var For = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASEs
     * @param declaracion
     * @param condicion
     * @param asignacion
     * @param cuerpo
     * @param l
     * @param c
     */
    function For(declaracion, condicion, asignacion, cuerpo, l, c) {
        this.declaracion = declaracion;
        this.condicion = condicion;
        this.asignacion = asignacion;
        this.cuerpo = cuerpo;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    For.prototype.ejecutar = function (entorno) {
        var nuevo = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        var salida = new Nodo([]);
        salida.codigo.push(";####################### DECLARACION FOR #########################");
        this.declaracion.forEach(function (element) {
            var resultado = element.ejecutar(nuevo);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodoDeclaracion = resultado;
            salida.codigo = salida.codigo.concat(nodoDeclaracion.codigo);
        });
        var resultado = this.condicion.ejecutar(nuevo);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoCondicion = resultado;
        var salto = Auxiliar.generarEtiqueta();
        salida.codigo.push(";##################### CONDICION FOR #####################");
        salida.codigo.push(Auxiliar.crearLinea(salto + ":", "Recursividad"));
        salida.codigo = salida.codigo.concat(nodoCondicion.codigo);
        nodoCondicion = Logica.arreglarBoolean(nodoCondicion, salida);
        if (nodoCondicion.tipo != Tipo.BOOLEAN) {
            var mensaje = new MensajeError("Semantico", "For necesita una condicion booleana no se reconoce: " + Tipo[nodoCondicion.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        resultado = this.asignacion.ejecutar(nuevo);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoAsignacion = resultado;
        salida.codigo.push(";#################################### VERDADERO FOR ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.verdaderas).codigo);
        this.cuerpo.forEach(function (element) {
            var result = element.ejecutar(nuevo);
            if (result instanceof MensajeError)
                return result;
            var nodo = result;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.continue = salida.continue.concat(nodo.continue);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.retornos = salida.retornos.concat(nodo.retornos);
        });
        salida.codigo.push(";#################################### CONTINUE | SALTO  ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.continue).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.saltos).codigo);
        salida.codigo = salida.codigo.concat(nodoAsignacion.codigo);
        salida.codigo.push(Auxiliar.saltoIncondicional(salto));
        salida.codigo.push(";#################################### FALSAS | BREAK ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.falsas).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.breaks).codigo);
        salida.saltos = [];
        salida.breaks = [];
        salida.continue = [];
        return salida;
    };
    /**
     * DEVUELVE SU TAMAÑO
     * @param entorno
     */
    For.prototype.primeraPasada = function (entorno) {
        var i = 1; // por la declaracion inicial empieza en 1
        this.cuerpo.forEach(function (element) {
            var x = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    };
    return For;
}());
