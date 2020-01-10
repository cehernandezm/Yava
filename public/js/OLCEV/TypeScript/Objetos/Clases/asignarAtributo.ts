declare function getClase(id:any):any;
class asignarAtributo implements Instruccion{
    
    objeto:Instruccion;
    id:String;
    expresion:Instruccion;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto 
     * @param id 
     * @param l 
     * @param c 
     */
    constructor(objeto:Instruccion,id:String,expresion:Instruccion,l:number,c:number){
        this.objeto = objeto;
        this.id = id;
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
        
        let resultado:Object = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;

        let nodoExpresion:Nodo = resultado as Nodo;

        salida.codigo = salida.codigo.concat(nodoExpresion.codigo);
        if(nodoExpresion.tipo === Tipo.BOOLEAN) nodoExpresion = Aritmetica.arreglarBoolean(nodoExpresion,salida);


        resultado= this.objeto.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodo:Nodo = resultado as Nodo;

        salida.codigo = salida.codigo.concat(nodo.codigo);

        if(nodo.tipo === Tipo.ID){
            let identificador:String = nodo.id;
            let clase:Clase = getClase(identificador);
            
            if(clase === null){
                let mensaje:MensajeError = new MensajeError("Semantico","No existe la clase: " + identificador,entorno.archivo,this.l,this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }

            let entornoTemp:Entorno = clase.entorno;
            let simbolo:Simbolo = entornoTemp.buscarSimbolo(this.id);
            if(simbolo === null){
                let mensaje:MensajeError = new MensajeError("Semantico","No existe el atributo: " + this.id + " en la clase: " + nodo.id,entorno.archivo,this.l,this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }

            let atributos:Object = simbolo.atributo;
            let visibilidad:Visibilidad = atributos['visibilidad'] as Visibilidad;
            if(visibilidad !== Visibilidad.PUBLIC){
                let mensaje:MensajeError = new MensajeError("Semantico","El atributo: " + this.id + " tiene una visibilidad: " + Visibilidad[visibilidad],entorno.archivo,this.l,this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            
            let posicion:String = Auxiliar.generarTemporal();
            let posicionHeap:String = Auxiliar.generarTemporal();
            
            if(!(Asignacion.casteoImplicito(simbolo.tipo,nodoExpresion.tipo))){
                let mensaje:MensajeError = new MensajeError("Semantico","No se le puede asignar el valor: " + Tipo[nodoExpresion.tipo] + " al atributo de tipo: " + Tipo[simbolo.tipo],entorno.archivo,this.l,this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            let saltoError:String = Auxiliar.generarEtiqueta();
            let salto:String = Auxiliar.generarEtiqueta();
            salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(nodo.resultado + " == 0",saltoError),"Verificar si es null atributo"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + nodo.resultado,"Posicion del objeto"));
            salida.codigo.push(Auxiliar.crearLinea(posicionHeap + " = " + posicion + " + " + simbolo.posRelativa,"Nos movemos a la posicion del atributo"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[" + posicionHeap + "] = " + nodoExpresion.resultado ,"Almacenamos el valor en el atributo: " + simbolo.id))
            salida.codigo.push(Auxiliar.saltoIncondicional(salto));
            salida.codigo.push(saltoError + ":");
            salida.codigo.push("exit(2)");
            salida.codigo.push(salto + ":");

            
        }
        else{
            let mensaje:MensajeError = new MensajeError("Semantico","No se puede acceder a un atributo de un tipo: " + Tipo[nodo.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

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