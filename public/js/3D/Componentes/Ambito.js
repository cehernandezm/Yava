var Ambito = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASEs
     * @param Temporales
     * @param Stack
     * @param Heap
     */
    function Ambito() {
        this.Temporales = [];
        this.Stack = [];
        this.Heap = [{ tipo: "number", valor: -11 }];
        this.inicializarStack();
        this.entornos = [];
    }
    /*
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     --------------------------------------------------------------- TEMPORALES ---------------------------------------------------------------------------------
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    /**
     * METODO QUE BUSCA EN LA LISTA DE TEMPORALES
     * @param nombre
     * @return Temporal | null
     */
    Ambito.prototype.getTemporal = function (nombre) {
        var retorno = null;
        for (var i = this.Temporales.length - 1; i >= 0; i--) {
            var temporal = this.Temporales[i];
            if (temporal.id === nombre && temporal.ambito === this.getEntorno())
                retorno = temporal;
        }
        return retorno;
    };
    /**
    * METODO QUE AGREGA UN NUEVO TEMPORAL
    * @param dato
    */
    Ambito.prototype.agregarTemporal = function (dato) {
        var flag = true;
        for (var i = 0; i < this.Temporales.length; i++) {
            if (this.Temporales[i].id === dato.id && this.Temporales[i].ambito === this.getEntorno()) {
                this.Temporales[i] = dato;
                return -1;
            }
        }
        this.Temporales.push(dato);
        return -1;
    };
    /*
   -------------------------------------------------------------------------------------------------------------------------------------------------------
   --------------------------------------------------------------- HEAP ---------------------------------------------------------------------------------
   -------------------------------------------------------------------------------------------------------------------------------------------------------
   */
    /**
     * METODO QUE DEVUELVE UN VALOR DEL HEAP
     * @param pos
     * @return Heap  | null;
     */
    Ambito.prototype.getHeap = function (pos) {
        var retorno = null;
        for (var i = 0; i < this.Heap.length; i++) {
            var Heap = this.Heap[i];
            if (i === pos)
                retorno = Heap;
        }
        return retorno;
    };
    /**
     * METODO QUE SE ENCARGA DE INCREMENTAR EN UNO EL HEAP SIEMPRE
     */
    Ambito.prototype.incrementarEspacioHeap = function () {
        var tamOriginal = this.Heap.length;
        var nuevo = H - (this.Heap.length - 1);
        for (var i = 0; i < nuevo; i++)
            this.Heap.push({ tipo: "number", valor: -11 });
    };
    /**
    * METODO QUE SIRVE PARA AGREGAR UN VALOR AL STACK
    * @param pos
    * @param dato
    */
    Ambito.prototype.setValueHeap = function (pos, dato) {
        for (var i = 0; i < this.Heap.length; i++) {
            if (pos === i)
                this.Heap[i] = dato;
        }
    };
    Ambito.prototype.getAllHeap = function () {
        return this.Heap;
    };
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    --------------------------------------------------------------- STACK ---------------------------------------------------------------------------------
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    */
    /**
     * METODO QUE INICIALIZARA EL STACK CON 10,000 POSICIONES
     */
    Ambito.prototype.inicializarStack = function () {
        for (var i = 0; i < 10000; i++) {
            this.Stack.push({ tipo: "null", valor: -11 });
        }
    };
    /**
     * METODOQ QUE BUSCA UN VALOR EN EL STACK
     * @param pos
     * @return stack | null
     */
    Ambito.prototype.getValueStack = function (pos) {
        var retorno = null;
        for (var i = 0; i < this.Stack.length; i++) {
            var stack = this.Stack[i];
            if ((i) === pos)
                retorno = stack;
        }
        return retorno;
    };
    /**
     * METODO QUE SIRVE PARA AGREGAR UN VALOR AL STACK
     * @param pos
     * @param dato
     */
    Ambito.prototype.setValueStack = function (pos, dato) {
        for (var i = 0; i < this.Stack.length; i++) {
            if (pos === i)
                this.Stack[i] = dato;
        }
    };
    Ambito.prototype.getAllStack = function () {
        return this.Stack;
    };
    //------------------------------------------------------------------ CAMBIOS DE AMBITO ------------------------------------------------------------------
    Ambito.prototype.getEntorno = function () {
        var inicio = "inicio";
        this.entornos.forEach(function (element) {
            inicio += "," + element;
        });
        return inicio;
    };
    Ambito.prototype.limpiarEntorno = function (index) {
        for (var i = 0; i < this.Temporales.length; i++) {
            var element = this.Temporales[i];
            if (element.ambito === index) {
                this.Temporales.splice(i, 1);
                i--;
            }
        }
    };
    return Ambito;
}());
