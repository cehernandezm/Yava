var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var crearArreglo = /** @class */ (function (_super) {
    __extends(crearArreglo, _super);
    function crearArreglo(tipo, valor, dimensiones, l, c) {
        var _this = _super.call(this, tipo, valor) || this;
        _this.dimensiones = dimensiones;
        _this.l = l;
        _this.c = c;
        return _this;
    }
    crearArreglo.prototype.ejecutar = function (entorno) {
        var salida = new Nodo([]);
        var temporalPosicion = Auxiliar.generarTemporal();
        var contador = Auxiliar.generarTemporal();
        var cantidadRepeticiones = Auxiliar.generarTemporal();
        var tamHijos = Auxiliar.generarTemporal();
        var posDinamica = Auxiliar.generarTemporal();
        salida.codigo.push(";###################################### INICIALIZANDO ARREGLO ###############################");
        salida.codigo.push(Auxiliar.crearLinea(temporalPosicion + " = H + 0", "Posicion de inicio del arreglo"));
        salida.codigo.push(contador + " = 0");
        var resultado = this.dimensiones[0].ejecutar(entorno);
        if (resultado instanceof MensajeError)
            return resultado;
        var dimension0 = resultado;
        if (dimension0.tipo != Tipo.INT) {
            var mensaje = new MensajeError("Semantico", "Las dimensiones tienen que ser enteros", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        var falsa = Auxiliar.generarEtiqueta();
        var salto = Auxiliar.generarEtiqueta();
        var limite = Auxiliar.generarTemporal();
        salida.codigo = salida.codigo.concat(dimension0.codigo);
        salida.codigo.push(Auxiliar.crearLinea(limite + " = " + dimension0.resultado + " - 1", "Calculamos su limite"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + dimension0.resultado, "Almacenamos su tamanio"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + limite, "Almacenamos su limite"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(salto + ":");
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(contador + " >= " + dimension0.resultado, falsa), ""));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "valor inicial de la dimension 0"));
        salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
        salida.codigo.push(Auxiliar.crearLinea(contador + " = " + contador + " + 1", "Aumentamos el contador"));
        salida.codigo.push(Auxiliar.saltoIncondicional(salto));
        salida.codigo.push(falsa + ":");
        salida.codigo.push(cantidadRepeticiones + " = 1");
        salida.codigo.push(Auxiliar.crearLinea(tamHijos + " = " + dimension0.resultado, "Almacenamos cuantos nodos hijos tendra esta dimension"));
        salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + temporalPosicion + " + 2", "Nos movemos el espacio de su tamanio y su limite"));
        for (var i = 1; i < this.dimensiones.length; i++) {
            var fori = Auxiliar.generarTemporal();
            var falsai = Auxiliar.generarEtiqueta();
            var saltoi = Auxiliar.generarEtiqueta();
            var forh = Auxiliar.generarTemporal();
            var falsah = Auxiliar.generarEtiqueta();
            var saltoh = Auxiliar.generarEtiqueta();
            resultado = this.dimensiones[i].ejecutar(entorno);
            if (resultado instanceof MensajeError)
                return resultado;
            var di = resultado;
            if (di.tipo != Tipo.INT) {
                var mensaje = new MensajeError("Semantico", "Las dimensiones tienen que ser enteros", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            var limdi = Auxiliar.generarTemporal();
            var forb = Auxiliar.generarTemporal();
            var falsab = Auxiliar.generarEtiqueta();
            var saltob = Auxiliar.generarEtiqueta();
            var posActual = Auxiliar.generarTemporal();
            salida.codigo.push(";################################### FOR QUE RECORRE LOS HIJOS DEL ARREGLO ########################");
            salida.codigo.push(fori + " = 0");
            salida.codigo.push(saltoi + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(fori + " >= " + cantidadRepeticiones, falsai));
            salida.codigo.push(";###################### FOR QUE SE ENCARGARA DE RELACION EL PADRE CON SUS HIJOS #####################");
            salida.codigo.push(forh + " = 0");
            salida.codigo.push(saltoh + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(forh + " >= " + tamHijos, falsah));
            salida.codigo.push(posActual + "= H + 0");
            salida.codigo = salida.codigo.concat(di.codigo);
            salida.codigo.push(Auxiliar.crearLinea(limdi + " = " + di.resultado + " - 1", "Calculamos el limite de la dimension"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + di.resultado, "Almacenamos su tamanio"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + limdi, "Almacenamos su limite"));
            salida.codigo.push(Auxiliar.crearLinea("H = H + 1", "Aumentamos el Heap"));
            salida.codigo.push(";##################################### FOR QUE INICIALIZARA LOS VALORES ###########################");
            salida.codigo.push(forb + " = 0");
            salida.codigo.push(saltob + ":");
            salida.codigo.push(Auxiliar.saltoCondicional(forb + " >= " + di.resultado, falsab));
            salida.codigo.push("Heap[H] = 0");
            salida.codigo.push("H = H + 1");
            salida.codigo.push(forb + "  = " + forb + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltob));
            salida.codigo.push(falsab + ":");
            salida.codigo.push(";##################################### FIN FOR QUE INICIALIZARA LOS VALORES ###########################");
            salida.codigo.push("Heap[" + posDinamica + "] = " + posActual);
            salida.codigo.push(posDinamica + " = " + posDinamica + " + 1");
            salida.codigo.push(forh + " = " + forh + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltoh));
            salida.codigo.push(falsah + ":");
            salida.codigo.push(";###################### FIN FOR QUE SE ENCARGARA DE RELACION EL PADRE CON SUS HIJOS #####################");
            salida.codigo.push(Auxiliar.crearLinea(posDinamica + " = " + posDinamica + " + 2", "Nos movemos 2 espacios (tamanio y limite)"));
            salida.codigo.push(fori + " = " + fori + " + 1");
            salida.codigo.push(Auxiliar.saltoIncondicional(saltoi));
            salida.codigo.push(falsai + ":");
            salida.codigo.push(tamHijos + " = " + di.resultado);
            salida.codigo.push(cantidadRepeticiones + " = " + cantidadRepeticiones + " * " + tamHijos);
            salida.codigo.push(";################################### FIN FOR QUE RECORRE LOS HIJOS DEL ARREGLO ########################");
        }
        salida.tipo = Tipo.ARREGLO;
        salida.resultado = temporalPosicion;
        salida.valor = new Arreglo(this.tipo, this.dimensiones.length);
        return salida;
    };
    /**
     * ESTA CLASE NO POSEE UNA PRIMERA PASADA
     * @param entorno
     */
    crearArreglo.prototype.primeraPasada = function (entorno) {
        return 0;
    };
    return crearArreglo;
}(Valor));
