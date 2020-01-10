class Primitivo extends Valor implements Instruccion {

    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param tipo TIPO DE PRIMITIVO
     * @param valor VALOR DEL PRIMITIVO
     * @param l LINEA DE LA INSTRUCCION
     * @param c COLUMNA DE LA INSTRUCCION
     */
    constructor(tipo: Tipo, valor: Object, l: number, c: number) {
        super(tipo, valor);
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno) {
        switch (this.tipo) {
            case Tipo.INT:
            case Tipo.DOUBLE:
                return new Nodo([], this.valor.toString(), this.tipo, "");

            case Tipo.CHAR:
                let ascii: any = this.valor.toString().charCodeAt(1);
                return new Nodo([], ascii, this.tipo, "")

            case Tipo.STRING:
                return this.setearCadena(this.valor.toString());

            case Tipo.BOOLEAN:
                return new Nodo([], this.valor.toString(), this.tipo, "");
            case Tipo.ID:
                let nombre: String = this.valor.toString();
                let s: Simbolo = entorno.buscarSimbolo(nombre);
                //----------------------------------------------- Si no existe la variable ----------------------------------------------------
                if (s == null) {
                    let clase: Clase = getClase(this.valor.toString());
                    if (clase === null) {
                        let mensaje: MensajeError = new MensajeError("Semantico", "La variable: " + nombre + " no existe en este ambito", entorno.archivo, this.l, this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }

                    let salida: Nodo = new Nodo([]);
                    salida.tipo = Tipo.CLASE;
                    salida.id = this.valor.toString();
                    salida.valor = this.valor.toString();
                    return salida;

                }
                if (s.isNull) {
                    let mensaje: MensajeError = new MensajeError("Semantico", "La variable: " + nombre + " es null", entorno.archivo, this.l, this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }


                return Primitivo.crearNodo(s);
            case Tipo.NULL:
                return new Nodo([], "0", this.tipo, "0");
        }

    }

    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno Entorno Actual
     */
    primeraPasada(entorno: Entorno): Object {
        return null;
    }


    /**
     * METODO QUE SE ENCARGARA DE GUARDAR LA CADENA 
     * EN EL HEAP Y A SU VEZ 
     * ARREGLAR LAS SECUENCIAS DE ESCAPE
     * @param cadena cadena a transformar
     */
    setearCadena(cadena: String): Nodo {
        let nodo: Nodo = new Nodo();
        nodo.codigo = [];
        nodo.tipo = Tipo.STRING;
        cadena = cadena.substring(1, cadena.length - 1);
        let cadenaTemp = cadena;

        cadena = cadena.replace("\\n", "\n");
        cadena = cadena.replace("\\t", "\t");
        cadena = cadena.replace("\\\"", "\"");
        cadena = cadena.replace("\\\'", "\'");

        nodo.codigo.push(";########### GUARDANDO CADENA: " + cadenaTemp + " ############################");
        for (let i = 0; i < cadena.length; i++) {
            let temporal: String = Auxiliar.generarTemporal();
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = H ", ""));
            nodo.codigo.push(Auxiliar.crearLinea("Heap[" + temporal + "] = " + cadena.charCodeAt(i), "Guardamos en el Heap el caracter: " + cadena.charAt(i)));
            nodo.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));

            if (i === 0) nodo.resultado = temporal;
        }
        nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
        nodo.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));

        return nodo;
    }


    /**
     * METODO ESTATICO
     * QUE CREA UN NODO APARTIR DE 
     * UN SIMBOLO
     * @param s 
     */
    public static crearNodo(s: Simbolo): Nodo {
        let temporal: String = Auxiliar.generarTemporal();
        let nodo: Nodo = new Nodo([]);
        nodo.tipo = s.tipo;
        nodo.atributos = s.atributo;
        nodo.verdaderas = s.verdaderas;
        nodo.falsas = s.falsas;
        nodo.resultado = temporal;
        nodo.valor = s.valor;
        nodo.id = s.objeto;
        if (s.tipo === Tipo.ARREGLO) {
            let simArreglo: Arreglo = s.valor as Arreglo;
            nodo.valor = new Arreglo(simArreglo.tipo, s.dimensiones);
        }




        if (s.atributo['isStatic']) {
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + s.posAbsoluta + "]", "Accedemos a la variable estatica " + s.id));
            nodo.localizacion = Localizacion.STACK;
            nodo.posicion = s.posAbsoluta.toString();
        }
        else if (s.localizacion === Localizacion.STACK) {
            let posicion: String = Auxiliar.generarTemporal();
            nodo.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + s.posRelativa, "Accedemos a la posicion de la variable: " + s.id));
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor de la variable: " + s.id));
            nodo.localizacion = Localizacion.STACK;
            nodo.posicion = posicion;
        }
        else {
            let posicion: String = Auxiliar.generarTemporal();
            let posHeap: String = Auxiliar.generarTemporal();
            nodo.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Nos posicionamos en this"));
            nodo.codigo.push(Auxiliar.crearLinea(posHeap + " = Stack[" + posicion + "]", "Obtenemos la posicion en Heap de la referencia"));
            nodo.codigo.push(Auxiliar.crearLinea(posHeap + " = " + posHeap + " + " + s.posRelativa, "Nos movemos a la posicion del atributo"));
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + posHeap + "]", "Obtenemos el valor del atributo: " + s.id));
            nodo.localizacion = Localizacion.HEAP;
            nodo.posicion = posHeap;

        }
        if (s.tipo === Tipo.ID) {
            let saltoError: String = Auxiliar.generarEtiqueta();
            let salto: String = Auxiliar.generarEtiqueta();
            nodo.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(temporal + " == 0",saltoError),"Verificamos si es null la variable: " + s.id));
            nodo.codigo.push(Auxiliar.saltoIncondicional(salto));
            nodo.codigo.push(saltoError + ":");
            nodo.codigo.push("exit(2)");
            nodo.codigo.push(salto + ":");
        }
        return nodo;
    }

}