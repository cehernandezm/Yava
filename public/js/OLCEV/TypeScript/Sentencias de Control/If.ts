class If implements Instruccion {

    condicion: Instruccion;
    cuerpo: Array<Instruccion>;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param condicion 
     * @param cuerpo 
     * @param l 
     * @param c 
     */
    constructor(condicion: Instruccion, cuerpo: Array<Instruccion>, l: number, c: number) {
        this.condicion = condicion;
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
        let v = [];
        let f = []:
        if (this.condicion != null) {
            let resultado: Object = this.condicion.ejecutar(entorno);
            if (resultado instanceof MensajeError) return resultado;

            let nodo: Nodo = resultado as Nodo;
            if (nodo.tipo != Tipo.BOOLEAN) {
                let mensaje: MensajeError = new MensajeError("Semantico", "Las condiciones tienen que ser de tipo Boolean, no se reconoce el tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }

            salida.codigo = salida.codigo.concat(nodo.codigo);
            nodo = Logica.arreglarBoolean(nodo, salida);
            v = nodo.verdaderas;
            f = nodo.falsas;
        }

        salida.codigo.push(";######################## VERDADERAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(v).codigo);

        this.cuerpo.forEach(element => {
            let result = element.ejecutar(nuevo);
            if (result instanceof MensajeError) return result;
            let temp: Nodo = result as Nodo;
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            salida.continue = salida.continue.concat(temp.continue);
        });

        if (this.condicion != null) {
            let salto: String = Auxiliar.generarEtiqueta();
            salida.codigo.push(Auxiliar.saltoIncondicional(salto));
            salida.saltos.push(salto);
        }

        salida.codigo.push(";######################## FALSAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(f).codigo);

        return salida;
    }

    /**
     * PRIMERA PASADO
     * PASAMOS OBTENIENDO EL TAMAÑO DEL IF
     * @param entorno ENTORNO ACTUAL
     */
    primeraPasada(entorno: Entorno): Object {
        let i: number = 0;
        this.cuerpo.forEach(element => {
            let x: number = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    }
}