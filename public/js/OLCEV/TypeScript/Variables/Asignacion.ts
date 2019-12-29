class Asignacion implements Instruccion{
    
    id:String;
    expresion:Instruccion;
    l:number;
    c:number;

    constructor(id:String,expresion:Instruccion,l:number,c:number){
        this.id = id;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }




    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno Actual
     */
    ejecutar(entorno: Entorno): Object {
        let s:Simbolo = entorno.buscarSimbolo(this.id);
        //------------------------------------------ SI NO EXISTE EL SIMBOLO ----------------------------------------------------------------
        if(s == null){
            let mensaje:MensajeError = new MensajeError("Semantico","La variable: " + this.id + " no existe",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let result:Object = this.expresion.ejecutar(entorno);
        if(result instanceof MensajeError) return result;
        
        let salida:Nodo = new Nodo();
        salida.codigo = [];

        let nodo:Nodo = result as Nodo;
        
        if(!(Asignacion.casteoImplicito(s.tipo,nodo.tipo))){
            let mensaje:MensajeError = new MensajeError("Semantico","No se le puede asignar un tipo: " + Tipo[nodo.tipo] + " a : " + Tipo[s.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo = salida.codigo.concat(nodo.codigo);
        if(s.atributo['isStatic'] == true) salida.codigo.push(Auxiliar.crearLinea("Stack[" + s.posAbsoluta  + "] = " + nodo.resultado," Accedemos a la variable estatica " + s.id));
        else if(s.localizacion == Localizacion.STACK){
            let temp:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temp + " = P + " + s.posRelativa,"Accedemos a la posicion de la variable: " + s.id));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + temp + "] = " + nodo.resultado,"Asignamos el valor a la variable: " + s.id));
        }else{
            let temp:String = Auxiliar.generarTemporal();
            let posHeap:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(temp + " = P + 0","Accedemos al atributo this"));
            salida.codigo.push(Auxiliar.crearLinea(posHeap + " = Stack[" + temp + "]","Obtenemos la posicion en el heap de this"));
            salida.codigo.push(Auxiliar.crearLinea(posHeap + " = " + posHeap + " + " + s.posRelativa,"Nos movemos en el heap"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[" + posHeap + "] = " + nodo.resultado,"Le asignamos valor a la variable: " + s.id));
        }
        
        return salida;
    }    


    /**
     * EN LA PRIMERA PASADA RETORNA UN 0 PUES NO 
     * SE CREA UNA VARIABLE
     * @param entorno Entorno Actual
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


    public static casteoImplicito(tipo:Tipo,tipoValor:Tipo):Boolean{
        if(tipo === Tipo.INT && tipoValor === Tipo.CHAR) return true;
        else if(tipo === Tipo.DOUBLE && tipoValor === Tipo.CHAR) return true;
        else if(tipo === Tipo.DOUBLE && tipoValor === Tipo.INT) return true;
        else return tipo === tipoValor;
    }


}