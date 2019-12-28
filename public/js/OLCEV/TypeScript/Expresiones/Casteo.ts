class Casteo extends Valor implements Instruccion{
    
    expresion:Instruccion;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param tipo 
     * @param valor 
     * @param expresion 
     * @param l 
     * @param c 
     */
    constructor(tipo:Tipo,valor:Object,expresion:Instruccion,l:number,c:number){
        super(tipo,valor);
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    
    
    
    
    
    
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    ejecutar(entorno: Entorno): Object {
        let resultado:Object = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;

        let nodo:Nodo = resultado as Nodo;
        
        
        let salida:Nodo = new Nodo([]);
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if(this.tipo === Tipo.INT && nodo.tipo === Tipo.DOUBLE){
            salida.tipo = Tipo.INT;
            let posicion:String = Auxiliar.generarTemporal();
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(";############################## CASTEO TO INT ###########################");
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño,"Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0","Posicion del primer parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado,"Seteamos el valor del double a truncar"));
            salida.codigo.push("call trunk");
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1","Obtenemos la posicion del return"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]","Obtenemos el valor del return"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño,"Fin simulacion de cambio de ambito"));
            salida.resultado = temporal;
        }
        else if(this.tipo === Tipo.CHAR && nodo.valor === Tipo.DOUBLE){
            salida.tipo = Tipo.CHAR;
            let posicion:String = Auxiliar.generarTemporal();
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(";############################## CASTEO TO CHAR ###########################");
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño,"Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0","Posicion del primer parametro"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado,"Seteamos el valor del double a truncar"));
            salida.codigo.push("call trunk");
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1","Obtenemos la posicion del return"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]","Obtenemos el valor del return"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño,"Fin simulacion de cambio de ambito"));
            salida.resultado = temporal;
        }
        else if( this.tipo === Tipo.CHAR && nodo.valor === Tipo.INT){
            salida.tipo = Tipo.CHAR;
            salida.resultado = nodo.resultado;
        }
        else{
            let mensaje:MensajeError = new MensajeError("Semantico","No se puede castear el tipo:" + Tipo[this.tipo] + " de esta forma",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
       
       
        return salida;
    }    
    
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return null
    }


}