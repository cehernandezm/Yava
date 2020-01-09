class For implements Instruccion {
    declaracion: Array<Instruccion>;
    condicion: Instruccion;
    asignacion: Instruccion;
    cuerpo: Array<Instruccion>
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASEs
     * @param declaracion 
     * @param condicion 
     * @param asignacion 
     * @param cuerpo 
     * @param l 
     * @param c 
     */
    constructor(declaracion: Array<Instruccion>, condicion: Instruccion, asignacion: Instruccion, cuerpo: Array<Instruccion>, l: number, c: number) {
        this.declaracion = declaracion;
        this.condicion = condicion;
        this.asignacion = asignacion;
        this.cuerpo = cuerpo;
        this.l = l;
        this.c = c;
    }


    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let nuevo: Entorno = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        let salida: Nodo = new Nodo([]);

        salida.codigo.push(";####################### DECLARACION FOR #########################");
        this.declaracion.forEach(element => {
            let resultado: Object = element.ejecutar(nuevo);
            if (resultado instanceof MensajeError) return resultado;
            let nodoDeclaracion: Nodo = resultado as Nodo;


            salida.codigo = salida.codigo.concat(nodoDeclaracion.codigo);
        });


        let resultado:Object = this.condicion.ejecutar(nuevo);
        if (resultado instanceof MensajeError) return resultado;
        let nodoCondicion: Nodo = resultado as Nodo;
        let salto: String = Auxiliar.generarEtiqueta();

        salida.codigo.push(";##################### CONDICION FOR #####################");
        salida.codigo.push(Auxiliar.crearLinea(salto + ":", "Recursividad"));
        salida.codigo = salida.codigo.concat(nodoCondicion.codigo);
        nodoCondicion = Logica.arreglarBoolean(nodoCondicion, salida);

        if (nodoCondicion.tipo != Tipo.BOOLEAN) {
            let mensaje: MensajeError = new MensajeError("Semantico", "For necesita una condicion booleana no se reconoce: " + Tipo[nodoCondicion.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }


        resultado = this.asignacion.ejecutar(nuevo);
        if (resultado instanceof MensajeError) return resultado;
        let nodoAsignacion: Nodo = resultado as Nodo;

        salida.codigo.push(";#################################### VERDADERO FOR ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.verdaderas).codigo);

        this.cuerpo.forEach(element => {
            let result: Object = element.ejecutar(nuevo);
            if (result instanceof MensajeError) return result;
            let nodo: Nodo = result as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.continue = salida.continue.concat(nodo.continue);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.retornos = salida.retornos.concat(nodo.retornos);
            if(nodo.retornos.length > 0){
                salida.tipo = nodo.tipo;
                salida.valor = nodo.valor;
            }
        });


        salida.codigo.push(";#################################### CONTINUE | SALTO  ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.continue).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.saltos).codigo);
        salida.codigo = salida.codigo.concat(nodoAsignacion.codigo);
        salida.codigo.push(Auxiliar.saltoIncondicional(salto));

        salida.codigo.push(";#################################### FALSAS | BREAK ##################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.falsas).codigo);
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.breaks).codigo);

        salida.saltos = [];
        salida.breaks = [];
        salida.continue = [];

        return salida;
    }


    /**
     * DEVUELVE SU TAMAÑO
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        let i: number = 1; // por la declaracion inicial empieza en 1
        this.cuerpo.forEach(element => {
            let x: number = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    }


}