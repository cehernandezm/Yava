class Primitivo extends Valor implements Instruccion{
    l:number;
    c:number;

    constructor(tipo:Tipo,valor:Object,l:number,c:number){
        super(tipo,valor);
        this.l = l;
        this.c = c;
    }

    ejecutar(ambito:Ambito){
        return new Nodo([],this.valor.toString(),this.tipo,"");
    }

}