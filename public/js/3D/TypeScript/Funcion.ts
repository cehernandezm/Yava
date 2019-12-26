declare function redirigir(listaInstrucciones:any,posicion:any,i:any):any;
class Funcion {
    id: String;
    instrucciones: any;
    l: number;
    c: number;
    posicion: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param instrucciones 
     * @param l 
     * @param c 
     * @param posicion 
     */
    constructor(id: String, instrucciones: any, l: number, c: number, posicion: number) {
        this.id = id;
        this.instrucciones = instrucciones;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }


    ejecutar(ambito: Ambito) {

        
        let instruccion : Instruccion = new Instruccion(this.instrucciones,ambito);
        instruccion.ejecutar();

        return -1;
    }
}