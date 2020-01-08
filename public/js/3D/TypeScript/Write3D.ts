class Write3D{
    numero:any;
    l:number;
    c:number;
    posicion:number;


    constructor(numero:any,l:number,c:number,posicion:number){
        this.numero = numero;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }



    ejecutar(ambito:Ambito){
        let resultado:any = (this.numero == null) ? null : this.numero.ejecutar(ambito);
        if(resultado instanceof MensajeError) return resultado;

        let nu:String = resultado.valor;
        if(ambito.cadena == null) ambito.cadena = String.fromCharCode(+nu);
        else ambito.cadena += String.fromCharCode(+nu);
        return -1;
    }
}