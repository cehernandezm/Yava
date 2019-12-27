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
        this.instrucciones.forEach(clase => {
            let entorno: Entorno = new Entorno(id);
            if (clase instanceof Clase) {
                let resultado:Object = clase.primeraPasada(entorno);
                if(!(resultado instanceof MensajeError)){
                    let res:Nodo = resultado as Nodo;
                    nodo.codigo = nodo.codigo.concat(res.codigo);
                }
            }
            //console.log(entorno);
        });
        return nodo;
    }
}