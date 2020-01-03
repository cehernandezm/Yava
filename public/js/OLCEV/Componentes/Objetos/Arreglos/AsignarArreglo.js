var AsignarArreglo = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id
     * @param lista
     * @param expresion
     * @param l
     * @param c
     */
    function AsignarArreglo(id, lista, expresion, l, c) {
        this.id = id;
        this.lista = lista;
        this.expresion = expresion;
        this.l = l;
        this.c = c;
    }
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno
     */
    AsignarArreglo.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var resultado = this.id.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            resultado;
        var nodoID = resultado;
        if (nodoID.tipo != Tipo.ARREGLO) {
            var mensaje = new MensajeError("Semantico", "La variable tiene que ser de tipo ARREGLO no se reconoce: " + Tipo[nodoID.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo = salida.codigo.concat(nodoID.codigo);
        var arreglo = nodoID.valor;
        resultado = AsignarArreglo.mapear(nodoID, entorno, this.lista, this.l, this.c);
        if (resultado instanceof MensajeError)
            return resultado;
        var acceso = resultado;
        salida.codigo = salida.codigo.concat(acceso.codigo);
        resultado = this.expresion.ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var value = resultado;
        salida.codigo = salida.codigo.concat(value.codigo);
        if (value.tipo === Tipo.BOOLEAN)
            value = Aritmetica.arreglarBoolean(value, salida);
        if (!(Asignacion.casteoImplicito(arreglo.tipo, value.tipo))) {
            var mensaje = new MensajeError("Semantico", "El arreglo es de tipo: " + Tipo[arreglo.tipo] + " y se le quiere asignar un valor: " + Tipo[value.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo.push(Auxiliar.crearLinea("Heap[" + acceso.resultado + "] = " + value.resultado, "Seteamos el valor en la posicion indicada"));
        return salida;
    };
    /**
     * MAPEAMOS LAS POSICIONES PARA ACCEDER
     * AL ARREGLO
     * @param nodo
     * @param entorno
     * @param lista
     * @param l
     * @param c
     */
    AsignarArreglo.mapear = function (nodo, entorno, lista, l, c) {
        var arreglo = nodo.valor;
        var salida = new Nodo([]);
        var posiciones = [];
        lista.forEach(function (element) {
            var resultado = element.ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var temp = resultado;
            if (temp.tipo != Tipo.INT) {
                var mensaje = new MensajeError("Semantico", "los index tienen que ser de tipo INT, no se reconoce: " + Tipo[temp.tipo], entorno.archivo, l, c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            salida.codigo = salida.codigo.concat(temp.codigo);
            posiciones.push(temp.resultado);
        });
        //-------------------------------------------------------- ESTOY ALMACENANDO UN VALOR PRIMITIVO --------------------------------------------------
        if (+arreglo.valor === lista.length) {
            salida.tipo = arreglo.tipo;
        }
        else if (+arreglo.valor > lista.length) {
            var arregloTemp = new Arreglo(arreglo.tipo, (+arreglo.valor - lista.length));
            salida.valor = arregloTemp;
            salida.tipo = Tipo.ARREGLO;
        }
        else {
            var mensaje = new MensajeError("Semantico", "El arreglo es de: " + arreglo.valor + " dimensiones y se quiere acceder con: " + lista.length + " dimensiones", entorno.archivo, l, c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        salida.codigo.push(";######################## ACCEDIENDO AL ARREGLO ####################################");
        var posDinamica = Auxiliar.generarTemporal();
        salida.codigo.push(posDinamica + " = " + nodo.resultado);
        for (var i = 0; i < lista.length; i++) {
            var valor = Auxiliar.generarTemporal();
            var limite = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + posDinamica + " + 1", "Nos movemos al limite inferior"));
            salida.codigo.push(Auxiliar.crearLinea(limite + " = Heap[" + posDinamica + "]", "Obtenemos el limite inferior"));
            salida.codigo.push(posDinamica + " = " + posDinamica + " + 1");
            salida.codigo.push(valor + " = " + posiciones[i]);
            salida.codigo.push(posDinamica + " = " + posDinamica + " + " + valor);
            if (i + 1 < lista.length) {
                salida.codigo.push(posDinamica + " = Heap[" + posDinamica + "]");
            }
        }
        salida.resultado = posDinamica;
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno
     */
    AsignarArreglo.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return AsignarArreglo;
}());
