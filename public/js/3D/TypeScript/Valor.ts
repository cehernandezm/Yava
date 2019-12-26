declare var listaSalida: any;
declare function buscarTemporal(dato:any):any;
declare function addMensajeError(tipo:any,mensaje:any,linea:any,columna:any):any;
declare var P:any,H:any;


class Valor{
    dato : Object;

    constructor(valor:any){
        this.dato = valor;
    }

    ejecutar(ambito : Ambito){
       return this.tipoDato(this.dato,ambito);
    }

     tipoDato (dato:any,ambito:Ambito):any {
        if (dato.tipo === "int") return { tipo: "number", valor: +dato.valor };
        else if (dato.tipo === "double") return { tipo: "number", valor: +dato.valor };
        else if (dato.tipo === "number") return { tipo: "number", valor: +dato.valor };
        else if (dato.tipo === "temporal") {

            let valorTemp: Object = ambito.getTemporal(dato.valor);
            if (valorTemp != null) return (this.tipoDato(valorTemp,ambito));
            else {
                addMensajeError("Semantico","No existe el temporal :" + dato.valor, dato.linea, dato.columna);
                return new MensajeError("", "", 0, 0);
            }
        }
        else if (dato.tipo === "h") return { tipo: "number", valor: H };
        else if (dato.tipo === "p") return { tipo: "number", valor: P };
        else if(dato.tipo === "heap") return { tipo: "heap", valor: 0 };
        else if(dato.tipo === "stack") return { tipo: "stack", valor: 0};
        else return dato.valor;
        
    }
}