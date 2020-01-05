var Relacional = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param izq
     * @param der
     * @param signo
     * @param l
     * @param c
     */
    function Relacional(izq, der, signo, l, c) {
        this.izq = izq;
        this.der = der;
        this.signo = signo;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    Relacional.prototype.ejecutar = function (entorno) {
        var resultado = this.izq.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoIzq = resultado;
        resultado = this.der.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var nodoDer = resultado;
        var salida = new Nodo([]);
        if (nodoIzq.tipo != Tipo.BOOLEAN)
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
        if (nodoDer.tipo != Tipo.BOOLEAN)
            salida.codigo = salida.codigo.concat(nodoDer.codigo);
        switch (this.signo) {
            case ">":
            case "<":
            case ">=":
            case "<=":
                return this.comparacionSimple(salida, nodoIzq, nodoDer, entorno);
            default:
                return Relacional.comparacionComplicada(salida, nodoIzq, nodoDer, entorno, this.l, this.c, this.signo);
        }
    };
    /**
     * METODO QUE SE ENCARGARA DE HACER UNA
     * COMPARACION DE LOS SIGNOS
     * >
     * <
     * >=
     * <=
     * @param nodo
     * @param nodoIzq
     * @param nodoDer
     * @param entorno
     */
    Relacional.prototype.comparacionSimple = function (nodo, nodoIzq, nodoDer, entorno) {
        if ((nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.CHAR) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.CHAR) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.CHAR)) {
            nodo.tipo = Tipo.BOOLEAN;
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea("if " + nodoIzq.resultado + " " + this.signo + " " + nodoDer.resultado + " goto " + v, "Si es verdadero salta a " + v));
            nodo.codigo.push(Auxiliar.crearLinea("goto " + f, "si no se cumple salta a: " + f));
            nodo.verdaderas = [];
            nodo.verdaderas.push(v);
            nodo.falsas = [];
            nodo.falsas.push(f);
            return nodo;
        }
        else {
            var mensaje = new MensajeError("Semantico", "No se puede conocer el: " + this.signo + " de los tipos: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
    };
    /**
     * METODO QUE SE ENCARGARA DE HACER LA
     * COMPARACION PARA LOS SIGNOS
     * !=
     * ==
     * @param nodo
     * @param nodoIzq
     * @param nodoDer
     * @param entorno
     */
    Relacional.comparacionComplicada = function (nodo, nodoIzq, nodoDer, entorno, l, c, signo) {
        nodo.tipo = Tipo.BOOLEAN;
        if ((nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.CHAR) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.CHAR) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.DOUBLE && nodoDer.tipo === Tipo.DOUBLE) || (nodoIzq.tipo === Tipo.INT && nodoDer.tipo === Tipo.INT) || (nodoIzq.tipo === Tipo.CHAR && nodoDer.tipo === Tipo.CHAR)) {
            nodo.tipo = Tipo.BOOLEAN;
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea("if " + nodoIzq.resultado + " " + signo + " " + nodoDer.resultado + " goto " + v, "Si es verdadero salta a " + v));
            nodo.codigo.push(Auxiliar.crearLinea("goto " + f, "si no se cumple salta a: " + f));
            nodo.verdaderas = [];
            nodo.verdaderas.push(v);
            nodo.falsas = [];
            nodo.falsas.push(f);
            return nodo;
        }
        else if (nodoIzq.tipo === Tipo.BOOLEAN && nodoDer.tipo === Tipo.BOOLEAN) {
            nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
            if (nodoIzq.verdaderas != null) {
                var s = Auxiliar.generarEtiqueta();
                var temporal = Auxiliar.generarTemporal();
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.verdaderas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea(temporal + " = 1", "Valor Verdadero"));
                nodo.codigo.push(Auxiliar.saltoIncondicional(s));
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.falsas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea(temporal + " = 0", "Valor Falso"));
                nodo.codigo.push(s + ":");
                nodoIzq.resultado = temporal;
            }
            nodo.codigo = nodo.codigo.concat(nodoDer.codigo);
            if (nodoDer.verdaderas != null) {
                var s = Auxiliar.generarEtiqueta();
                var temporal = Auxiliar.generarTemporal();
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(nodoDer.verdaderas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea(temporal + " = 1", "Valor Verdadero"));
                nodo.codigo.push(Auxiliar.saltoIncondicional(s));
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(nodoDer.falsas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea(temporal + " = 0", "Valor Falso"));
                nodo.codigo.push(s + ":");
                nodoDer.resultado = temporal;
            }
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea("if " + nodoIzq.resultado + " " + signo + " " + nodoDer.resultado + " goto " + v, "Si es verdadera saltar a : " + v));
            nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoIncondicional(f), "Si es falsa saltar a: " + f));
            nodo.verdaderas = [];
            nodo.verdaderas.push(v);
            nodo.falsas = [];
            nodo.falsas.push(f);
            return nodo;
        }
        else if (nodoIzq.tipo === Tipo.ID && nodoDer.tipo === Tipo.NULL || nodoIzq.tipo === Tipo.NULL && nodoDer.tipo === Tipo.ID) {
            nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
            nodo.codigo = nodo.codigo.concat(nodoDer.codigo);
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(nodoIzq.resultado + " " + signo + " " + nodoDer.resultado, v), "Verificamos si en null"));
            nodo.codigo.push(Auxiliar.saltoIncondicional(f));
            nodo.verdaderas = [v];
            nodo.falsas = [f];
            nodo.tipo = Tipo.BOOLEAN;
            return nodo;
        }
        else if (nodoIzq.tipo === Tipo.STRING && nodoDer.tipo === Tipo.STRING) {
            nodo.codigo.push(";################################## COMPARAR DOS CADENAS #########################################");
            var posIzq = Auxiliar.generarTemporal();
            var posDer = Auxiliar.generarTemporal();
            var valorIzq = Auxiliar.generarTemporal();
            var valorDer = Auxiliar.generarTemporal();
            var ciclo = Auxiliar.generarEtiqueta();
            var v = Auxiliar.generarEtiqueta();
            var f = Auxiliar.generarEtiqueta();
            var vv = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea(posIzq + " = " + nodoIzq.resultado, "Obtemos la posicion del inicio de la cadena izquierda"));
            nodo.codigo.push(Auxiliar.crearLinea(posDer + " = " + nodoDer.resultado, "Obtenemos la posicion del inicio de la cadena derecha"));
            nodo.codigo.push(ciclo + ":");
            nodo.codigo.push(Auxiliar.crearLinea(valorIzq + " = Heap[" + posIzq + "]", "Obtenemos el caracter de la cadena Izquierda"));
            nodo.codigo.push(Auxiliar.crearLinea(valorDer + " = Heap[" + posDer + "]", "Obtenemos el caracter de la cadena derecha"));
            nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valorIzq + " == " + valorDer, v), "Si es verdadero vamos a verificar si es el fin"));
            if (signo === "==")
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoIncondicional(f), "Etiqueta para falsa"));
            else
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoIncondicional(vv), "Etiqueta para verdadera"));
            nodo.codigo.push(v + ":");
            if (signo === "==")
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valorIzq + " == " + " 0", vv), "Si estamos al final entonces la cadena si es correcta"));
            else
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valorIzq + " == " + " 0", f), "Si estamos al final entonces la cadena si es incorrecta"));
            nodo.codigo.push(Auxiliar.crearLinea(posIzq + " = " + posIzq + " + 1", "Aumentamos la posicion de la cadena izquierda"));
            nodo.codigo.push(Auxiliar.crearLinea(posDer + " = " + posDer + " + 1", "Aumentamos la posicion de la cadena derecha"));
            nodo.codigo.push(Auxiliar.saltoIncondicional(ciclo));
            nodo.verdaderas = [vv];
            nodo.falsas = [f];
            return nodo;
        }
        var mensaje = new MensajeError("Semantico", " no se puede obtener el " + signo + " de los tipos: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, l, c);
        Auxiliar.agregarError(mensaje);
        return mensaje;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    Relacional.prototype.primeraPasada = function (entorno) {
        throw new Error("Method not implemented.");
    };
    return Relacional;
}());
