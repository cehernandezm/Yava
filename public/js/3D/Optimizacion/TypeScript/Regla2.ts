declare function isComentario(linea: String): Boolean;
declare function isOperacion(linea: String): Boolean;
declare function isEtiqueta(linea: String): Boolean;
declare function limpiarTemporal(linea: String): String;
declare function addNewRegla(linea: any, tipo: any, detalle: any);
class Regla2 {
    codigo: Array<String>;

    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA EL CODIGO ENTRE UN SALTO Y SU ETIQUETA
     * GOTO L1:
     * <CODIGO>
     * L1:
     * SIEMPRE Y CUANDO NO EXISTA UNA ETIQUETA DENTRO DE <CODIGO>
     * @param codigo 
     */
    constructor(codigo: Array<String>) {
        this.codigo = codigo;
    }


    optimizar(): Array<String> {
        for (let i = 0; i < this.codigo.length; i++) {
            let linea: String = this.codigo[i];
            linea = linea.trim();
            linea = linea.toLowerCase();
            if (linea.indexOf("goto") === 0 && linea.indexOf("if") === -1) {
                let etiqueta: String = linea.substring(4, linea.length);
                etiqueta = etiqueta.split(";")[0];
                etiqueta = etiqueta.trim();
                if (this.aplicar(etiqueta, i + 1)) {
                    addNewRegla(i, "Regla 2", "Se elimino: " + this.codigo[i]);
                    this.codigo.splice(i, 1);
                }
            }
        }
        return this.codigo;
    }


    aplicar(etiqueta, index): Boolean {
        for (let i = index; i < this.codigo.length; i++) {
            let linea: String = this.codigo[i];
            linea = linea.toLowerCase();
            if (isComentario(linea)) continue;
            if (isEtiqueta(linea)) {
                let temp: String = linea.split(";")[0];
                temp = linea.trim();
                if (temp === etiqueta + ":") {
                    let diferencia = i - index;
                    for (let j = 0; j < diferencia; j++) {
                        addNewRegla(index + j, "Regla 2", "Se elimino: " + this.codigo[index]);
                        this.codigo.splice(index, 1);
                    }
                    return true;
                }
                return false;
            }
        }
        return false;
    }

}