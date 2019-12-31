var listaValores = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista
     * @param l
     * @param c
     */
    function listaValores(lista, l, c) {
        this.lista = lista;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    listaValores.prototype.ejecutar = function (entorno) {
        var _this = this;
        var salida = new Nodo([]);
        var tipo = null;
        var tipoArreglo = null;
        var dimensiones = 1;
        var temporal = Auxiliar.generarTemporal();
        var posiciones = [];
        this.lista.forEach(function (element) {
            var resultado = element.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var nodo = resultado;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if (nodo.tipo === Tipo.BOOLEAN)
                nodo = Logica.arreglarBoolean(nodo, salida);
            if (tipo === null) {
                if (nodo.tipo === Tipo.ARREGLO) {
                    tipo = Tipo.ARREGLO;
                    var arreglo = nodo.valor;
                    tipoArreglo = arreglo.tipo;
                    dimensiones += +arreglo.valor;
                }
                else
                    tipo = nodo.tipo;
            }
            else {
                if (tipo === Tipo.ARREGLO && nodo.tipo === Tipo.ARREGLO) {
                    var arreglo = nodo.valor;
                    if (tipoArreglo !== arreglo.tipo) {
                        var mensaje = new MensajeError("Semantico", "El arreglo es de tipo: " + Tipo[tipoArreglo] + " y se quiere agregar un arreglo de tipo: " + Tipo[arreglo.tipo], entorno.archivo, _this.l, _this.c);
                        Auxiliar.agregarError(mensaje);
                        return mensaje;
                    }
                }
                else if (tipo !== nodo.tipo) {
                    var mensaje = new MensajeError("Semantico", "Los valores del arreglo son de tipo: " + Tipo[tipo] + " y se quiere agregar un valor de tipo: " + Tipo[nodo.tipo], entorno.archivo, _this.l, _this.c);
                    Auxiliar.agregarError(mensaje);
                    return mensaje;
                }
            }
            posiciones.push(nodo.resultado);
        });
        if (tipo === Tipo.ARREGLO)
            tipo = tipoArreglo;
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = H", "Guardamos la referencia del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + this.lista.length, "Almacenamos el tamanio del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + (this.lista.length - 1), "Almacenamos el limite del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        posiciones.forEach(function (element) {
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + element, "Guardamos el valor en el arreglo"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        });
        salida.resultado = temporal;
        salida.tipo = Tipo.ARREGLO;
        salida.valor = new Arreglo(tipo, dimensiones);
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    listaValores.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return listaValores;
}());
