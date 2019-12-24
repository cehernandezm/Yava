class Constructor implements Instruccion{
    id:String;
    parametros:Array<Parametro>;
    instrucciones:Array<Instruccion>;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id Nombre del constructor
     * @param parametros lista de parametros
     * @param instrucciones lista de instrucciones
     * @param l linea de la instruccion
     * @param c columna de la instruccion
     */
    constructor(id:String,parametros:Array<Parametro>,instrucciones:Array<Instruccion>,l:number,c:number){
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
        this.l = l;
        this.c = c;
    }
    
    
    ejecutar(entorno: Entorno): Object {
        return "";
    }
    
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno Entorno actual
     */
    primeraPasada(entorno: Entorno): Object {
        if(entorno.clase !== this.id){
            let mensaje:MensajeError = new MensajeError("Semantico","El nombre de la clase es: " + entorno.clase + " y el del constructor es: " + this.id,entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        return "";
    }


}