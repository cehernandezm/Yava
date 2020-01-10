class Analizar {
    instrucciones: Array<Instruccion>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones;
    }



    ejecutar(id: String):Object {
        let nodo:Nodo = new Nodo();
        nodo.codigo = [];
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionTrunk().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.functionNumberToCadena().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionPow().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.stringToNumber().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.funcionLength().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toCharArray().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toUpperCase().codigo);
        nodo.codigo = nodo.codigo.concat(Auxiliar.toLoweCase().codigo);
        
        let claseActual:Clase = null;
        this.instrucciones.forEach(clase => {
            let entorno: Entorno = new Entorno(id);
            if(clase instanceof Import){
                let resultado:Object = clase.ejecutar(entorno);
                if(resultado instanceof MensajeError) return resultado;
                let res:Nodo = resultado as Nodo;
                nodo.codigo = nodo.codigo.concat(res.codigo);

            }
            if (clase instanceof Clase) {
                
                let resultado:Object = clase.primeraPasada(entorno);
                if(resultado instanceof MensajeError) return resultado;
                let f:FuncionOLCEV = clase.entorno.buscarFuncion("main_ARREGLO_",[]);
                if(f != null) claseActual = clase;
                console.log(clase);
                if(!(resultado instanceof MensajeError)){
                    let res:Nodo = resultado as Nodo;
                    nodo.codigo = nodo.codigo.concat(res.codigo);
                    
                }
            }
        });
        if(claseActual === null){
            let mensaje:MensajeError = new MensajeError("Semantico","No se encontro ningun metodo main para ejecutar","principal",0,0);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        let temporal:String = Auxiliar.generarTemporal();
        nodo.codigo.push("P = P + " + Auxiliar.posicion);
        nodo.codigo.push(temporal + " = P + 0");
        nodo.codigo.push("Stack[" + temporal + "] = H");
        nodo.codigo.push("H = H + " + claseActual.tamaño);
        nodo.codigo = nodo.codigo.concat(claseActual.codigo);
        nodo.codigo.push("call main_ARREGLO_");
        return nodo;
    }
}