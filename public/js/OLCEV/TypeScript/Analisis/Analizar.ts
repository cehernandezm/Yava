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
                if(!(resultado instanceof MensajeError)){
                    let res:Nodo = resultado as Nodo;
                    nodo.codigo = nodo.codigo.concat(res.codigo);
                    
                }
            }
        });
        
        let temporal:String = Auxiliar.generarTemporal();
        nodo.codigo.push(temporal + " = P + 0");
        nodo.codigo.push("Stack[" + temporal + "] = H");
        nodo.codigo.push("H = H + 1");
        nodo.codigo.push("call main_ARREGLO_");
        return nodo;
    }
}