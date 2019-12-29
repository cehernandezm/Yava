var Logica = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param izq
     * @param der
     * @param operacion
     * @param l
     * @param c
     */
    function Logica(izq, der, operacion, l, c) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    Logica.prototype.ejecutar = function (entorno) {
        var resultado = this.izq.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoIzq = resultado;
        resultado = (this.der == null) ? null : this.der.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoDer = resultado;
        var salida = new Nodo([]);
        salida.tipo = Tipo.BOOLEAN;
        if (this.operacion === Operacion.OR) {
            if (nodoIzq.tipo != Tipo.BOOLEAN || nodoDer.tipo != Tipo.BOOLEAN) {
                var mensaje = new MensajeError("Semantico", "no se puede conocer el OR de: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);
            salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.falsas).codigo);
            salida.codigo = salida.codigo.concat(nodoDer.codigo);
            nodoDer = this.arreglarBoolean(nodoDer, salida);
            salida.verdaderas = nodoIzq.verdaderas;
            salida.verdaderas = salida.verdaderas.concat(nodoDer.verdaderas);
            salida.falsas = nodoDer.falsas;
            return salida;
        }
        else if (this.operacion === Operacion.AND) {
            if (nodoIzq.tipo != Tipo.BOOLEAN || nodoDer.tipo != Tipo.BOOLEAN) {
                var mensaje = new MensajeError("Semantico", "no se puede conocer el AND de: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);
            salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.verdaderas).codigo);
            salida.codigo = salida.codigo.concat(nodoDer.codigo);
            nodoDer = this.arreglarBoolean(nodoDer, salida);
            salida.verdaderas = nodoDer.verdaderas;
            salida.falsas = nodoIzq.falsas;
            salida.falsas = salida.falsas.concat(nodoDer.falsas);
            return salida;
        }
        else {
            if (nodoIzq.tipo != Tipo.BOOLEAN) {
                var mensaje = new MensajeError("Semantico", "no se puede conocer la negacion de: " + Tipo[nodoIzq.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);
            var v = nodoIzq.verdaderas;
            var f = nodoIzq.falsas;
            salida.falsas = v;
            salida.verdaderas = f;
            return salida;
        }
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Logica.prototype.primeraPasada = function (entorno) {
        throw new Error("Method not implemented.");
    };
    /**
     * METODO QUE SE ENCARGA DE CONTROLAR
     * LAS OPERACIONES BOOLEANAS
     * @param nodo
     * @param salida
     */
    Logica.prototype.arreglarBoolean = function (nodo, salida) {
        if (nodo.verdaderas === null) {
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            salida.codigo.push(Auxiliar.saltoCondicional(nodo.resultado + " == 1", v));
            salida.codigo.push(Auxiliar.saltoIncondicional(f));
            nodo.verdaderas = [v];
            nodo.falsas = [f];
        }
        return nodo;
    };
    return Logica;
}());
