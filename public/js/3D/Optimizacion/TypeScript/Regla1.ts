declare function isComentario(linea:String):Boolean;
declare function isOperacion(linea:String):Boolean;
declare function isEtiqueta(linea:String):Boolean;
declare function limpiarTemporal(linea:String):String;
declare function addNewRegla(linea:any, tipo:any, detalle:any);
class Regla1{
    codigo:Array<String>;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param codigo 
     */
    constructor(codigo:Array<String>){
        this.codigo = codigo;
    }


    optimizar():Array<String>{
        for(let i = 0; i < this.codigo.length; i++){
            let element:String = this.codigo[i];
            if(isComentario(element) || !isOperacion(element)) continue;
            else if(element === "\n" || element === " " || element === "") continue;
            else{
                if(element.indexOf("+") === -1 && element.indexOf("-") === -1 && element.indexOf("*") === -1 && element.indexOf("/") === -1 && element.indexOf("%") === -1 && element.toLowerCase().indexOf("heap") === -1 && element.toLowerCase().indexOf("stack")  === -1){
                    let operadorIzq:String = element.split("=")[0].trim();
                    let operadorDer:String = limpiarTemporal(element.split("=")[1]);
                    this.aplicarRegla(operadorIzq,operadorDer,i + 1);
                }
            }
            
        }
        return this.codigo;
    }



    aplicarRegla(izquierdo,derecho,index){
        for(let i = index; i < this.codigo.length; i++){
            let element:String = this.codigo[i];
            if(element === "\n" || element === " " || element === "") continue;
            else if(isComentario(element)) continue;
            else if(isEtiqueta(element)) return;
            else if(!isOperacion(element)) continue;
        
            else{
                if(element.indexOf("+") === -1 && element.indexOf("-") === -1 && element.indexOf("*") === -1 && element.indexOf("/") === -1 && element.indexOf("%") === -1 && element.toLowerCase().indexOf("heap") === -1 && element.toLowerCase().indexOf("stack")  === -1){
                    let operadorIzq:String = element.split("=")[0].trim();
                    let operadorDer:String = limpiarTemporal(element.split("=")[1]);
                    if(operadorIzq === derecho && operadorDer === izquierdo) {
                        addNewRegla(i,"Regla 1","Se elimino: " + element);
                        this.codigo.splice(i,1); // a = b y b = c eliminamos b =  c;
                    }
                }
                else{
                    let temporal:String = element.split("=")[0];
                    temporal = temporal.trim();
                    if(temporal === izquierdo) return; // Rompemos la regla ya que el operador izquierdo esta cambiando de valor
                }
            }
        }
    }

}