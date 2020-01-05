class Length implements Instruccion{
    id:Instruccion;
    l:number;
    c:number;



    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param l 
     * @param c 
     */
    constructor(id:Instruccion,l:number,c:number){
        this.id = id;
        this.l = l;
        this.c = c;
    }



    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUAL
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);

        let resultado:Object = this.id.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodo:Nodo = resultado as Nodo;

        //-------------------------------------------------------------- STRING ----------------------------------------------------------------
        if(nodo.tipo === Tipo.STRING){
            salida.codigo = salida.codigo.concat(nodo.codigo);
            let posicion:String = Auxiliar.generarTemporal();
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño,"Simulacion de cambio de ambito"));
            salida.codigo.push(posicion + " = P + 0");
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado,"Pasamos la referencia de la cadena"));
            salida.codigo.push("call stringLength");
            salida.codigo.push(posicion + " = P + 1");
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]","Obtenemos el valor del retorno"));
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño,"Fin simulacion de cambio de ambito"));
            salida.tipo = Tipo.INT;
            salida.resultado = temporal;
            return salida;
        }
        
        //------------------------------------------------------------ ARREGLOS ----------------------------------------------------------------
        if(nodo.tipo != Tipo.ARREGLO){
            let mensaje:MensajeError = new MensajeError("Semantico","no se le puede aplicar la funcion length al tipo: " + Tipo[nodo.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo = salida.codigo.concat(nodo.codigo);
        let temporal:String = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + nodo.resultado + "]","Obtenemos el tamanio del arreglo"));

        salida.tipo = Tipo.INT;
        salida.resultado = temporal;
        return salida;
    }    
    
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}