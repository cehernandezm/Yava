/**
 *  OPERACION:
 * 0  ----------------   IMPRIMIR SU VALOR EN ENTERO 
 * 1 ------------------ CONVERTIR DE ASCII A CARACTER
 */
declare function addMessage(dato:any):any;

class Print{

    operacion : number;
    valor : any;
    l : number;
    c : number;
    posicion : number;

    constructor(operacion:number,valor:any,l:number,c:number,posicion:number){
        this.operacion = operacion;
        this.valor = valor;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }


    ejecutar(ambito: Ambito):any{
        let resultado:any = (this.valor == null) ? null : this.valor.ejecutar(ambito);
        if(!(resultado instanceof MensajeError)){
            if(this.operacion === 0) addMessage(Math.floor(resultado.valor));
            
            else if(this.operacion === 1) {
                let modulo:number = resultado.valor % 1;
                if(modulo === 0) {
                    if(resultado.valor === 10){
                        addMessage("<br>");
                    }
                    else addMessage(String.fromCharCode(resultado.valor));
                }
                else addMessage(resultado.valor - 48);
            }
            else addMessage(resultado.valor);
        }
        
        return -1;  
    }

}