class super_sentece implements Instruccion {

    parametros: Array<Instruccion>;
    l: number;
    c: number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param parametros 
     * @param l 
     * @param c 
     */
    constructor(parametros: Array<Instruccion>, l: number, c: number) {
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
        let valores: Array<Nodo> = [];
        if (entorno.extendida === null) {
            let mensaje: MensajeError = new MensajeError("Semantico", "Esta clase no esta extendiendo a ninguna otra", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        this.parametros.forEach(element => {
            let resultado: Object = element.ejecutar(entorno);
            if (resultado instanceof MensajeError) return resultado;
            let nodo: Nodo = resultado as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN) nodo = Aritmetica.arreglarBoolean(nodo, salida);
            valores.push(nodo);

        });

        let identificador: String = this.construirIdentificador(valores, entorno.extendida.nombre);
        let encontrado: Boolean = entorno.extendida.buscarConstructor(identificador);
        if (!encontrado) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La clase: " + entorno.extendida.nombre + " no tiene ninguna constructor: " + identificador, entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let posicion: String = Auxiliar.generarTemporal();
        let valor: String = Auxiliar.generarTemporal();

        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(valor + " = Stack[" + posicion + "]");
        salida.codigo.push("P = P + " + entorno.tamaño);
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + valor, "Pasamos la referencia del this actual"));
        let index: number = 1; //----- Empezamos en 1 porque el this ocupa la posicion 0
        valores.forEach(element => {
            salida.codigo.push(posicion + " = P + " + index);
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Seteamos los parametros"));
            index++;
        });
        salida.codigo.push("call constructor_" + identificador);
        salida.codigo.push("P = P - " + entorno.tamaño);

        return salida;
    }


    /**
     * METODO QUE CREA UN IDENTIFICADOR
     * PARA EL CONSTRUCTOR A LLAMAR
     */
    construirIdentificador(valores: Array<Nodo>, id: String): String {
        let identificador: String = id + "_";
        valores.forEach(element => {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    }


    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}