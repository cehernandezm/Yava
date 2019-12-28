class Unaria implements Instruccion{
    
    expresion:Instruccion;
    operacion:Operacion;
    l:number;
    c:number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion 
     * @param operacion 
     * @param l 
     * @param c 
     */
    constructor(expresion:Instruccion,operacion:Operacion,l:number,c:number){
        this.expresion = expresion;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);
        let resultado:Object = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;

        let nodo:Nodo = resultado as Nodo;
        //----------------------------------------------------------- SI NO ES DE TIPO NUMERICO ------------------------------------------------
        if(nodo.tipo != Tipo.INT && nodo.tipo != Tipo.DOUBLE){
            let mensaje:MensajeError = new MensajeError("Semantico","No se puede aplicar " + Operacion[this.operacion] + " en este tipo: " + nodo.tipo,entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo = salida.codigo.concat(nodo.codigo);
        salida.tipo = nodo.tipo;
        if(this.operacion === Operacion.NEGATIVO){
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = -1 * " + nodo.resultado,"Negamos el valor numerico"));
        }

        //------------------------------------------------- SI ES UN VALOR PRIMITIVO -----------------------------------------------------------------
        if(nodo.posicion === null){
            let mensaje:MensajeError = new MensajeError("Semantico","No se puede aplicar " + Operacion[this.operacion] + " en valores puntuales ",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        if(this.operacion === Operacion.INCREMENTOPRE){
            salida.codigo.push(Auxiliar.crearLinea(nodo.resultado + " = " + nodo.resultado + " + 1","Aumentamos el resultado en 1"));
            salida.resultado = nodo.resultado;
            if(nodo.localizacion === Localizacion.HEAP)  salida.codigo.push(Auxiliar.crearLinea("Heap[" + nodo.posicion + "] = " + nodo.resultado,"Guardamos el valor nuevamente"));
            else salida.codigo.push(Auxiliar.crearLinea("Stack[" + nodo.posicion + "] = " + nodo.resultado,"Guardamos el valor nuevamente"));
        }
        else if(this.operacion === Operacion.DECREMENTOPRE){
            salida.codigo.push(Auxiliar.crearLinea(nodo.resultado + " = " + nodo.resultado + " - 1","Decrementamos el resultado en 1"));
            salida.resultado = nodo.resultado;
            if(nodo.localizacion === Localizacion.HEAP)  salida.codigo.push(Auxiliar.crearLinea("Heap[" + nodo.posicion + "] = " + nodo.resultado,"Guardamos el valor nuevamente"));
            else salida.codigo.push(Auxiliar.crearLinea("Stack[" + nodo.posicion + "] = " + nodo.resultado,"Guardamos el valor nuevamente"));
        }
        else if(this.operacion === Operacion.INCREMENTOPOS){
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + nodo.resultado + " + 1","Aumentamos el resultado en 1"));
            salida.resultado = nodo.resultado;
            if(nodo.localizacion === Localizacion.HEAP)  salida.codigo.push(Auxiliar.crearLinea("Heap[" + nodo.posicion + "] = " + temporal,"Guardamos el valor nuevamente"));
            else salida.codigo.push(Auxiliar.crearLinea("Stack[" + nodo.posicion + "] = " + temporal,"Guardamos el valor nuevamente"));
        }
        else{
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + nodo.resultado + " - 1","Decrementamos el resultado en 1"));
            salida.resultado = nodo.resultado;
            if(nodo.localizacion === Localizacion.HEAP)  salida.codigo.push(Auxiliar.crearLinea("Heap[" + nodo.posicion + "] = " + temporal,"Guardamos el valor nuevamente"));
            else salida.codigo.push(Auxiliar.crearLinea("Stack[" + nodo.posicion + "] = " + temporal,"Guardamos el valor nuevamente"));
        }
        return salida;
    }


    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        throw new Error("Method not implemented.");
    }
}