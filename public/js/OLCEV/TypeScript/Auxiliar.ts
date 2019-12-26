class Auxiliar{
    public static temporal:number = 0;
    public static posicion:number = 0;
    public static etiqueta:number = 0;
    /**
     * METODO PARA GENERAR TEMPORALES
     */
    public static generarTemporal():String{
        let n: number = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    }

    /**
     * METODO QUE CREA UNA NUEVA LINEA DE CODIGO
     * @param linea CODIGO 3D
     * @param comentario COMENTARIO QUE ACOMPAÑARA A LA LINEA
     */
    public static crearLinea(linea:String,comentario:String):String{
        return linea + "                ;" + comentario;
    }


    /**
     * METODO QUE GENERAR NUEVAS ETIQUETAS
     */
    public static generarEtiqueta():String{
        let i:number = this.etiqueta;
        this.etiqueta++;
        return "L"+i;
    }

    /**
     * METODO QUE MOSTRARA LOS ERRORES EN CONSOLA
     * @param error clase error con toda la informacion del error
     */
    public static agregarError(error:MensajeError){
        console.error(error);
    }


    /**
     * METOODO QUE LLEVA EL CONTROL DE LAS POSICIONES ABSOLUTAS
     */
    public static posicionAbsoluta():number{
        let i = Auxiliar.posicion;
        Auxiliar.posicion++;
        return i;
    }

    /**
     * METODO ENCARGADO DE CREAR UN OBJETO ATRIBUTO
     * @param visibilidad Visivilidad del objeto
     * @param isFinal  si es final
     * @param isStatic  si es estatica
     * @param isAbstract  si es abstracta
     */
    public static crearObjectoAtributos(visibilidad:Visibilidad,isFinal:Boolean,isStatic:Boolean,isAbstract:Boolean):Object{
        return {visibilidad: visibilidad,isStatic:isStatic,isFinal:isFinal,isAbstract:isAbstract} ;
    }

 

    /**
     * METODO QUE SERVIRA PARA CLONAR UN ENTORNO
     * @param entorno ENTORNO A CLONAR
     */
    public static clonarEntorno(entorno:Entorno):Entorno{
        let e: Entorno = new Entorno(entorno.archivo);
        e.listaSimbolos = entorno.listaSimbolos;
        e.listaBreak = entorno.listaBreak;
        e.listaContinue = entorno.listaContinue;
        e.etiquetaSalida = entorno.etiquetaSalida;
        e.clase = entorno.clase;


        return e;
    }


    /**
     * METODO QUE DEVUELVE EL CODIGO 3D
     * DE LA FUNCION TRUNK
     */
    public static funcionTrunk():Nodo{
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];

        let posicion:String = this.generarTemporal();
        let valor:String = this.generarTemporal();
        let modulo:String = this.generarTemporal();
        let retorno:String = this.generarTemporal();

        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";############################### FUNCION TRUNK############################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc trunk{");
        
        nodo.codigo.push(this.crearLinea(posicion + " = P  + 0","posicion del numero a recibir"));
        nodo.codigo.push(this.crearLinea(valor + " = Stack[" + posicion + "]","Obtenemos el valor numerico"));
        nodo.codigo.push(this.crearLinea(modulo + " = " + valor + " % 1 ","Nos devuelve el residuo"));
        nodo.codigo.push(retorno + " = " + valor + " - " + modulo);
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1","Posicion del retorno"));
        nodo.codigo.push("Stack[" + posicion + "] = " + retorno);
        
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    }
    

    /**
     * METODO QUE CREA SALTOS CONDICIONALES
     * @param condicion CONDICION A EVALUAR
     * @param etiqueta ETIQUETA DONDE SE REALIZARA EL SALTO
     */
    public static saltoCondicional(condicion:String,etiqueta:String):String{
        return "if " + condicion + " goto " + etiqueta;
    }

    /**
     * METODO QUE GENERA SALTOS INCONDICIONALES
     * @param etiqueta SALTO
     */
    public static saltoIncondicional(etiqueta:String){
        return "goto " + etiqueta;
    }

    /**
     * METODO QUE DEVUELVE EL CODIGO 3D
     * DE CONVERTIR UN NUMERO A CADENA
     */
    public static functionNumberToCadena():Nodo{
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];
        let posicion:String = this.generarTemporal();
        let valor:String = this.generarTemporal();
        let v1:String = this.generarEtiqueta();
        let v2:String = this.generarEtiqueta();
        let newValor:String = this.generarTemporal();
        let modulo:String = this.generarTemporal();
        let ascii:String = this.generarTemporal();
        let salto:String = this.generarEtiqueta();
        let division:String = this.generarTemporal();


        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";######################### FUNCION NUMBERTOCADENA ########################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc numberToCadena{");

        nodo.codigo.push(this.crearLinea(posicion + " = P + 0","Posicion del parametro 1"));
        nodo.codigo.push(this.crearLinea(valor + " = Stack[" + posicion + "]","Almacenamos el valor del numero en un temporal"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " >= 0",v1),"Si el numero es mayor a cero hacemos un salto"));
        nodo.codigo.push(this.crearLinea(valor + " = " + valor + " * -1 ", "Convertirmos a positivo el numero"));
        nodo.codigo.push(this.crearLinea("Heap[H] = 45","Guardamos un - en el heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1","Aumentamos el Heap"));
        nodo.codigo.push(v1 + ":");
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " < 10 ",v2),""));
        nodo.codigo.push(this.crearLinea("P = P + 1","Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0",""));
        nodo.codigo.push(this.crearLinea(division + " = " + valor + " / 10",""));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + " ] = " + division,"Pasamos el parametro"));
        nodo.codigo.push(this.crearLinea("call trunk","Llamamos a la funcion trunk para obtener el numero entero"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1","Posicion del return"));
        nodo.codigo.push(this.crearLinea(newValor + " = Stack[" + posicion + "]","Obtenemos el valor de retorno"));
        nodo.codigo.push(this.crearLinea("P = P - 1","Fin de simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea("P = P + 1","Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0","Posicion del primer parametro"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + newValor,"Seteamos el valor del primer parametro"));
        nodo.codigo.push("call numberToCadena");
        nodo.codigo.push(this.crearLinea("P = P - 1","Fin de simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(modulo + " = " + valor + " % 10",""));
        nodo.codigo.push(this.crearLinea(ascii + " = " + modulo + " + 48","Le sumamos 48 para obtener su ascii"));
        nodo.codigo.push(this.crearLinea("Heap[H] = " + ascii,"Almacenamos el valor en el Heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1","Aumentamos el Heap"));
        nodo.codigo.push(this.crearLinea(this.saltoIncondicional(salto),""));
        nodo.codigo.push(";############################## SI EL NUMERO ES MENOR A 10 #########################");
        nodo.codigo.push(v2 + ":");
        nodo.codigo.push(this.crearLinea(ascii + " = " + valor + " + 48","Le sumamos 48 para obtener su ascii"));
        nodo.codigo.push(this.crearLinea("Heap[H] = " + ascii,"Almacenamos el valor en el Heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1","Aumentamos el Heap"));
        nodo.codigo.push(salto + ":");
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    }

    /**
     * METODO QUE ESCRIBE LAS ETIQUETAS EN 3D
     * @param etiquetas ETIQUETAS A ESCRIBIR
     */
    public static escribirEtiquetas(etiquetas:Array<String>):Nodo{
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];

        etiquetas.forEach(element => {
            nodo.codigo.push(element + ":");
        });

        return nodo;
    }

    
    

}