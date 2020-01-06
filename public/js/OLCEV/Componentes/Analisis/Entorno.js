var Entorno = /** @class */ (function () {
    function Entorno(archivo) {
        this.codigoStatic = [];
        this.metodos = [];
        this.localizacion = Localizacion.HEAP;
        this.listaContinue = [];
        this.listaBreak = [];
        this.etiquetaSalida = null;
        this.posRelativaStack = 0;
        this.archivo = archivo;
        this.listaSimbolos = [];
    }
    /**
     * METODO PARA OBTENER UNA VARIABLE
     * @param id NOMBRE DE LA VARIABLE
     */
    Entorno.prototype.buscarSimbolo = function (id) {
        for (var i = this.listaSimbolos.length - 1; i >= 0; i--) {
            if (this.listaSimbolos[i].id === id)
                return this.listaSimbolos[i];
        }
        return null;
    };
    /**
     * BUSCA ATRIBUTOS
     * @param id
     * @param flag
     */
    Entorno.prototype.buscarSimboloThis = function (id) {
        for (var i = this.listaSimbolos.length - 1; i >= 0; i--) {
            if (this.listaSimbolos[i].id === id && this.listaSimbolos[i].localizacion === Localizacion.HEAP)
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
    /**
     * FUNCION ENCARGADA DE BUSCAR LAS FUNCIONES
     * DE LA CLASE POR ALCANCE
     * ESTO SERVIRA POR SI ALGUN METODO ES
     * SOBREESCRIBIDO
     * @param id
     * @param parametros
     */
    Entorno.prototype.buscarFuncion = function (id, parametros) {
        for (var i = this.metodos.length - 1; i >= 0; i--) {
            var f = this.metodos[i];
            if (f.identificador === id)
                return f;
        }
        return null;
    };
    return Entorno;
}());
