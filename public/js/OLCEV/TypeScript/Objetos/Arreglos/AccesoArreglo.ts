class AccesoArreglo implements Instruccion{
    
    id:Instruccion;
    lista:Array<Instruccion>
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param lista 
     * @param l 
     * @param c 
     */
    constructor(id:Instruccion,lista:Array<Instruccion>,l:number,c:number){
        this.id = id;
        this.lista = lista;
        this.l = l;
        this.c = c;
    }
    
    
    
    
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);
        
        let resultado:Object = this.id.ejecutar(entorno);
        if(resultado instanceof MensajeError) resultado;
        let nodoID:Nodo = resultado as Nodo;

        if(nodoID.tipo != Tipo.ARREGLO){
            let mensaje:MensajeError = new MensajeError("Semantico","La variable tiene que ser de tipo ARREGLO no se reconoce: " + Tipo[nodoID.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodoID.codigo);
        let arreglo:Arreglo = nodoID.valor as Arreglo;
        resultado = AsignarArreglo.mapear(nodoID,entorno,this.lista,this.l,this.c);
        if(resultado instanceof MensajeError) return resultado;

        let acceso:Nodo = resultado as Nodo;
        salida.codigo = salida.codigo.concat(acceso.codigo); 
        let temporal:String = Auxiliar.generarTemporal();
        
        salida.tipo = acceso.tipo;
        salida.valor = acceso.valor;
        salida.id = acceso.id;
        
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + acceso.resultado  ,"Obtenemos el valor de la posicion"));
        salida.resultado = temporal;
        salida.localizacion = Localizacion.HEAP;
        salida.posicion = acceso.resultado;
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
