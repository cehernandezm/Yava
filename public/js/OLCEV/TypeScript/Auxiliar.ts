class Auxiliar{
    public static temporal:number = 0;


    public static generarTemporal():String{
        let n: number = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    }

    public static crearLinea(linea:String,comentario:String):String{
        return linea + "                ;" + comentario;
    }
}