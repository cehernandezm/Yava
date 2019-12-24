class Auxiliar{
    public static temporal:number = 0;
    public static posicion:number = 0;
    /**
     * METODO PARA GENERAR TEMPORALES
     */
    public static generarTemporal():String{
        let n: number = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    }

    public static crearLinea(linea:String,comentario:String):String{
        return linea + "                ;" + comentario;
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
     * METODO ENCARGADO DE CREAR UN 
     * AMBITO LINEAL EN STRING
     * @param ambito ARREGLO DE LOS AMBITOS
     */
    public static crearAmbito(ambito:Array<String>):String{
        let codigo:String = "";
        ambito.forEach(element => {
            codigo += element + "_";
        });
        return codigo;
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
        e.ambito = entorno.ambito;
        e.etiquetaSalida = entorno.etiquetaSalida;
        e.posRelativaStack = entorno.posRelativaStack;
        e.clase = entorno.clase;
        e.localizacion = entorno.localizacion;


        return e;
    }

}