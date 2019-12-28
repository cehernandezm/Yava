class Nodo extends Valor{
    codigo:Array<String> = [];
    resultado:String;
    verdaderas:Array<String> = null;
    falsas:Array<String> = null;
    atributos:Object;
    localizacion:Localizacion;
    posicion:String = null;

    constructor()
    constructor(codigo:Array<String>)
    constructor(codigo:Array<String>,resultado:String,tipo:Tipo,valor:Object)
    constructor(codigo?:Array<String>,resultado?:String,tipo?:Tipo,valor?:Object){
        super(tipo,valor);
        this.codigo = codigo;
        this.resultado = resultado;
    }
}