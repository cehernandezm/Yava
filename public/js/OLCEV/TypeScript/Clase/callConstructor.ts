declare function getClase(id: any): any;
class callConstructor implements Instruccion {
    id: String;
    parametros: Array<Instruccion>
    l: number;
    c: number;

    /**
     * CONTRUCTOR DE LA CLASE
     * @param id 
     * @param parametros 
     * @param l 
     * @param c 
     */
    constructor(id: String, parametros: Array<Instruccion>, l: number, c: number) {
        this.id = id;
        this.parametros = parametros;
        this.l = l;
        this.c = c;
    }


    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);
        let clase: Clase = getClase(this.id);
        let valores: Array<Nodo> = [];
        if (clase == null) {
            let mensaje: MensajeError = new MensajeError("Semantico", "No existe la clase: " + this.id, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        

        this.parametros.forEach(element => {
            let result: Object = element.ejecutar(entorno);
            if (result instanceof MensajeError) return result;
            let nodo: Nodo = result as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN) nodo = Aritmetica.arreglarBoolean(nodo, salida);
            valores.push(nodo);
        });

        let identificador: String = this.construirIdentificador(valores);
        let resultado: Boolean = clase.buscarConstructor(identificador);
        if (!resultado) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La clase no posee este tipo de constructor", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let temporal: String = Auxiliar.generarTemporal();
        let posicion: String = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = H", "Inicio del Objeto"));
        salida.codigo.push(Auxiliar.crearLinea("H = H +" + (clase.tamaño + 1), "Apartamos el espacio de los atributos"));
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion del this"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal, "This tendra el valor del inicio del Objeto"));

        let index: number = 1;
        valores.forEach(element => {
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + index, "Parametro: " + index));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Seteamos el parametro: " + index));
        });

        salida.codigo.push("call constructor_" + identificador);
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin Simulacion de cambio de ambito"));


        salida.tipo = Tipo.ID;
        salida.resultado = temporal;
        salida.id = this.id;
        return salida;
    }


    /**
     * METODO QUE CREA UN IDENTIFICADOR
     * PARA EL CONSTRUCTOR A LLAMAR
     */
    construirIdentificador(valores:Array<Nodo>):String{
        let identificador:String = this.id + "_";
        valores.forEach(element => {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    }


    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}