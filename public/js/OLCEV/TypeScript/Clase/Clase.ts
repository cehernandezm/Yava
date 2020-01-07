declare function agregarClase(clase: any): any;
declare function getClase(id: any): any;
class Clase implements Instruccion {
    modificador: Array<Modificador>;
    nombre: String;
    instrucciones: Array<Instruccion>
    extender: String;
    l: number;
    c: number;
    entorno: Entorno;
    tamaño: number = 0;
    atributos: Object;
    constructores: Array<String> = [];
    

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
    ejecutar(entorno: Entorno): Object {
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
        let salida: Nodo = new Nodo();
        salida.codigo = [];
        let claseTemp: Clase = getClase(this.nombre);
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

        this.atributos = Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract);
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
            this.tamaño = claseTemp.tamaño;
            entorno.listaSimbolos = entorno.listaSimbolos.concat(claseTemp.entorno.listaSimbolos);
            entorno.metodos = entorno.metodos.concat(claseTemp.entorno.metodos);
            entorno.posRelativaStack = claseTemp.entorno.posRelativaStack;
            entorno.extendida = claseTemp;
            

        }




        entorno.clase = this.nombre;
        /**
         * ALMACENAMOS TODOS SUS ATRIBUTOS
         */
        this.instrucciones.forEach(element => {
            if (element instanceof Declaracion) {
                let resultado: Object = element.ejecutar(entorno);
                if (resultado instanceof MensajeError) return resultado;
                this.tamaño++;
            }
            else if (element instanceof Asignacion) {
                let resultado: Object = element.ejecutar(entorno);
                if (resultado instanceof MensajeError) return resultado;
                let nodo: Nodo = resultado as Nodo;
                salida.codigo = salida.codigo.concat(nodo.codigo);

            }
            if (element instanceof FuncionOLCEV) element.primeraPasada(entorno);
        });
        /**
         * BUSCAMOS SI TIENE UN CONSTRUCTOR 
         * DE LO CONTRARIO GENERAMOS UNO 
         * AUTOMATICAMENTE
         */
        let flag: Boolean = false;
        this.instrucciones.forEach(element => {
            if (element instanceof Constructor) {
                let e: Entorno = Auxiliar.clonarEntorno(entorno);
                e.localizacion = Localizacion.STACK;
                e.posRelativaStack = 1;
                element.primeraPasada(e); //----- Realizamos la primera pasada obteniendo el tamaño total del constructor
                let resultado: Object = element.ejecutar(e);
                if (!(resultado instanceof MensajeError)) {
                    let nodo: Nodo = resultado as Nodo;
                    salida.codigo = salida.codigo.concat(nodo.codigo);
                    this.constructores.push(element.identificador);
                } else return resultado;
                flag = true;
            }
        });

        /**
         * SI NO SE ENCONTRO NINGUN CONSTRUCTOR SE CREA UNO CON TODOS LOS ATRIBUTOS
         */
        if (!flag) {
            let nodo: Nodo = new Nodo();
            nodo.codigo = [];
            nodo.codigo.push(";#############################");
            nodo.codigo.push(";########CONSTRUCTOR " + this.nombre);
            nodo.codigo.push(";#############################");
            nodo.codigo.push("proc constructor_" + this.nombre + "_ " + "{");

            entorno.listaSimbolos.forEach(s => {
                //--------------------------- SIGNIFICA QUE ES UNA VARIABLE ESTATICA ---------------------------------------------
                let atributos: Object = s.atributo;
                let isStatic: Boolean = atributos['isStatic'] as Boolean;
                if (!isStatic) {
                    if (s.localizacion == Localizacion.STACK) nodo.codigo.push(Auxiliar.crearLinea("Stack[" + s.posAbsoluta + "] = 0", "iniciando variable: " + s.id));
                    else {
                        let pos: String = Auxiliar.generarTemporal();
                        nodo.codigo.push(Auxiliar.crearLinea(pos + " = P + 0", "Obtenemos la posicion de referencia this"));
                        nodo.codigo.push(Auxiliar.crearLinea(pos + " = " + pos + " + " + s.posRelativa, "Nos movemos hacia la variable que necesitamos"));
                        nodo.codigo.push(Auxiliar.crearLinea("Heap[" + pos + "] = 0", "Iniciando variable: " + s.id));
                    }
                }

                s.isNull = false;
            });
            nodo.codigo.push("}");
            salida.codigo = salida.codigo.concat(nodo.codigo);
            this.constructores.push(this.nombre + "_");
        }


        let nodo: Nodo = new Nodo([]);

        this.instrucciones.forEach(element => {
            if (element instanceof FuncionOLCEV) {
                let resultado: Object = element.ejecutar(entorno);
                if (resultado instanceof MensajeError) return resultado;
                let temp: Nodo = resultado as Nodo;
                nodo.codigo = nodo.codigo.concat(temp.codigo);
            }
        });

        salida.codigo = nodo.codigo.concat(salida.codigo);
        this.entorno = entorno;
        agregarClase(this);
        return salida;
    }

    /**
     * METODO QUE BUSCA UN CONSTRUCTOR
     * EN EL LISTADO DE CONSTRUCTORES
     * @param id 
     */
    buscarConstructor(id: String): Boolean {
        for (let i = 0; i < this.constructores.length; i++) {
            if (this.constructores[i] === id) return true;
        }
        return false;
    }
}