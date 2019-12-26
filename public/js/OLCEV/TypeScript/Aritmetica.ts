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
            salida.codigo = salida.codigo.concat(this.concatenar(izq.resultado,izq.tipo,entorno,izq).codigo);
            salida.codigo = salida.codigo.concat(this.concatenar(der.resultado,der.tipo,entorno,der).codigo);
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0","Fin de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));
            salida.resultado = temporal;
            return salida;

        }
        let mensaje:MensajeError = new MensajeError("Semantico","No se puede sumar: " + Tipo[izq.tipo] + " con: " + Tipo[der.tipo],entorno.archivo,this.l,this.c);
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


    /**
     * METODO QUE SE ENCARGA DE CONCATENAR DOS EXPRESIONES
     * Y DE VOLVER UN STRING
     * @param valor POSICION/PRIMITVO
     * @param tipo  DE EXPRESION A CONCATENAR
     * @param entorno ENTORNO ACTUAL
     */
    private  concatenar(valor:String,tipo:Tipo,entorno:Entorno,actual:Nodo):Nodo{
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];
        switch(tipo){
            case Tipo.INT:
            case Tipo.DOUBLE:
                let posicion:String = Auxiliar.generarTemporal();
                nodo.codigo.push(";########## " + valor + " to String ###################");
                nodo.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño,"Simulacion de cambio de ambito"));
                nodo.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0","Nos posicionamos en el parametro 0"));
                nodo.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + valor,"Almacenamos el numero a convertir a String"));
                nodo.codigo.push(Auxiliar.crearLinea("call numberToCadena","Llamamos al metodo encargado de realizar el casteo"));
                nodo.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño,"Terminal simulacion de cambio de ambito"));
                return nodo;
            
            case Tipo.CHAR:
                let ascii:number = valor.charCodeAt(0);
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = " + ascii,"Almacenamos el ascii del caracter: " + valor));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));
                return nodo;

            case Tipo.STRING:
                nodo.codigo.push(";################# ADJUNTANDO CADENA: " + valor + " #####################");
                let aux:String = Auxiliar.generarTemporal();
                let v:String = Auxiliar.generarEtiqueta();
                let f:String = Auxiliar.generarEtiqueta();
                nodo.codigo.push(v + ":");
                nodo.codigo.push(Auxiliar.crearLinea(aux + " = Heap[" + valor + "]","Almacenamos el primer valor de la cadena"));
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(aux + " == " + 0,f),"Si se cumple estamos al final de la cadena"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = " + aux,"Almacenamos el valor en una nueva posicion"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));
                nodo.codigo.push(Auxiliar.crearLinea(valor + " = " + valor + " + 1","Aumentamos la posicion de la cadena"));
                nodo.codigo.push(Auxiliar.saltoIncondicional(v));
                nodo.codigo.push(f + ":");
                return nodo;

            case Tipo.BOOLEAN:
            if(actual.verdaderas === null){
                let verdadera:String = Auxiliar.generarEtiqueta();
                let salto:String = Auxiliar.generarEtiqueta();
                nodo.codigo.push(";############### CONCATENANDO BOOLEAN #########################");
                nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + " == 0",verdadera),"Si es un false"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 116","t"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 114","r"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 117","u"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 101","e"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.saltoIncondicional(salto));
                nodo.codigo.push(verdadera + ":");
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 102","f"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 97","a"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 108","l"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 115","s"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 101","e"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(salto + ":");
            }
            else{
                let salto:String = Auxiliar.generarEtiqueta();
                nodo.codigo.push(";############### CONCATENANDO BOOLEAN #########################");
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(actual.verdaderas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 116","t"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 114","r"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 117","u"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 101","e"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.saltoIncondicional(salto));
                nodo.codigo = nodo.codigo.concat(Auxiliar.escribirEtiquetas(actual.falsas).codigo);
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 102","f"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 97","a"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 108","l"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 115","s"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 101","e"));
                nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentar Heap"));
                nodo.codigo.push(salto + ":");
            }
        }

        return nodo;
    }

}