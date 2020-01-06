class getClass implements Instruccion{

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
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {

        let salida:Nodo = new Nodo([]);

        let resultado = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodo:Nodo = resultado as Nodo;

        salida.codigo = salida.codigo.concat(nodo.codigo);
        if(nodo.tipo !== Tipo.ID && nodo.tipo !== Tipo.ARREGLO){
            let mensaje:MensajeError = new MensajeError("Semantico","getClass no acepta este tipo de valor: " + Tipo[nodo.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        if(nodo.tipo === Tipo.ID) {
            let temp:Nodo = getClass.crearCadena(nodo.id);
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.resultado = temp.resultado;
        }
        else{
            let temp:Nodo = getClass.crearCadena("Array");
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.resultado = temp.resultado;
        }

        salida.tipo = Tipo.STRING;
        return salida;
    }    
    

    /**
     * METODO PARA CREAR UNA CADENA EN CODIGO 3D
     * @param cadena 
     */
    public static crearCadena(cadena:String):Nodo{
        let salida = new Nodo([]);
        let temporal:String = Auxiliar.generarTemporal();

        salida.codigo.push(temporal + " = H");

        for(let i = 0; i < cadena.length; i++){
            salida.codigo.push("Heap[H] = " + cadena.charCodeAt(i));
            salida.codigo.push("H = H + 1");
        }
        salida.codigo.push("Heap[H] = 0");
        salida.codigo.push("H = H + 1");

        salida.resultado = temporal;
        return salida;
    }


    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0 ;
    }


}