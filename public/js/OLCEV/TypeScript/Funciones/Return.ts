class Return implements Instruccion{
    
    expresion:Instruccion;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASEs
     * @param expresion 
     * @param l 
     * @param c 
     */
    constructor(expresion:Instruccion,l:number,c:number){
        this.expresion = expresion;
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
        
        salida.codigo = salida.codigo.concat(nodo.codigo);
        if(nodo.tipo === Tipo.BOOLEAN) nodo = Aritmetica.arreglarBoolean(nodo,salida);
        let posicion:String = Auxiliar.generarTemporal();

        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + (entorno.tamaño - 1),"Posicion del return"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado,"Asignamos el return"));

        let retorno:String = Auxiliar.generarEtiqueta();
        salida.codigo.push(Auxiliar.saltoIncondicional(retorno));
        salida.retornos.push(retorno);
        salida.tipo = nodo.tipo;
        salida.valor = nodo.valor;


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