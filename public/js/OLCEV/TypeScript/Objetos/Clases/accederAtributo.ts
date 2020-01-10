declare function getClase(id:any):any;
class accederAtributo implements Instruccion{
    
    objeto:Instruccion;
    id:String;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto 
     * @param id 
     * @param l 
     * @param c 
     */
    constructor(objeto:Instruccion,id:String,l:number,c:number){
        this.objeto = objeto;
        this.id = id;
        this.l = l;
        this.c = c;
    }
    
    
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);

        let resultado:Object = this.objeto.ejecutar(entorno);
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
            let temporal:String = Auxiliar.generarTemporal();
            let saltoError:String = Auxiliar.generarEtiqueta();
            let salto:String = Auxiliar.generarEtiqueta();
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + nodo.resultado,"Posicion del objeto"));
            salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(nodo.resultado + " == 0",saltoError),"Verificar si es null atributo"));
            salida.codigo.push(Auxiliar.crearLinea(posicionHeap + " = " + posicion + " + " + simbolo.posRelativa,"Nos movemos a la posicion del atributo"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Heap[" + posicionHeap + "]","Obtenemos el valor del atributo: " + simbolo.id));
            salida.codigo.push(Auxiliar.saltoIncondicional(salto));
            salida.codigo.push(saltoError + ":");
            salida.codigo.push("exit(2)");
            salida.codigo.push(salto + ":");
            salida.tipo = simbolo.tipo;
            salida.atributos = simbolo.atributo;
            salida.verdaderas = simbolo.verdaderas;
            salida.falsas  = simbolo.falsas;
            salida.resultado = temporal;
            salida.valor = simbolo.valor;
            salida.id = simbolo.objeto;
            salida.posicion = posicionHeap;

            if (simbolo.tipo === Tipo.ARREGLO) {
                let simArreglo: Arreglo = simbolo.valor as Arreglo;
                salida.valor = new Arreglo(simArreglo.tipo, simbolo.dimensiones);
            }
        }
        else if(nodo.tipo === Tipo.CLASE){
            let clase:Clase = getClase(nodo.id);
            if(clase === null){
                let mensaje:MensajeError = new MensajeError("Semantico","No existe la clase: " + nodo.id,entorno.archivo,this.l,this.c);
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

            let isStatic:Boolean = atributos['isStatic'] as Boolean;
            if(!isStatic){
                let mensaje:MensajeError = new MensajeError("Semantico","El atributo: " + this.id + " tiene que ser static ",entorno.archivo,this.l,this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            
            let temporal:String = Auxiliar.generarTemporal();
            
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + simbolo.posAbsoluta + "]","Obtenemos el valor del atributo: " + simbolo.id));

            salida.tipo = simbolo.tipo;
            salida.atributos = simbolo.atributo;
            salida.verdaderas = simbolo.verdaderas;
            salida.falsas  = simbolo.falsas;
            salida.resultado = temporal;
            salida.valor = simbolo.valor;
            salida.id = simbolo.objeto;
            salida.posicion = simbolo.posAbsoluta.toString();
            
            

            if (simbolo.tipo === Tipo.ARREGLO) {
                let simArreglo: Arreglo = simbolo.valor as Arreglo;
                salida.valor = new Arreglo(simArreglo.tipo, simbolo.dimensiones);
            }
            
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