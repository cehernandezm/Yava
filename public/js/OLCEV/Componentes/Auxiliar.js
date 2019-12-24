var Auxiliar = /** @class */ (function () {
    function Auxiliar() {
    }
    /**
     * METODO PARA GENERAR TEMPORALES
     */
    Auxiliar.generarTemporal = function () {
        var n = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    };
    Auxiliar.crearLinea = function (linea, comentario) {
        return linea + "                ;" + comentario;
    };
    /**
     * METODO QUE MOSTRARA LOS ERRORES EN CONSOLA
     * @param error clase error con toda la informacion del error
     */
    Auxiliar.agregarError = function (error) {
        console.error(error);
    };
    /**
     * METOODO QUE LLEVA EL CONTROL DE LAS POSICIONES ABSOLUTAS
     */
    Auxiliar.posicionAbsoluta = function () {
        var i = Auxiliar.posicion;
        Auxiliar.posicion++;
        return i;
    };
    /**
     * METODO ENCARGADO DE CREAR UN OBJETO ATRIBUTO
     * @param visibilidad Visivilidad del objeto
     * @param isFinal  si es final
     * @param isStatic  si es estatica
     * @param isAbstract  si es abstracta
     */
    Auxiliar.crearObjectoAtributos = function (visibilidad, isFinal, isStatic, isAbstract) {
        return { visibilidad: visibilidad, isStatic: isStatic, isFinal: isFinal, isAbstract: isAbstract };
    };
    /**
     * METODO ENCARGADO DE CREAR UN
     * AMBITO LINEAL EN STRING
     * @param ambito ARREGLO DE LOS AMBITOS
     */
    Auxiliar.crearAmbito = function (ambito) {
        var codigo = "";
        ambito.forEach(function (element) {
            codigo += element + "_";
        });
        return codigo;
    };
    /**
     * METODO QUE SERVIRA PARA CLONAR UN ENTORNO
     * @param entorno ENTORNO A CLONAR
     */
    Auxiliar.clonarEntorno = function (entorno) {
        var e = new Entorno(entorno.archivo);
        e.listaSimbolos = entorno.listaSimbolos;
        e.listaBreak = entorno.listaBreak;
        e.listaContinue = entorno.listaContinue;
        e.ambito = entorno.ambito;
        e.etiquetaSalida = entorno.etiquetaSalida;
        e.posRelativaStack = entorno.posRelativaStack;
        e.clase = entorno.clase;
        e.localizacion = entorno.localizacion;
        return e;
    };
    Auxiliar.temporal = 0;
    Auxiliar.posicion = 0;
    return Auxiliar;
}());
