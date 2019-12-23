class Aritmetica implements Instruccion{
    
    izq: Instruccion;
    der: Instruccion;
    operacion : Operacion;
    l:number;
    c:number;

    constructor(izq:Instruccion,der:Instruccion,operacion:Operacion,l:number,c:number){
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }


    ejecutar(ambito: Ambito): Object {
        let valueIzq:Object = this.izq.ejecutar(ambito);
        let valueDer:Object = this.der.ejecutar(ambito);
        
        if(valueIzq instanceof MensajeError) return valueIzq;
        if(valueDer instanceof MensajeError) return valueIzq;

        let nodoIzq:Nodo = valueIzq as Nodo;
        let nodoDer:Nodo = valueDer as Nodo;

        let nodo:Nodo = new Nodo([]);
        nodo.codigo = nodo.codigo.concat(nodoIzq.codigo);
        nodo.codigo = nodo.codigo.concat(nodoDer.codigo);

        let temporal:String = Auxiliar.generarTemporal();
        nodo.codigo.push(Auxiliar.crearLinea(temporal + " =" + nodoIzq.resultado + "+" + nodoDer.resultado,""));
        nodo.resultado = temporal;
        nodo.tipo = Tipo.INT;
        return nodo;


    }

}