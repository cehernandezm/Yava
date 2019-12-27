var PrintlOLCEV = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion
     * @param salto
     * @param l
     * @param c
     */
    function PrintlOLCEV(expresion, salto, l, c) {
        this.expresion = expresion;
        this.salto = salto;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUAL
     */
    PrintlOLCEV.prototype.ejecutar = function (entorno) {
        var result = this.expresion.ejecutar(entorno);
        if (result instanceof MensajeError)
            return result;
        var nodo = result;
        var salida = new Nodo([]);
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if (nodo.tipo === Tipo.INT)
            salida.codigo.push("print(%e," + nodo.resultado + ")");
        else if (nodo.tipo === Tipo.DOUBLE)
            salida.codigo.push("print(%d," + nodo.resultado + ")");
        else if (nodo.tipo === Tipo.CHAR)
            salida.codigo.push("print(%c," + nodo.resultado + ")");
        else if (nodo.tipo === Tipo.STRING) {
            var posicion = Auxiliar.generarTemporal();
            var valor = Auxiliar.generarTemporal();
            var v = Auxiliar.generarEtiqueta();
            var r = Auxiliar.generarEtiqueta();
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + nodo.resultado, "Obtenemos la posicion del inicio de la cadena"));
            salida.codigo.push(r + ":");
            salida.codigo.push(Auxiliar.crearLinea(valor + "= Heap[" + posicion + "]", "Obtenemos el primer caracter de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + " == 0", v), "Si es null ya no imprimimos nada"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + posicion + " + 1", "Aumentamos la posicion"));
            salida.codigo.push(Auxiliar.crearLinea("print(%c," + valor + ")", "Imprimimos el caracter"));
            salida.codigo.push(Auxiliar.saltoIncondicional(r));
            salida.codigo.push(v + ":");
        }
        else if (nodo.tipo === Tipo.BOOLEAN) {
            if (nodo.verdaderas === null) {
                var verdadera = Auxiliar.generarEtiqueta();
                var salto = Auxiliar.generarEtiqueta();
                salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(nodo.resultado + " == 0", verdadera), "Si es un false"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,116)", "t"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,114)", "r"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,117)", "u"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,101)", "e"));
                salida.codigo.push(Auxiliar.saltoIncondicional(salto));
                salida.codigo.push(verdadera + ":");
                salida.codigo.push(Auxiliar.crearLinea("print(%c,102)", "f"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,97)", "a"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,108)", "l"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,115)", "s"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,101)", "e"));
                salida.codigo.push(salto + ":");
            }
            else {
                var salto = Auxiliar.generarEtiqueta();
                salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodo.verdaderas).codigo);
                salida.codigo.push(Auxiliar.crearLinea("print(%c,116)", "t"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,114)", "r"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,117)", "u"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,101)", "e"));
                ;
                salida.codigo.push(Auxiliar.saltoIncondicional(salto));
                salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodo.falsas).codigo);
                salida.codigo.push(Auxiliar.crearLinea("print(%c,102)", "f"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,97)", "a"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,108)", "l"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,115)", "s"));
                salida.codigo.push(Auxiliar.crearLinea("print(%c,101)", "e"));
                salida.codigo.push(salto + ":");
            }
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede imprimir el tipo de dato: " + nodo.tipo, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        if (this.salto)
            salida.codigo.push("print(%c,10)");
        return salida;
    };
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno ENTORNO ACTUAL
     */
    PrintlOLCEV.prototype.primeraPasada = function (entorno) {
        return null;
    };
    return PrintlOLCEV;
}());
