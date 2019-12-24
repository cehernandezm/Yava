class Analizar{
    instrucciones:Array<Instruccion>

    constructor(instrucciones:Array<Instruccion>){
        this.instrucciones = instrucciones;
    }

     

    ejecutar(id:String){
        
        this.instrucciones.forEach(clase => {
            let entorno :Entorno =  new Entorno(id);
            entorno.ambito = id;
            if(clase instanceof Clase) clase.primeraPasada(entorno);
            console.log(entorno);
        });
    }
}