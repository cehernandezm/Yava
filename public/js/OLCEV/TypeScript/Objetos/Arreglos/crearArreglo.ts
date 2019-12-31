class crearArreglo extends Valor implements Instruccion {
    tipo: Tipo;
    valor: Object;
    dimensiones: Array<Instruccion>;
    l: number;
    c: number;

    constructor(tipo: Tipo, valor: Object, dimensiones: Array<Instruccion>, l: number, c: number) {
        super(tipo, valor);
        this.dimensiones = dimensiones;
        this.l = l;
        this.c = c;
    }

    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);
        let temporalPosicion: String = Auxiliar.generarTemporal();
        let contador: String = Auxiliar.generarTemporal();
        let cantidadRepeticiones: String = Auxiliar.generarTemporal();
        let tamHijos: String = Auxiliar.generarTemporal();
        let posDinamica: String = Auxiliar.generarTemporal();

        salida.codigo.push(";###################################### INICIALIZANDO ARREGLO ###############################");
        salida.codigo.push(Auxiliar.crearLinea(temporalPosicion + " = H + 0", "Posicion de inicio del arreglo"));
        salida.codigo.push(contador + " = 0");

        let resultado: Object = this.dimensiones[0].ejecutar(entorno);
        if (resultado instanceof MensajeError) return resultado;

        let dimension0: Nodo = resultado as Nodo;
        if (dimension0.tipo != Tipo.INT) {
            let mensaje: MensajeError = new MensajeError("Semantico", "Las dimensiones tienen que ser enteros", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let falsa: String = Auxiliar.generarEtiqueta();
        let salto: String = Auxiliar.generarEtiqueta();
        let limite: String = Auxiliar.generarTemporal();
        salida.codigo = salida.codigo.concat(dimension0.codigo);
        salida.codigo.push(Auxiliar.crearLinea(limite + " = " + dimension0.resultado + " - 1", "Calculamos su limite"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + dimension0.resultado, "Almacenamos su tamanio"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + limite, "Almacenamos su limite"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(salto + ":");
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(contador + " >= " + dimension0.resultado, falsa), ""));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "valor inicial de la dimension 0"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea(contador + " = " + contador + " + 1", "Aumentamos el contador"));
        salida.codigo.push(Auxiliar.saltoIncondicional(salto));
        salida.codigo.push(falsa + ":");

        salida.codigo.push(cantidadRepeticiones + " = 1");
        salida.codigo.push(Auxiliar.crearLinea(tamHijos + " = " + dimension0.resultado, "Almacenamos cuantos nodos hijos tendra esta dimension"));
        salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + temporalPosicion + " + 2", "Nos movemos el espacio de su tamanio y su limite"));

        for (let i = 1; i < this.dimensiones.length; i++) {
            let fori: String = Auxiliar.generarTemporal();
            let falsai: String = Auxiliar.generarEtiqueta();
            let saltoi: String = Auxiliar.generarEtiqueta();

            let forh: String = Auxiliar.generarTemporal();
            let falsah: String = Auxiliar.generarEtiqueta();
            let saltoh: String = Auxiliar.generarEtiqueta();

            
            resultado = this.dimensiones[i].ejecutar(entorno);
            if (resultado instanceof MensajeError) return resultado;
            let di: Nodo = resultado as Nodo;
            if (di.tipo != Tipo.INT) {
                let mensaje: MensajeError = new MensajeError("Semantico", "Las dimensiones tienen que ser enteros", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }

            let limdi: String = Auxiliar.generarTemporal();
            let forb:String = Auxiliar.generarTemporal();
            let falsab:String = Auxiliar.generarEtiqueta();
            let saltob:String = Auxiliar.generarEtiqueta();
            let posActual: String = Auxiliar.generarTemporal();

            salida.codigo.push(";################################### FOR QUE RECORRE LOS HIJOS DEL ARREGLO ########################");
            salida.codigo.push(fori + " = 0");
            salida.codigo.push(saltoi + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(fori + " >= " + cantidadRepeticiones, falsai));

            salida.codigo.push(";###################### FOR QUE SE ENCARGARA DE RELACION EL PADRE CON SUS HIJOS #####################");
            salida.codigo.push(forh + " = 0");
            salida.codigo.push(saltoh + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(forh + " >= " + tamHijos, falsah));
            salida.codigo.push(posActual + "= H + 0");

            salida.codigo = salida.codigo.concat(di.codigo);
            
            
            

            salida.codigo.push(Auxiliar.crearLinea(limdi + " = " + di.resultado + " - 1", "Calculamos el limite de la dimension"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + di.resultado, "Almacenamos su tamanio"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + limdi, "Almacenamos su limite"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));

            salida.codigo.push(";##################################### FOR QUE INICIALIZARA LOS VALORES ###########################");
            salida.codigo.push(forb + " = 0");
            salida.codigo.push(saltob + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(forb + " >= " + di.resultado,falsab));
            salida.codigo.push("Heap[H] = 0");
            salida.codigo.push("H = H + 1");
            salida.codigo.push(forb + "  = " + forb + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltob));
            salida.codigo.push(falsab + ":");
            salida.codigo.push(";##################################### FIN FOR QUE INICIALIZARA LOS VALORES ###########################");


            salida.codigo.push("Heap[" + posDinamica + "] = " + posActual);
            salida.codigo.push(posDinamica + " = " + posDinamica + " + 1");
            salida.codigo.push(forh + " = " + forh + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltoh));
            salida.codigo.push(falsah + ":");
            salida.codigo.push(";###################### FIN FOR QUE SE ENCARGARA DE RELACION EL PADRE CON SUS HIJOS #####################");

            salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + posDinamica + " + 2","Nos movemos 2 espacios (tamanio y limite)"));
            salida.codigo.push(fori + " = " + fori + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltoi));
            salida.codigo.push(falsai + ":");

            salida.codigo.push(tamHijos + " = " + di.resultado);
            salida.codigo.push(cantidadRepeticiones + " = " + cantidadRepeticiones + " * " + tamHijos);
            salida.codigo.push(";################################### FIN FOR QUE RECORRE LOS HIJOS DEL ARREGLO ########################");

        }

        salida.tipo = Tipo.ARREGLO;
        salida.resultado = temporalPosicion;
        salida.valor = new Arreglo(this.tipo, this.dimensiones.length);
        return salida;
    }
    /**
     * ESTA CLASE NO POSEE UNA PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}