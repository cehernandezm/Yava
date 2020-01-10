class AsignarArreglo implements Instruccion{
    
    id:Instruccion;
    lista:Array<Instruccion>
    expresion:Instruccion;
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param lista 
     * @param expresion 
     * @param l 
     * @param c 
     */
    constructor(id:Instruccion,lista:Array<Instruccion>,expresion:Instruccion,l:number,c:number){
        this.id = id;
        this.lista = lista;
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

        
        resultado = this.expresion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let value:Nodo = resultado as Nodo;
        salida.codigo = salida.codigo.concat(value.codigo);
        if(value.tipo === Tipo.BOOLEAN) value = Aritmetica.arreglarBoolean(value,salida);


        if(!(Asignacion.casteoImplicito(arreglo.tipo,value.tipo))){
            let mensaje:MensajeError = new MensajeError("Semantico","El arreglo es de tipo: " + Tipo[arreglo.tipo] + " y se le quiere asignar un valor: " + Tipo[value.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.id = nodoID.id;

        salida.codigo.push(Auxiliar.crearLinea("Heap[" + acceso.posicion + "] = " + value.resultado,"Seteamos el valor en la posicion indicada"));
        return salida;

        
    }    


    /**
     * MAPEAMOS LAS POSICIONES PARA ACCEDER
     * AL ARREGLO
     * @param nodo 
     * @param entorno 
     * @param lista 
     * @param l 
     * @param c 
     */
    public static mapear(nodo:Nodo,entorno:Entorno,lista:Array<Instruccion>,l:number,c:number):Object{
        let arreglo:Arreglo = nodo.valor as Arreglo;
        let salida:Nodo = new Nodo([]);
        let posiciones:Array<String> = [];
        lista.forEach(element => {
            let resultado:Object = element.ejecutar(entorno);
            if(resultado instanceof MensajeError) return resultado;

            let temp:Nodo = resultado as Nodo;
            if(temp.tipo != Tipo.INT){
                let mensaje:MensajeError = new MensajeError("Semantico","los index tienen que ser de tipo INT, no se reconoce: " + Tipo[temp.tipo],entorno.archivo,l,c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(temp.codigo);
            posiciones.push(temp.resultado);
        });
        //-------------------------------------------------------- ESTOY ALMACENANDO UN VALOR PRIMITIVO --------------------------------------------------
        if(+arreglo.valor === lista.length){
            salida.tipo = arreglo.tipo;
        }
        else if(+arreglo.valor > lista.length){
            let arregloTemp:Arreglo = new Arreglo(arreglo.tipo,(+arreglo.valor - lista.length));
            salida.valor = arregloTemp;
            salida.tipo = Tipo.ARREGLO;
        }
        else{
            let mensaje:MensajeError = new MensajeError("Semantico","El arreglo es de: " + arreglo.valor + " dimensiones y se quiere acceder con: " + lista.length + " dimensiones",entorno.archivo,l,c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        salida.codigo.push(";######################## ACCEDIENDO AL ARREGLO ####################################");
        let posDinamica:String = Auxiliar.generarTemporal();
        let posFinal:String  = Auxiliar.generarTemporal();
        salida.codigo.push(posDinamica + " = " + nodo.resultado);
        let saltoError:String = Auxiliar.generarEtiqueta();
        let saltoV:String = Auxiliar.generarEtiqueta();
        for(let i = 0; i < lista.length; i++){
            let valor:String = Auxiliar.generarTemporal();
            let limite:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(posiciones[i] + " < 0",saltoError),"Si es un limite negativo"));
            salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + posDinamica + " + 1","Nos movemos al limite inferior"));
            salida.codigo.push(Auxiliar.crearLinea(limite + " = Heap[" + posDinamica + "]","Obtenemos el limite inferior"));
            salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(posiciones[i] + " > " + limite,saltoError),"Si es mayor al limite"));
            salida.codigo.push(posDinamica + " = " + posDinamica + " + 1");
            salida.codigo.push(valor +  " = " + posiciones[i] );
            salida.codigo.push(posDinamica + " = " + posDinamica + " + " + valor);
            salida.codigo.push(posFinal + " = " + posDinamica);
            salida.codigo.push(posDinamica + " = Heap[" + posDinamica + "]");
            
            
        }
        salida.codigo.push(Auxiliar.saltoIncondicional(saltoV));
        salida.codigo.push(saltoError + ":");
        salida.codigo.push("exit(1)");

        salida.codigo.push(saltoV + ":");
        salida.resultado = posDinamica;
        salida.id = nodo.id;
        salida.posicion =posFinal;
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