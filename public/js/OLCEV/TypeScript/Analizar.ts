class Analizar {
    instrucciones: Array<Instruccion>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones;
    }



    ejecutar(id: String) {

        this.instrucciones.forEach(clase => {
            let entorno: Entorno = new Entorno(id);
            entorno.ambito.push(id);
            if (clase instanceof Clase) {
                let resultado:Object = clase.primeraPasada(entorno);
                console.log(resultado);
            }
            //console.log(entorno);
        });
    }
}