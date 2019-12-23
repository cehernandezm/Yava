var Auxiliar = /** @class */ (function () {
    function Auxiliar() {
    }
    Auxiliar.generarTemporal = function () {
        var n = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    };
    Auxiliar.crearLinea = function (linea, comentario) {
        return linea + "                ;" + comentario;
    };
    Auxiliar.temporal = 0;
    return Auxiliar;
}());
