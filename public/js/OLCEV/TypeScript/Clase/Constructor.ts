class Constructor implements Instruccion {
    id: String;
    parametros: Array<Parametro>;
    instrucciones: Array<Instruccion>;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id Nombre del constructor
     * @param parametros lista de parametros
     * @param instrucciones lista de instrucciones
     * @param l linea de la instruccion
     * @param c columna de la instruccion
     */
    constructor(id: String, parametros: Array<Parametro>, instrucciones: Array<Instruccion>, l: number, c: number) {
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno Actual
     */
    ejecutar(entorno: Entorno): Object {
        if (entorno.clase !== this.id) {
            let mensaje: MensajeError = new MensajeError("Semantico", "El nombre de la clase es: " + entorno.clase + " y el del constructor es: " + this.id, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let salida: Nodo = new Nodo();
        salida.codigo = [];
        salida.codigo.push(";#############################");
        salida.codigo.push(";########CONSTRUCTOR " + this.id);
        salida.codigo.push(";#############################");
        salida.codigo.push("proc constructor_" + this.id + "{");



        this.instrucciones.forEach(element => {
            let resultado: Object = element.ejecutar(entorno);
            if (!(resultado instanceof MensajeError)) {
                let nodo: Nodo = resultado as Nodo;
                salida.codigo = salida.codigo.concat(nodo.codigo);
            }
        });


        salida.codigo.push("}");
        return salida;
    }

    /**
     * Se encargara de verificar cuantas declaraciones tiene el constructor
     * @param entorno Entorno actual
     */
    primeraPasada(entorno: Entorno): Object {
        let i:number = 1; //--------------------------- THIS --------------------------------------------
        this.instrucciones.forEach(element => {
           let x:number = + element.primeraPasada(entorno);
           i += x;
        });
        entorno.tamaño = i + this.parametros.length;
        return entorno.tamaño;
    }


}