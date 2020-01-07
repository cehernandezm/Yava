declare function isComentario(linea: String): Boolean;
declare function isOperacion(linea: String): Boolean;
declare function isEtiqueta(linea: String): Boolean;
declare function limpiarTemporal(linea: String): String;
declare function addNewRegla(linea: any, tipo: any, detalle: any);
class Regla3 {
    codigo: Array<String>;

    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA SI SE UTILIZAN CONSTANTES 
     * Y SU RESULTADO ES VERDADERA SE LIMINA LA CONDICION
     * Y SE SUSTITUYE POR UN SALTO INCONDICIONAL
     * FALSO O VERDADERO
     * 
     * REGLA 3  Y 4
     * 
     * @param codigo 
     */
    constructor(codigo: Array<String>) {
        this.codigo = codigo;
    }


    optimizar(): Array<String> {
        for(let i = 0; i < this.codigo.length; i++){
            let linea = this.codigo[i].toLowerCase();
            linea = linea.split(";")[0];
            linea = linea.trim();
            if(linea.indexOf("if") === 0){
                if(this.codigo[i + 1].indexOf("goto") !== -1){
                    let falsa:String = this.codigo[i + 1].substring(4,this.codigo[i + 1].length);
                    falsa = falsa.split(";")[0].trim();
                    let verdadera:String = linea.substring(linea.indexOf("goto") + 4,linea.length);
                    verdadera = verdadera.trim();
                    let condicion:String = linea.substring(linea.indexOf("if") + 2,linea.indexOf("goto"));
                    condicion = condicion.trim();
                    let simbolo:any = this.getSimbolo(condicion);
                    let izquierda:String = this.operadorIzq(condicion,simbolo);
                    let derecha:String = this.operadorDer(condicion,simbolo);
                    if(!isNaN(+izquierda) && !isNaN(+derecha)){
                        if(simbolo === "=="){
                            if(+izquierda === +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }else if(simbolo === "!="){
                            if(+izquierda !== +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }else if(simbolo === ">"){
                            if(+izquierda > +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }else if(simbolo === "<"){
                            if(+izquierda < +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }else if(simbolo === ">="){
                            if(+izquierda >= +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }else if(simbolo === "<="){
                            if(+izquierda <= +derecha) {
                                addNewRegla(i,"Regla 3","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else{
                                addNewRegla(i,"Regla 4","Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1,1);

                        }
                    }

                    
                }
            }
        }
        return this.codigo;
    }

    operadorIzq(linea:String,simbolo:string){
        return linea.split(simbolo)[0].trim();
    }

    operadorDer(linea:String,simbolo:string){
        return linea.split(simbolo)[1].trim();
    }

    getSimbolo(linea:String):String{
        if(linea.indexOf("==") !== -1) return "==";
        if(linea.indexOf(">") !== -1) return ">";
        if(linea.indexOf("<") !== -1) return "<";
        if(linea.indexOf(">=") !== -1) return ">=";
        if(linea.indexOf("<=") !== -1) return "<=";
        if(linea.indexOf("!=") !== -1) return "!=";
    }


}