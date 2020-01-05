class toUpperCase implements Instruccion{

    expresion:Instruccion;
    l:number;
    c:number;
    
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param expresion 
     * @param l 
     * @param c 
     */
    constructor(expresion:Instruccion,l:number,c:number){
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }

    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);

        let resultado: Object = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError) return resultado;
        let nodo: Nodo = resultado as Nodo;

        if (nodo.tipo != Tipo.STRING) {
            let mensaje: MensajeError = new MensajeError("Semantico", "No se le puede aplicar toUpperCase() al tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo = salida.codigo.concat(nodo.codigo);
        let posicion: String = Auxiliar.generarTemporal();
        let temporal: String = Auxiliar.generarTemporal();
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + nodo.resultado, "Pasamos la referencia de la cadena"));
        salida.codigo.push("call toUpperCase");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Fin simulacion de cambio de ambito"));



        salida.tipo = Tipo.STRING;
        salida.valor = "";
        salida.localizacion = Localizacion.HEAP;
        salida.resultado = temporal;
        return salida;
    }    
    
    primeraPasada(entorno: Entorno): Object {
        throw new Error("Method not implemented.");
    }


}