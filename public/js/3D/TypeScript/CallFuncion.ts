declare function buscarFuncion(nombre:String):any;

class CallFuncion{
    id : String;
    l : number;
    c : number;
    posicion : number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param l 
     * @param c 
     * @param posicion 
     */
    constructor(id:String,l:number, c: number, posicion : number){
        this.id = id;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }


    ejecutar(ambito:Ambito){
       
        
        ambito.entornos.push(this.id);
        let funcion : Funcion = buscarFuncion(this.id);
        
        if(funcion === null) addMensajeError("Semantico", "La funcion: " + this.id + " no existe",this.l,this.c);
        else funcion.ejecutar(ambito);
        ambito.limpiarEntorno(ambito.getEntorno());
        ambito.entornos.pop();
        

        return -1;

    }


   
 


}