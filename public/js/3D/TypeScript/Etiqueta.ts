declare function agregarEtiqueta(etiqueta:any):any;
class Etiqueta{
    nombre: string;
    l: number;
    c: number;
    posicion : number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param nombre 
     * @param l 
     * @param c 
     * @param pos 
     */
    constructor(nombre:string,l:number,c:number,pos:number){
        this.nombre = nombre;
        this.l = l;
        this.c = c;
        this.posicion = pos;
    }

    /**
     * METODO DE LA CLASE PADRE
     */
    ejecutar(ambito : Ambito){
        let resultado = buscarEtiqueta(this.nombre);
        agregarEtiqueta({nombre: this.nombre,posicion : this.posicion});
        return -1;
    }
}