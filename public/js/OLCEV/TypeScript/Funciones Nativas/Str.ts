class Str implements Instruccion{
   
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



    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);
        let resultado:Object = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;

        let nodo:Nodo = resultado as Nodo;

        salida.codigo = salida.codigo.concat(nodo.codigo);

        if(nodo.tipo === Tipo.STRING) return salida;
        else if(nodo.tipo === Tipo.INT || nodo.tipo === Tipo.DOUBLE || nodo.tipo === Tipo.CHAR || nodo.tipo === Tipo.BOOLEAN){
            salida.tipo = Tipo.STRING;
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(";############################### CAST TO STRING ######################");
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = H + 0","Inicio de la nueva cadena"));
            salida.codigo = salida.codigo.concat(Aritmetica.concatenar(nodo.resultado,nodo.tipo,entorno,nodo).codigo);
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0","Fin de la cadena"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));
            salida.resultado = temporal;
        }

        return salida;



        return salida;
    }

    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return null;
    }
}