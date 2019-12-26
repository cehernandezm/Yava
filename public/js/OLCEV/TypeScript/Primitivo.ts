class Primitivo extends Valor implements Instruccion{
    
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param tipo TIPO DE PRIMITIVO
     * @param valor VALOR DEL PRIMITIVO
     * @param l LINEA DE LA INSTRUCCION
     * @param c COLUMNA DE LA INSTRUCCION
     */
    constructor(tipo:Tipo,valor:Object,l:number,c:number){
        super(tipo,valor);
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno:Entorno){
        switch(this.tipo){
            case Tipo.INT : 
            case Tipo.DOUBLE:
            return new Nodo([],this.valor.toString(),this.tipo,"");
            
            case Tipo.CHAR:
            let ascii:any = this.valor.toString().charCodeAt(1);
            return new Nodo([],ascii,this.tipo,"") 

            case Tipo.STRING:
                return this.setearCadena(this.valor.toString());
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
    setearCadena(cadena:String):Nodo{
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];
        nodo.tipo = Tipo.STRING;
        cadena = cadena.substring(1,cadena.length - 1);
        let cadenaTemp = cadena;
        
        cadena = cadena.replace("\\n","\n");
        cadena = cadena.replace("\\t","\t");
        cadena = cadena.replace("\\\"","\"");
        cadena = cadena.replace("\\\'","\'");

        nodo.codigo.push(";########### GUARDANDO CADENA: " + cadenaTemp + " ############################");
        for(let i = 0; i < cadena.length; i++){
            let temporal:String = Auxiliar.generarTemporal();
            nodo.codigo.push(Auxiliar.crearLinea(temporal + " = H ",""));
            nodo.codigo.push(Auxiliar.crearLinea("Heap[" + temporal + "] = " + cadena.charCodeAt(i),"Guardamos en el Heap el caracter: " + cadena.charAt(i)));
            nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));

            if(i === 0) nodo.resultado = temporal;
        }
        nodo.codigo.push(Auxiliar.crearLinea("Heap[H] = 0","Fin de la cadena"));
        nodo.codigo.push(Auxiliar.crearLinea("H = H + 1","Aumentamos el Heap"));

        return nodo;
    }

}