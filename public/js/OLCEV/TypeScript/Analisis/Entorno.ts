class Entorno {
    localizacion: Localizacion;
    listaContinue: Array<String>;
    listaBreak: Array<String>
    etiquetaSalida: String;
    posRelativaStack: number;
    archivo: String;
    listaSimbolos: Array<Simbolo>
    metodos: Array<FuncionOLCEV> = [];
    tamaño: number;
    clase: String;

    constructor(archivo: String) {
        this.localizacion = Localizacion.HEAP;
        this.listaContinue = [];
        this.listaBreak = [];
        this.etiquetaSalida = null;
        this.posRelativaStack = 0;
        this.archivo = archivo;
        this.listaSimbolos = [];

    }



    /**
     * METODO PARA OBTENER UNA VARIABLE
     * @param id NOMBRE DE LA VARIABLE
     */
    public buscarSimbolo(id: String): Simbolo {
        for (let i = this.listaSimbolos.length - 1; i >= 0; i--) {
            if (this.listaSimbolos[i].id === id) return this.listaSimbolos[i];
        }
        return null;
    }

    /**
     * BUSCA ATRIBUTOS
     * @param id 
     * @param flag 
     */
    public buscarSimboloThis(id: String): Simbolo {
        for (let i = this.listaSimbolos.length - 1; i >= 0; i--) {
            if (this.listaSimbolos[i].id === id && this.listaSimbolos[i].localizacion === Localizacion.HEAP) return this.listaSimbolos[i];
        }
        return null;
    }


    /**
     * METODO PARA AGREGAR SIMBOLOS
     * @param s SIMBOLO A AGREGAR
     */
    public agregarSimbolo(s: Simbolo) {
        this.listaSimbolos.push(s);
    }

    /**
     * METODO PARA OBTENER LAS POSICIONES RELATIVAS
     */
    public getPosRelativa(): number {
        let i = this.posRelativaStack;
        this.posRelativaStack++;
        return i;
    }

    /**
     * FUNCION ENCARGADA DE BUSCAR LAS FUNCIONES
     * DE LA CLASE POR ALCANCE
     * ESTO SERVIRA POR SI ALGUN METODO ES 
     * SOBREESCRIBIDO
     * @param id 
     * @param parametros 
     */
    public buscarFuncion(id: String, parametros: Array<Instruccion>): FuncionOLCEV {

        for (let i: number = this.metodos.length - 1; i >= 0; i--) {
            let f: FuncionOLCEV = this.metodos[i];
            if (f.identificador === id) return f;
        }
        return null;
    }
}