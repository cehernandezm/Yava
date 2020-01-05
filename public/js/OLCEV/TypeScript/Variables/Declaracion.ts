class Declaracion extends Valor implements Instruccion{
    
    id:String;
    modificador:Array<Modificador>;
    dimensiones:number;
    l:number;
    c:number;
    parametro:Boolean = false;
    
    constructor(id:String,modificador:Array<Modificador>,tipo:Tipo,valor:Object,l:number,c:number)
    constructor(id:String,modificador:Array<Modificador>,tipo:Tipo,valor:Object,l:number,c:number,dimesiones?:number){
        super(tipo,valor);
        this.id = id;
        this.modificador = modificador;
        this.l = l;
        this.c = c;
        this.dimensiones = dimesiones;
    }

    /**
     * PRIMERA PASADA EN ESTA INSTRUCCION 
     * NO TIENE ACCION
     * @param entorno Entorno Actual
     */
    primeraPasada(entorno: Entorno): Object {
        return 1;
    }

    /**
     * METODO CUANDO SE EJECUTE 
     * GUARADARA LA VARIABLE
     * @param entorno Entorno actual
     */
    ejecutar(entorno:Entorno):Object{
        let s:Simbolo = entorno.buscarSimbolo(this.id);
        //---------------------------------------------- Si ya existe una variable con ese nombre
        if(s != null && !this.parametro){
            let mensaje:MensajeError = new MensajeError("Semantico","El identificador: " + this.id + " ya existe",entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let visibilidad = null;
        let isStatic: Boolean = false;
        let isAbstract: Boolean = false;
        let isFinal: Boolean = false;


        if (this.modificador != null) {
            this.modificador.forEach(element => {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya es Static", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya es Final", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La variable ya es Abstract", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isAbstract = true;
                        break;
                }

            });
        }
        if (visibilidad == null) visibilidad = Modificador.PRIVATE;



        let atributo = Auxiliar.crearObjectoAtributos(visibilidad,isFinal,isStatic,isAbstract);

        let simbolo:Simbolo = new Simbolo();
        simbolo.id = this.id;
        simbolo.rol = Rol.VARIABLE;
        simbolo.isNull = true;
        simbolo.tipo = this.tipo;
        
        if(this.tipo === Tipo.ARREGLO){
            simbolo.dimensiones = this.dimensiones;
            simbolo.valor = this.valor;
        }
        
        simbolo.posRelativa = entorno.getPosRelativa();
        if(isStatic){
            simbolo.localizacion = Localizacion.STACK;
            simbolo.posAbsoluta = Auxiliar.posicionAbsoluta();
        }else{
            simbolo.localizacion = entorno.localizacion;
            simbolo.posAbsoluta = -1;
        }
        simbolo.atributo = atributo;
        simbolo.objeto = this.valor.toString();

        entorno.agregarSimbolo(simbolo);
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];
        return nodo;

    }
}