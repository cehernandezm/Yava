declare function isComentario(linea:String):Boolean;
declare function isOperacion(linea:String):Boolean;
declare function isEtiqueta(linea:String):Boolean;
declare function limpiarTemporal(linea:String):String;
declare function addNewRegla(linea:any, tipo:any, detalle:any);
class Regla6 {
    codigo: Array<String>;

    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA LAS ASIGNACIONES:
     * T1 = Tx + 0
     * T1 = 0 + tx
     * t1 = tx

     * @param codigo 
     */
    constructor(codigo: Array<String>) {
        this.codigo = codigo;
    }


    optimizar(): Array<String> {
        for (let i = 0; i < this.codigo.length; i++) {
            let element: String = this.codigo[i];
            if (isComentario(element) || !isOperacion(element)) continue;
            else if (element === "\n" || element === " " || element === "") continue;
            else {
                if(element.toLowerCase().indexOf("stack") != -1 || element.toLowerCase().indexOf("heap")) continue;
                if (element.indexOf("+") !== -1 || element.indexOf("-") ) {
                    let temporal: String = element.split("=")[0].trim();
                    let operacion: String = limpiarTemporal(element.split("=")[1]);
                    let simbolo:any = (operacion.indexOf("+") !== -1) ? "+" : "-";
                    let izq:String = operacion.split(simbolo)[0].trim();
                    let der:String = operacion.split(simbolo)[1].trim();
                    if(der === "0"){
                        addNewRegla(i,"Regla 6","Se sustituye la instruccion: " + this.codigo[i]);
                        this.codigo[i] = temporal + " = " + izq;
                    }
                    else if(izq === "0"){
                        addNewRegla(i,"Regla 6","Se sustituye la instruccion: " + this.codigo[i]);
                        this.codigo[i] = temporal + " = -" + der;
                    }
                }
            }

        }
        return this.codigo;
    }
}