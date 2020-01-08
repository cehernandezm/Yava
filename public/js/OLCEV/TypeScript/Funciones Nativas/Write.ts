class Write implements Instruccion{
    
    expresion:Instruccion;
    l:number;
    c:number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion 
     * @param l 
     * @param c 
     */
    constructor(expresion:Instruccion,l:number,c:number){
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    
    
    
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);

        let resultado:Object = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodo:Nodo = resultado as Nodo;

        if(nodo.tipo != Tipo.STRING){
            let mensaje:MensajeError = new MensajeError("Semantico","Se necesita que sea una cadena la que se escribira en el archivo",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo = salida.codigo.concat(nodo.codigo);
        let f:String = Auxiliar.generarEtiqueta();
        let s:String = Auxiliar.generarEtiqueta();
        let valor:String = Auxiliar.generarTemporal();

        salida.codigo.push(s + ":");
        salida.codigo.push(valor + " = Heap[" + nodo.resultado + "]");
        salida.codigo.push(Auxiliar.saltoCondicional(valor + " == 0",f));
        salida.codigo.push("write(" + valor + ")");
        salida.codigo.push(nodo.resultado + " = " + nodo.resultado + " + 1");
        salida.codigo.push(Auxiliar.saltoIncondicional(s)); 

        salida.codigo.push(f + ":");
        salida.codigo.push("exit(0)");

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