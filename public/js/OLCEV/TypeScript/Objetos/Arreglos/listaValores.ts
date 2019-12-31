class listaValores implements Instruccion {

    lista: Array<Instruccion>;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista 
     * @param l 
     * @param c 
     */
    constructor(lista: Array<Instruccion>, l: number, c: number) {
        this.lista = lista;
        this.l = l;
        this.c = c;
    }






    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);
        let tipo: Tipo = null;
        let tipoArreglo: Tipo = null;
        let dimensiones: number = 1;
        let temporal: String = Auxiliar.generarTemporal();
        let posiciones: Array<String> = [];


        this.lista.forEach(element => {
            let resultado: Object = element.ejecutar(entorno);
            if (resultado instanceof MensajeError) return resultado;
            let nodo: Nodo = resultado as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN) nodo = Logica.arreglarBoolean(nodo, salida);
            if (tipo === null) {
                if (nodo.tipo === Tipo.ARREGLO) {
                    tipo = Tipo.ARREGLO;
                    let arreglo: Arreglo = nodo.valor as Arreglo;
                    tipoArreglo = arreglo.tipo;
                    dimensiones += +arreglo.valor;
                }
                else tipo = nodo.tipo;
            }
            else {
                if (tipo === Tipo.ARREGLO && nodo.tipo === Tipo.ARREGLO) {
                    let arreglo: Arreglo = nodo.valor as Arreglo;
                    if (tipoArreglo !== arreglo.tipo) {
                        let mensaje: MensajeError = new MensajeError("Semantico", "El arreglo es de tipo: " + Tipo[tipoArreglo] + " y se quiere agregar un arreglo de tipo: " + Tipo[arreglo.tipo], entorno.archivo, this.l, this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }
                }
                else if (tipo !== nodo.tipo) {
                    let mensaje: MensajeError = new MensajeError("Semantico", "Los valores del arreglo son de tipo: " + Tipo[tipo] + " y se quiere agregar un valor de tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }
            }
            posiciones.push(nodo.resultado);
        });

        if (tipo === Tipo.ARREGLO) tipo = tipoArreglo;

        salida.codigo.push(Auxiliar.crearLinea(temporal + " = H", "Guardamos la referencia del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + this.lista.length, "Almacenamos el tamanio del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + (this.lista.length - 1), "Almacenamos el limite del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));

        posiciones.forEach(element => {
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + element, "Guardamos el valor en el arreglo"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        });






        salida.resultado = temporal;
        salida.tipo = Tipo.ARREGLO;
        salida.valor = new Arreglo(tipo, dimensiones);

        return salida;

    }

    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}