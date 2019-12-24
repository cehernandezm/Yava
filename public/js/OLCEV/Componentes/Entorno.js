var Entorno = /** @class */ (function () {
    function Entorno(archivo) {
        this.localizacion = Localizacion.HEAP;
        this.listaContinue = [];
        this.listaBreak = [];
        this.metodoActual = null;
        this.etiquetaSalida = null;
        this.posRelativaStack = 0;
        this.archivo = archivo;
        this.listaSimbolos = [];
        this.ambito = [];
    }
    /**
     * METODO PARA OBTENER UNA VARIABLE
     * @param id NOMBRE DE LA VARIABLE
     */
    Entorno.prototype.buscarSimbolo = function (id, ambito) {
        for (var i = this.listaSimbolos.length - 1; i >= 0; i--) {
            if (this.listaSimbolos[i].id === id && ambito === this.listaSimbolos[i].ambito)
                return this.listaSimbolos[i];
        }
        return null;
    };
    /**
     * METODO PARA AGREGAR SIMBOLOS
     * @param s SIMBOLO A AGREGAR
     */
    Entorno.prototype.agregarSimbolo = function (s) {
        this.listaSimbolos.push(s);
    };
    /**
     * METODO PARA OBTENER LAS POSICIONES RELATIVAS
     */
    Entorno.prototype.getPosRelativa = function () {
        var i = this.posRelativaStack;
        this.posRelativaStack++;
        return i;
    };
    return Entorno;
}());
