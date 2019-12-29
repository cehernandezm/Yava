class Logica implements Instruccion {

    izq: Instruccion;
    der: Instruccion;
    operacion: Operacion;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param izq 
     * @param der 
     * @param operacion 
     * @param l 
     * @param c 
     */
    constructor(izq: Instruccion, der: Instruccion, operacion: Operacion, l: number, c: number) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let resultado: Object = this.izq.ejecutar(entorno);
        if (resultado instanceof MensajeError) return resultado;
        let nodoIzq: Nodo = resultado as Nodo;


        resultado = (this.der == null) ? null : this.der.ejecutar(entorno);
        if (resultado instanceof MensajeError) return resultado;
        let nodoDer: Nodo = resultado as Nodo;

        let salida: Nodo = new Nodo([]);
        salida.tipo = Tipo.BOOLEAN;

        if (this.operacion === Operacion.OR) {


            if (nodoIzq.tipo != Tipo.BOOLEAN || nodoDer.tipo != Tipo.BOOLEAN) {
                let mensaje: MensajeError = new MensajeError("Semantico", "no se puede conocer el OR de: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);


            salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.falsas).codigo);
            salida.codigo = salida.codigo.concat(nodoDer.codigo);
            nodoDer = this.arreglarBoolean(nodoDer, salida);

            salida.verdaderas = nodoIzq.verdaderas;
            salida.verdaderas = salida.verdaderas.concat(nodoDer.verdaderas);
            salida.falsas = nodoDer.falsas;
            return salida;
        }
        else if (this.operacion === Operacion.AND) {


            if (nodoIzq.tipo != Tipo.BOOLEAN || nodoDer.tipo != Tipo.BOOLEAN) {
                let mensaje: MensajeError = new MensajeError("Semantico", "no se puede conocer el AND de: " + Tipo[nodoIzq.tipo] + " con: " + Tipo[nodoDer.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);


            salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoIzq.verdaderas).codigo);
            salida.codigo = salida.codigo.concat(nodoDer.codigo);
            nodoDer = this.arreglarBoolean(nodoDer, salida);

            salida.verdaderas = nodoDer.verdaderas;
            salida.falsas = nodoIzq.falsas;
            salida.falsas = salida.falsas.concat(nodoDer.falsas);
            return salida;
        }
        else{
            if (nodoIzq.tipo != Tipo.BOOLEAN) {
                let mensaje: MensajeError = new MensajeError("Semantico", "no se puede conocer la negacion de: " + Tipo[nodoIzq.tipo], entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(nodoIzq.codigo);
            nodoIzq = this.arreglarBoolean(nodoIzq, salida);
            let v:Array<String> = nodoIzq.verdaderas;
            let f:Array<String> = nodoIzq.falsas;
            
            salida.falsas = v;
            salida.verdaderas = f;
            return salida;
        }

    }

    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        throw new Error("Method not implemented.");
    }

    /**
     * METODO QUE SE ENCARGA DE CONTROLAR
     * LAS OPERACIONES BOOLEANAS
     * @param nodo 
     * @param salida 
     */
    private arreglarBoolean(nodo: Nodo, salida: Nodo): Nodo {
        if (nodo.verdaderas === null) {
            let v: String = Auxiliar.generarEtiqueta();
            let f: String = Auxiliar.generarEtiqueta();

            salida.codigo.push(Auxiliar.saltoCondicional(nodo.resultado + " == 1", v));
            salida.codigo.push(Auxiliar.saltoIncondicional(f));

            nodo.verdaderas = [v];
            nodo.falsas = [f];
        }
        return nodo;
    }
}