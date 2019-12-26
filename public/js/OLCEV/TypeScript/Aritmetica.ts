class Aritmetica implements Instruccion {


    izq: Instruccion;
    der: Instruccion;
    operacion: Operacion;
    l: number;
    c: number;

    constructor(izq: Instruccion, der: Instruccion, operacion: Operacion, l: number, c: number) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUAL
     */
    ejecutar(entorno: Entorno): Object {
        let valueIzq: Object = this.izq.ejecutar(entorno);
        let valueDer: Object = this.der.ejecutar(entorno);

        if (valueIzq instanceof MensajeError) return valueIzq;
        if (valueDer instanceof MensajeError) return valueIzq;

        let nodoIzq: Nodo = valueIzq as Nodo;
        let nodoDer: Nodo = valueDer as Nodo;

        let nodo: Nodo = new Nodo([]);
        nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
        nodo.codigo = nodo.codigo.concat(nodoDer.codigo);
        switch (this.operacion) {
            case Operacion.SUMA: return this.suma(nodoIzq, nodoDer, nodo,entorno);
        }



    }

    /**
     * METODO QUE SE ENCARGARA DE RESOLVER LA SUMA
     * @param izq Operando izquierdo
     * @param der Operando derecho
     * @param salida nodo de resultado
     */
    suma(izq: Nodo, der: Nodo, salida: Nodo,entorno:Entorno): Object {
        if ((izq.tipo === Tipo.INT && der.tipo === Tipo.DOUBLE) || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.INT)
            || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.CHAR) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.DOUBLE)
            || (izq.tipo === Tipo.DOUBLE && der.tipo === Tipo.DOUBLE)) {
            let temporal: String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + izq.resultado + " + " + der.resultado, ""));
            salida.tipo = Tipo.DOUBLE;
            salida.resultado = temporal;
            return salida;
        }
        else if ((izq.tipo === Tipo.INT && der.tipo === Tipo.CHAR) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.INT)
            || (izq.tipo === Tipo.INT && der.tipo === Tipo.INT) || (izq.tipo === Tipo.CHAR && der.tipo === Tipo.CHAR)) {
            let temporal: String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + izq.resultado + " + " + der.resultado, ""));
            salida.tipo = Tipo.INT;
            salida.resultado = temporal;
            return salida;
        }
        else if(izq.tipo === Tipo.STRING || der.tipo === Tipo.STRING){
            salida.tipo = Tipo.STRING;
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = H + 0","Inicio de la nueva cadena"));
            salida.codigo = salida.codigo.concat(Auxiliar.concatenar(izq.resultado,izq.tipo,entorno).codigo);
            salida.codigo = salida.codigo.concat(Auxiliar.concatenar(der.resultado,der.tipo,entorno).codigo);
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0","Fin de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));
            salida.resultado = temporal;
            return salida;

        }
        let mensaje:MensajeError = new MensajeError("Semantico","No se puede sumar: " + izq.tipo + " con: " + der.tipo,entorno.archivo,this.l,this.c);
        Auxiliar.agregarError(mensaje);
        return mensaje;
    }




    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno ENTORNO ACTUAL
     */
    primeraPasada(entorno: Entorno): Object {
        throw new Error("Method not implemented.");
    }

}