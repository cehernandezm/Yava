declare function buscarEtiqueta(etiqueta:any):any;
class Incondicional{
    posicion: number;
    l : number;
    c : number;
    etiqueta : String;


    constructor(pos:number,l:number,c:number,etiqueta:String){
        this.posicion = pos;
        this.l = l;
        this.c = c;
        this.etiqueta = etiqueta;
    }

    ejecutar(ambito : Ambito){
       let etiqueta = buscarEtiqueta(this.etiqueta);
       if(etiqueta != null) return etiqueta.posicion;
       addMensajeError("Semantico","La etiqueta: " + this.etiqueta + " no existe",this.l,this.c);
       return -1;
    }

}