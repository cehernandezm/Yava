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
            
            case Tipo.BOOLEAN:
                return new Nodo([],this.valor.toString(),this.tipo,"");
            case Tipo.ID:
                let nombre:String = this.valor.toString();
                let s:Simbolo = entorno.buscarSimbolo(nombre);
                //----------------------------------------------- Si no existe la variable ----------------------------------------------------
                if(s == null){
                    let mensaje:MensajeError = new MensajeError("Semantico","La variable: " + nombre + " no existe",entorno.archivo,this.l,this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }
                let temporal:String = Auxiliar.generarTemporal();
                let nodo:Nodo = new Nodo([]);
                nodo.tipo = s.tipo;
                nodo.atributos = s.atributo;
                nodo.verdaderas = s.verdaderas;
                nodo.falsas = s.falsas;
                nodo.resultado = temporal;
                
                if(s.atributo['isStatic']){
                    nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + s.posAbsoluta + "]","Accedemos a la variable estatica " + nombre));
                    nodo.localizacion = Localizacion.STACK;
                    nodo.posicion = s.posAbsoluta.toString();
                }
                else if(s.localizacion === Localizacion.STACK){
                    let posicion:String = Auxiliar.generarTemporal();
                    nodo.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + s.posRelativa,"Accedemos a la posicion de la variable: " + nombre));
                    nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]","Obtenemos el valor de la variable: " + nombre));
                    nodo.localizacion = Localizacion.STACK;
                    nodo.posicion = posicion;
                }
                else{
                    let posicion:String = Auxiliar.generarTemporal();
                    let posHeap:String = Auxiliar.generarTemporal();
                    nodo.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0","Nos posicionamos en this"));
                    nodo.codigo.push(Auxiliar.crearLinea(posHeap + " = Stack[" + posicion + "]","Obtenemos la posicion en Heap de la referencia"));
                    nodo.codigo.push(Auxiliar.crearLinea(posHeap + " = " + posHeap + " + " + s.posRelativa,"Nos movemos a la posicion del atributo"));
                    nodo.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + posHeap + "]", "Obtenemos el valor del atributo: " + nombre));
                    nodo.localizacion = Localizacion.HEAP;
                    nodo.posicion = posHeap;

                }    
                return nodo;
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