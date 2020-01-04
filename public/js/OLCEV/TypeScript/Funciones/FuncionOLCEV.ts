class FuncionOLCEV extends Valor implements Instruccion {

    id: String;
    modificadores: Array<Modificador>;
    dimensiones: number;
    tipo: Tipo;
    valor: Object;
    tamaño: number = 0;
    cuerpo: Array<Instruccion>;
    parametros: Array<Instruccion>;
    atributos: Object;
    l: number;
    c: number;
    override: number;
    identificador: String;
    objeto:String;

    constructor(id: String, modificadores: Array<Modificador>, dimensiones: number, tipo: Tipo, valor: Object, cuerpo: Array<Instruccion>, parametros: Array<Instruccion>, l: number, c: number, override: number) {
        super(tipo, valor);
        this.id = id;
        this.modificadores = modificadores;
        this.dimensiones = dimensiones;
        this.cuerpo = cuerpo;
        this.parametros = parametros;
        this.l = l;
        this.c = c;
        this.override = override;
    }


    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);
        if (this.dimensiones > 0) {
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(this.tipo, this.dimensiones);
        }
        salida.codigo.push(";##########################################################################");
        salida.codigo.push(";################################# METODO " + this.id + " ######################");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push("proc " + this.identificador + "{");
        let nuevo: Entorno = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        nuevo.tamaño = this.tamaño;
        nuevo.posRelativaStack = 1;

        this.parametros.forEach(element => {
            let d: Declaracion = element as Declaracion;
            d.parametro = true;
            let resultado: Object = d.ejecutar(nuevo);
            if (resultado instanceof MensajeError) return resultado;
            
            let s: Simbolo = nuevo.buscarSimbolo(d.id);
            s.isNull = false;
        });

        this.cuerpo.forEach(element => {
            let resultado: Object = element.ejecutar(nuevo);
            if (resultado instanceof MensajeError) return resultado;
            let nodo: Nodo = resultado as Nodo;
            salida.retornos = salida.retornos.concat(nodo.retornos);
            salida.codigo = salida.codigo.concat(nodo.codigo);

            if (nodo.retornos.length > 0 && this.tipo !== Tipo.VOID) {
                if (salida.tipo === Tipo.ARREGLO && nodo.tipo === Tipo.ARREGLO) {
                    let arreglo2: Arreglo = nodo.valor as Arreglo;

                    if (this.tipo != arreglo2.tipo) {
                        let mensaje: MensajeError = new MensajeError("Semantico", "La funcion: " + this.id + " su arreglo es de tipo " + Tipo[this.tipo] + " y se esta retornando un arreglo de tipo valor: " + Tipo[arreglo2.tipo], entorno.archivo, this.l, this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }

                    if(this.dimensiones !== +arreglo2.valor){
                        let mensaje: MensajeError = new MensajeError("Semantico", "La funcion: " + this.id + " su arreglo tiene " + this.dimensiones + " dimensiones y se esta retornando un arreglo de : " + arreglo2.valor + " dimensiones", entorno.archivo, this.l, this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }
                }
                else if (!(Asignacion.casteoImplicito(this.tipo, nodo.tipo))) {
                    let mensaje: MensajeError = new MensajeError("Semantico", "La funcion: " + this.id + " es de tipo " + Tipo[this.tipo] + " y se esta retornando una valor: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }
            }
        });

        if (salida.retornos.length > 0 && this.tipo === Tipo.VOID) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion: " + this.id + " es de tipo VOID no puede retornar ningun valor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        if (salida.retornos.length < 1 && this.tipo !== Tipo.VOID) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion: " + this.id + " tiene que retornar un valor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo.push(";###################### ETIQUETAS DE RETORNO: ############################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.retornos).codigo);

        salida.codigo.push("}");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push(";########################## FIN METODO " + this.id + " ################");
        salida.codigo.push(";##########################################################################");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        salida.codigo.push("\n");

        if (this.dimensiones > 0) {
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(this.tipo, this.dimensiones);
        } else {
            salida.tipo = this.tipo;
            salida.valor = this.valor;
        }
        salida.id = this.valor.toString();
        this.objeto = this.valor.toString();
        return salida;
    }


    /**
     * RETORNAMOS EL TAMAÑO DE NUESTRO METODO
     * RETORNAMOS UN 0 YA QUE LAS FUNCIONES
     * SE EJECUTARAN EN UN ENTORNO DIFERENTE 
     * AL ENTORNO PRINCIPAL
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        /**
         * SI ES VOID EMPIEZA EN 1 RESERVANDO EL 0 PARA EL THIS
         * SI ES DIFERENTE A VOID EMPIEZA EN 2 RESERVANDO EL 0 PARA EL THIS Y LA ULTIMA POSICION PARA 
         * EL RETURN
         */
        let i: number = (this.tipo === Tipo.VOID) ? 1 : 2;
        i += this.parametros.length; // Apartamos el lugar para los parametros
        this.cuerpo.forEach(element => {
            let x: number = +element.primeraPasada(entorno);
            i += x;
        });
        this.tamaño = i; // Almacenamos el valor del entorno de la funcion



        let visibilidad = null;
        let isStatic: Boolean = false;
        let isAbstract: Boolean = false;
        let isFinal: Boolean = false;

        /**
         * VERIFICAMOS QUE NO TENGA MODIFICADORES DE MAS
         * Y QUE VENGAN SOLO UNA VEZ
         */
        if (this.modificadores != null) {
            this.modificadores.forEach(element => {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya es Static", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya es Final", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La funcion ya es Abstract", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return 0;
                        }
                        isAbstract = true;
                        break;
                }

            });
        }
        if (visibilidad == null) visibilidad = Modificador.PUBLIC;

        this.atributos = Auxiliar.crearObjectoAtributos(visibilidad, isFinal, isStatic, isAbstract);


        this.construirIdentificador();
        entorno.metodos.push(this); //------------------ AGREGAMOS LA FUNCION A LA LISTA DE METODOS
        return 0;
    }


    /**
     * CONSTRUIMOS EL IDENTIFICADOR DE LA FUNCION
     * ESTE METODO FALLARA SI EN LOS OBJETOS PASAMOS
     * PARAMETROS NULL
     */
    construirIdentificador() {
        let temp: String = this.id + "_";
        this.parametros.forEach(element => {
            let d: Declaracion = element as Declaracion;
            if(d.dimensiones > 0) temp += Tipo[Tipo.ARREGLO] + "_";
            else temp += Tipo[d.tipo] + "_";
        });

        this.identificador = temp;
    }


}