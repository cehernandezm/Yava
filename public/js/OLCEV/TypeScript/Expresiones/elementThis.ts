class elementThis implements Instruccion{
    id:String;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param l 
     * @param c 
     */
    constructor(id:String,l:number,c:number){
        this.id = id;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let s:Simbolo = entorno.buscarSimboloThis(this.id);
        if(s === null){
            let mensaje:MensajeError = new MensajeError("Semantico","El atributo: " + this.id + " no existe",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        return Primitivo.crearNodo(s);
    }    
    
    
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }

    
}