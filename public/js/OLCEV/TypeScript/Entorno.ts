class Entorno{
    localizacion:Localizacion;
    listaContinue:Array<String>;
    listaBreak:Array<String>
    metodoActual:Object;
    etiquetaSalida:String;
    posRelativaStack:number;
    archivo:String;
    listaSimbolos:Array<Simbolo>
    clase:String;

    constructor(archivo:String){
        this.localizacion = Localizacion.HEAP;
        this.listaContinue = [];
        this.listaBreak = [];
        this.metodoActual = null;
        this.etiquetaSalida = null;
        this.posRelativaStack = 0;
        this.archivo = archivo;
        this.listaSimbolos = [];

    }

  
  
    /**
     * METODO PARA OBTENER UNA VARIABLE
     * @param id NOMBRE DE LA VARIABLE
     */
    public buscarSimbolo(id:String):Simbolo{
        for(let i = this.listaSimbolos.length - 1; i >= 0; i--){
            if(this.listaSimbolos[i].id === id ) return this.listaSimbolos[i];
        }
        return null;
    }


    /**
     * METODO PARA AGREGAR SIMBOLOS
     * @param s SIMBOLO A AGREGAR
     */
    public agregarSimbolo(s:Simbolo){
        this.listaSimbolos.push(s);
    }

    /**
     * METODO PARA OBTENER LAS POSICIONES RELATIVAS
     */
    public getPosRelativa():number{
        let i = this.posRelativaStack;
        this.posRelativaStack++;
        return i;
    }
}