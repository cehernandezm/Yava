class equals implements Instruccion{
    
    expresionIzq:Instruccion;
    expresionDer:Instruccion;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresionIzq 
     * @param expresionDer 
     * @param l 
     * @param c 
     */
    constructor(expresionIzq:Instruccion,expresionDer:Instruccion,l:number,c:number){
        this.expresionIzq = expresionIzq;
        this.expresionDer = expresionDer;
        this.l = l;
        this.c = c;
    }
    
    
    
    
    
    ejecutar(entorno: Entorno): Object {

        let salida:Nodo = new Nodo([]);

        let resultado:Object = this.expresionIzq.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodoIzq:Nodo = resultado as Nodo;

        resultado = this.expresionDer.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodoDer:Nodo = resultado as Nodo;

        
        salida.codigo = salida.codigo.concat(nodoIzq.codigo);
        salida.codigo = salida.codigo.concat(nodoDer.codigo);
        let v:String = Auxiliar.generarEtiqueta();
        let f:String = Auxiliar.generarEtiqueta();

        if(nodoIzq.tipo === Tipo.ID && nodoDer.tipo === Tipo.ID){

        }
        else if(nodoIzq.tipo === Tipo.ARREGLO && nodoDer.tipo === Tipo.ARREGLO){

        }
        else{
            let mensaje:MensajeError = new MensajeError("Semantica","equals no puede comparar los tipos: " + Tipo[nodoIzq.tipo] +  " con: " + Tipo[nodoDer.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo.push(Auxiliar.saltoCondicional(nodoIzq.resultado + " == " + nodoDer.resultado,v));
        salida.codigo.push(Auxiliar.saltoIncondicional(f));
        salida.tipo = Tipo.BOOLEAN;
        salida.verdaderas = [v];
        salida.falsas = [f];

        return salida;
    }    
    
    
    
    
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}