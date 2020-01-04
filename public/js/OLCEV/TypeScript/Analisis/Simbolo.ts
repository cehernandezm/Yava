class Simbolo{
    id:String;
    rol:Rol;
    tipo:Tipo;
    valor:Object;
    tam:number;
    posRelativa:number;
    posAbsoluta:number;
    atributo:Object;
    dimensiones:number;
    isParam : Boolean;
    isNull : Boolean;
    localizacion:Localizacion;
    instrucciones:Array<Instruccion>;
    entorno:Entorno;
    verdaderas:Array<String> = null;
    falsas:Array<String> = null;
    objeto:String = "";

    constructor()
    /**
     * CONSTRUCTOR PARA CLASES
     * @param id Identificador de la clase
     * @param rol QUE TIPO DE SIMBOLO ES
     * @param tam Tamaño de la clase
     * @param atributo sus visibilidade etc
     * @param instrucciones cuerpo de la clase
     */
    constructor(id:String,rol:Rol,tam:number,atributo:Object,instrucciones:Array<Instruccion>)
    constructor(id?:String,rol?:Rol,tam?:number,atributo?:Object,instrucciones?:Array<Instruccion>,localizacion?:Localizacion)
    {
        this.id = id;
        this.rol = rol;
        this.tam = tam;
        this.atributo = atributo;
        this.instrucciones = instrucciones;
        this.isNull = true;
        this.localizacion = localizacion;
    }
    


}