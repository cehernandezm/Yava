class Declaracion3D{
    id:String;
    expresion:any;
    posicion: number;
    l: number;
    c: number;

    constructor(id:String,expresion:any,l:number,c:number,posicion:number){
        this.id = id;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }


    ejecutar(ambito:Ambito){
        let resultado:any = this.expresion.ejecutar(ambito);
        if(resultado instanceof MensajeError) return -1;
        return ambito.agregarTemporal({ id: this.id, valor: resultado.valor, tipo: "number", ambito : ambito.getEntorno() });
    }
}