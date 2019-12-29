class Continue implements Instruccion{
    

    /**
     * CONSTRUCTOR DE LA CLASE
     */
    constructor(){ 
    }


    /**
     * METODO DE LA CLASE PADRE
     * @param entorno ENTORNO ACTUALs
     */
    ejecutar(entorno: Entorno): Object {
        let nodo:Nodo = new Nodo([]);
        let salto:String = Auxiliar.generarEtiqueta();
        nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoIncondicional(salto),"Salto de continue"));
        nodo.continue.push(salto);
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