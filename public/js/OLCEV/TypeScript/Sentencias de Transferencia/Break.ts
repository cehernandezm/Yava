class Break implements Instruccion{
    




    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    ejecutar(entorno: Entorno): Object {
        let nodo:Nodo = new Nodo([]);
        let salto:String = Auxiliar.generarEtiqueta();
        nodo.codigo.push(Auxiliar.saltoIncondicional(salto));
        nodo.breaks.push(salto);
        
        return nodo;
    }    
    
    
    /**
     * PRIMERA PASADA RETORNA UN 0
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}