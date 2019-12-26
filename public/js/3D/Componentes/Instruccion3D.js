var Instruccion3D = /** @class */ (function () {
    function Instruccion3D(listaInstrucciones, ambito) {
        this.listaInstrucciones = listaInstrucciones;
        this.ambito = ambito;
        this.listaDebugger = [];
    }
    Instruccion3D.prototype.ejecutar = function () {
        var _this = this;
        //--------------------------------- HACEMOS UN PRIMER RECORRIDO BUSCANDO TODAS LAS ETIQUETAS QUE EXISTEN EN EL CODIGO -------
        this.listaInstrucciones.forEach(function (element) {
            if (element instanceof Etiqueta)
                element.ejecutar(_this.ambito);
            else if (element instanceof Funcion) {
                if (buscarFuncion(element.id) === null)
                    listaFuncion.push({ nombre: element.id, funcion: element });
                else
                    addMensajeError("Semantico", "La funcion " + element.id + " ya existe", element.l, element.c);
            }
        });
        for (var i = 0; i < this.listaInstrucciones.length; i++) {
            var element = this.listaInstrucciones[i];
            if (element instanceof Etiqueta || element instanceof Funcion) {
            }
            else {
                if (element instanceof Incondicional) {
                    var posicion = element.ejecutar(this.ambito);
                    if (posicion != -1)
                        i = redirigir(this.listaInstrucciones, posicion, i);
                }
                else if (element instanceof Condicional) {
                    var posicion = element.ejecutar(this.ambito);
                    if (posicion != -1)
                        i = redirigir(this.listaInstrucciones, posicion, i);
                }
                else
                    element.ejecutar(this.ambito);
            }
        }
    };
    Instruccion3D.prototype.ejecutarDebugger = function (para) {
        var index = 0;
        this.almacenarDatosIniciales(this.listaInstrucciones);
        for (var i = 0; i < this.listaInstrucciones.length; i++) {
            var element = this.listaInstrucciones[i];
            //---------------------------- donde tenemos que parar --------------------------------------
            if (element.l >= para) {
                this.listaDebugger.push({ linea: i, instrucciones: this.listaInstrucciones });
                return element.l;
            }
            if (element instanceof Etiqueta || element instanceof Funcion) {
            }
            else {
                if (element instanceof Incondicional) {
                    var posicion = element.ejecutar(this.ambito);
                    if (posicion != -1)
                        i = redirigir(this.listaInstrucciones, posicion, i);
                }
                else if (element instanceof Condicional) {
                    var posicion = element.ejecutar(this.ambito);
                    if (posicion != -1)
                        i = redirigir(this.listaInstrucciones, posicion, i);
                }
                else
                    element.ejecutar(this.ambito);
            }
        }
        return index;
    };
    Instruccion3D.prototype.almacenarDatosIniciales = function (lista) {
        var _this = this;
        //--------------------------------- HACEMOS UN PRIMER RECORRIDO BUSCANDO TODAS LAS ETIQUETAS QUE EXISTEN EN EL CODIGO -------
        lista.forEach(function (element) {
            if (element instanceof Etiqueta)
                element.ejecutar(_this.ambito);
            else if (element instanceof Funcion) {
                if (buscarFuncion(element.id) === null)
                    listaFuncion.push({ nombre: element.id, funcion: element });
                else
                    addMensajeError("Semantico", "La funcion " + element.id + " ya existe", element.l, element.c);
            }
        });
    };
    Instruccion3D.prototype.siguienteDebug = function () {
        var _this = this;
        var lastNodo = this.listaDebugger[this.listaDebugger.length - 1];
        if (lastNodo == null)
            return -777;
        var element = lastNodo.instrucciones[lastNodo.linea];
        if (element instanceof Etiqueta || element instanceof Funcion) { }
        else if (element instanceof CallFuncion) {
            this.ambito.entornos.push(element.id);
            var funcion = buscarFuncion(element.id);
            if (funcion === null) {
                addMensajeError("Semantico", "La funcion: " + element.id + " no existe", element.l, element.c);
                return -1;
            }
            funcion.instrucciones.forEach(function (element) {
                if (element instanceof Etiqueta)
                    element.ejecutar(_this.ambito);
            });
            this.listaDebugger.push({ linea: 0, instrucciones: funcion.instrucciones });
            lastNodo.linea++;
            return funcion.l;
        }
        else {
            if (element instanceof Incondicional) {
                var posicion = element.ejecutar(this.ambito);
                if (posicion != -1) {
                    lastNodo.linea = redirigir(lastNodo.instrucciones, posicion, lastNodo.linea);
                    return element.l;
                }
            }
            else if (element instanceof Condicional) {
                var posicion = element.ejecutar(this.ambito);
                if (posicion != -1) {
                    lastNodo.linea = redirigir(lastNodo.instrucciones, posicion, lastNodo.linea);
                    return element.l;
                }
            }
            else
                element.ejecutar(this.ambito);
        }
        if (lastNodo.linea + 1 >= lastNodo.instrucciones.length) {
            this.ambito.entornos.pop();
            this.listaDebugger.pop();
            if (this.listaInstrucciones.size === 0)
                return -777;
            else {
                lastNodo = this.listaInstrucciones[this.listaInstrucciones.size - 1];
                return element.l;
            }
        }
        lastNodo.linea++;
        return element.l;
    };
    return Instruccion3D;
}());
