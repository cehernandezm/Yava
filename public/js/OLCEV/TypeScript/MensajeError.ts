class MensajeError{
    tipo:String;
    detalle:String;
    archivo:String;
    l:number;
    c:number;

    constructor(tipo:String,detalle:String,archivo:String,l:number,c:number){
        this.tipo = tipo;
        this.detalle = detalle;
        this.archivo = archivo;
        this.l = l;
        this.c = c;
    }
}