declare function agregarClase(clase:any):any;
declare function getClase(id:any):any;
class Clase implements Instruccion {
    modificador: Array<Modificador>;
    nombre: String;
    instrucciones: Array<Instruccion>
    extender: String;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param modificiador Modificador que afectara a la clase
     * @param nombre nombre de la clase
     * @param instrucciones lista de instrucciones
     * @param extender nombre de la clase a la que extendera
     * @param l linea de la instruccion
     * @param c columna de la instruccion
     */
    constructor(modificiador: Array<Modificador>, nombre: String, instrucciones: Array<Instruccion>, extender: String, l: number, c: number) {
        this.modificador = modificiador;
        this.nombre = nombre;
        this.instrucciones = instrucciones;
        this.extender = extender;
        this.l = l;
        this.c = c;
    }


    /**
     * ESTA CLASE NO IMPLEMENTA EL METODO EJECUTAR
     * @param entorno Entorno actual
     */
    ejecutar(entorno:Entorno): Object {
        return null;
    }

    /**
     * PRIMERA PASADA DE LA CLASE
     * Donde se alamcenara en listaClase
     * se obtendra su tamaño
     * atributos y metodos
     * @param entorno Entorno Actual
     */
    primeraPasada(entorno: Entorno): Object {
        let salida:Nodo = new Nodo();
        salida.codigo = [];
        let claseTemp: Simbolo = getClase(this.nombre);
        if (claseTemp != null) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La clase: " + this.nombre + " ya existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let visibilidad = null;
        let isStatic: Boolean = false;
        let isAbstract: Boolean = false;
        let isFinal: Boolean = false;

        /**
         * VERIFICAMOS QUE NO TENGA MODIFICADORES DE MAS
         * Y QUE VENGAN SOLO UNA VEZ
         */
        if (this.modificador != null) {
            this.modificador.forEach(element => {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Static", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Final", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Abstract", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isAbstract = true;
                        break;
                }

            });
        }
        if (visibilidad == null) visibilidad = Modificador.PUBLIC;
        
        /**
         * SI VAMOS A EXTENDER DE UNA CLASE
         */
        if (this.extender != null) {
            claseTemp = getClase(this.extender);
            if (claseTemp == null) {
                let mensaje: MensajeError = new MensajeError("Semantico", "No existe la clase: " + this.extender + " que se quiere extender", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            this.instrucciones = this.instrucciones.concat(claseTemp.instrucciones);

        }
        let tam: number = this.instrucciones.length;
        let s:Simbolo = new Simbolo(this.nombre,Rol.CLASE,tam,Auxiliar.crearObjectoAtributos(visibilidad,isFinal,isStatic,isAbstract),this.instrucciones);
        s.entorno = entorno;
        agregarClase(s);

        entorno.clase = this.nombre;
        /**
         * ALMACENAMOS TODOS SUS ATRIBUTOS
         */
        this.instrucciones.forEach(element => {
            if(element instanceof Declaracion) element.ejecutar(entorno);
        });

        /**
         * BUSCAMOS SI TIENE UN CONSTRUCTOR 
         * DE LO CONTRARIO GENERAMOS UNO 
         * AUTOMATICAMENTE
         */
        let flag:Boolean = false;
        this.instrucciones.forEach(element => {
            if(element instanceof Constructor) {
                let e: Entorno = Auxiliar.clonarEntorno(entorno);
                e.localizacion = Localizacion.STACK;
                e.posRelativaStack = 1;
                e.tamaño = 1; //----- Su tamaño inicialmente es uno porque tiene como parametro 0 un this que es la referencia para atributos---------
                
                element.primeraPasada(e); //----- Realizamos la primera pasada obteniendo el tamaño total del constructor
                let resultado: Object = element.ejecutar(e);
                if(!(resultado instanceof MensajeError)){
                    let nodo:Nodo = resultado as Nodo;
                    salida.codigo = salida.codigo.concat(nodo.codigo);
                }
                flag = true;
            }
        });

        /**
         * SI NO SE ENCONTRO NINGUN CONSTRUCTOR SE CREA UNO CON TODOS LOS ATRIBUTOS
         */
        if(!flag){
            let nodo:Nodo = new Nodo();
            nodo.codigo = [];
            nodo.codigo.push(";#############################");
            nodo.codigo.push(";########CONSTRUCTOR " + this.nombre);
            nodo.codigo.push(";#############################");
            nodo.codigo.push("proc contructor_" + this.nombre + "{");
            
            entorno.listaSimbolos.forEach(s => {
                //--------------------------- SIGNIFICA QUE ES UNA VARIABLE ESTATICA ---------------------------------------------
                if(s.localizacion == Localizacion.STACK) nodo.codigo.push(Auxiliar.crearLinea("Stack[" + s.posAbsoluta + "] = 0","iniciando variable: " + s.id));
                else{
                    let pos:String = Auxiliar.generarTemporal();
                    nodo.codigo.push(Auxiliar.crearLinea(pos + " = P + 0", "Obtenemos la posicion de referencia this"));
                    nodo.codigo.push(Auxiliar.crearLinea(pos + " = " + pos + " + " + s.posRelativa,"Nos movemos hacia la variable que necesitamos"));
                    nodo.codigo.push(Auxiliar.crearLinea("Heap[" + pos + "] = 0","Iniciando variable: " + s.id));
                }
            });
            nodo.codigo.push("}");
            salida.codigo = salida.codigo.concat(nodo.codigo);
        }
        return salida;
    }
}