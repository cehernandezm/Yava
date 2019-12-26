declare var listaFuncion: any;
class Instruccion3D {
    listaInstrucciones: any;
    ambito: Ambito;
    listaDebugger: any;


    constructor(listaInstrucciones: any, ambito: Ambito) {
        this.listaInstrucciones = listaInstrucciones;
        this.ambito = ambito;
        this.listaDebugger = [];
    }

    ejecutar() {
        //--------------------------------- HACEMOS UN PRIMER RECORRIDO BUSCANDO TODAS LAS ETIQUETAS QUE EXISTEN EN EL CODIGO -------
        this.listaInstrucciones.forEach(element => {
            if (element instanceof Etiqueta) element.ejecutar(this.ambito);
            else if (element instanceof Funcion) {
                if (buscarFuncion(element.id) === null)
                    listaFuncion.push({ nombre: element.id, funcion: element });
                else
                    addMensajeError(
                        "Semantico",
                        "La funcion " + element.id + " ya existe",
                        element.l,
                        element.c

                    );
            }
        });
        for (let i = 0; i < this.listaInstrucciones.length; i++) {
            let element = this.listaInstrucciones[i];
            if (element instanceof Etiqueta || element instanceof Funcion) {
            } else {
                if (element instanceof Incondicional) {
                    let posicion = element.ejecutar(this.ambito);
                    if (posicion != -1) i = redirigir(this.listaInstrucciones, posicion, i);
                } else if (element instanceof Condicional) {
                    let posicion = element.ejecutar(this.ambito);
                    if (posicion != -1) i = redirigir(this.listaInstrucciones, posicion, i);
                } else element.ejecutar(this.ambito);
            }
        }
    }

    ejecutarDebugger(para: number) {
        let index = 0;
        this.almacenarDatosIniciales(this.listaInstrucciones);
        for (let i = 0; i < this.listaInstrucciones.length; i++) {
            let element = this.listaInstrucciones[i];
            //---------------------------- donde tenemos que parar --------------------------------------
            if (element.l >= para) {
                this.listaDebugger.push({ linea: i, instrucciones: this.listaInstrucciones });
                return element.l;
            }

            if (element instanceof Etiqueta || element instanceof Funcion) {
            } else {
                if (element instanceof Incondicional) {
                    let posicion = element.ejecutar(this.ambito);
                    if (posicion != -1) i = redirigir(this.listaInstrucciones, posicion, i);
                } else if (element instanceof Condicional) {
                    let posicion = element.ejecutar(this.ambito);
                    if (posicion != -1) i = redirigir(this.listaInstrucciones, posicion, i);
                } else element.ejecutar(this.ambito);
            }

        }

        return index;
    }

    almacenarDatosIniciales(lista:any){
        //--------------------------------- HACEMOS UN PRIMER RECORRIDO BUSCANDO TODAS LAS ETIQUETAS QUE EXISTEN EN EL CODIGO -------
        lista.forEach(element => {
            if (element instanceof Etiqueta) element.ejecutar(this.ambito);
            else if (element instanceof Funcion) {
                if (buscarFuncion(element.id) === null)
                    listaFuncion.push({ nombre: element.id, funcion: element });
                else
                    addMensajeError(
                        "Semantico",
                        "La funcion " + element.id + " ya existe",
                        element.l,
                        element.c

                    );
            }
        });
    }

    siguienteDebug() {
        let lastNodo = this.listaDebugger[this.listaDebugger.length - 1];
        if(lastNodo == null) return -777;
        let element = lastNodo.instrucciones[lastNodo.linea];
        if (element instanceof Etiqueta || element instanceof Funcion) { }
        else if (element instanceof CallFuncion) {
            this.ambito.entornos.push(element.id);
            let funcion: Funcion = buscarFuncion(element.id);

            if (funcion === null) {
                addMensajeError("Semantico", "La funcion: " + element.id + " no existe", element.l, element.c);
                return -1;
            }

            funcion.instrucciones.forEach(element => {
                if (element instanceof Etiqueta) element.ejecutar(this.ambito);
            });

            this.listaDebugger.push({linea:0,instrucciones:funcion.instrucciones});

            lastNodo.linea++;
            return funcion.l;
        }
        else {
            if (element instanceof Incondicional) {
                let posicion = element.ejecutar(this.ambito);
                if (posicion != -1) {
                    lastNodo.linea = redirigir(lastNodo.instrucciones, posicion, lastNodo.linea);
                    return element.l;
                }
            } else if (element instanceof Condicional) {
                let posicion = element.ejecutar(this.ambito);
                if (posicion != -1) {
                    lastNodo.linea = redirigir(lastNodo.instrucciones, posicion, lastNodo.linea);
                    return element.l;
                }
            } else element.ejecutar(this.ambito);
        }


        if(lastNodo.linea + 1 >= lastNodo.instrucciones.length){
            this.ambito.entornos.pop();
            this.listaDebugger.pop();
            if(this.listaInstrucciones.size === 0) return -777;
            else{
                lastNodo = this.listaInstrucciones[this.listaInstrucciones.size - 1];
                return element.l;
            }
        }
        lastNodo.linea++;
        

        return element.l;
    }
}