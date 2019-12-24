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
    Auxiliar.temporal = 0;
    Auxiliar.posicion = 0;
    return Auxiliar;
}());
