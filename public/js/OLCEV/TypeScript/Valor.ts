
class Valor{
    tipo : Tipo;
    valor : Object;

    constructor(tipo:Tipo,valor:Object){
        this.tipo = tipo;
        this.valor = valor;
    }


    getTipo():Tipo{
        return this.tipo;
    }

    setTipo(tipo:Tipo){
        this.tipo = tipo;
    }

    getValor():Object{
        return this.valor;
    }

    setValor(valor:Object){
        this.valor = valor;
    }
}


enum Tipo{
    INT,
    DOUBLE,
    STRING,
    CHAR,
    ID
};


enum Operacion{
    SUMA
};