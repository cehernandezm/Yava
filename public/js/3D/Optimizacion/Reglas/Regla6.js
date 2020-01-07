var Regla6 = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA LAS ASIGNACIONES:
     * T1 = Tx + 0
     * T1 = 0 + tx
     * t1 = tx

     * @param codigo
     */
    function Regla6(codigo) {
        this.codigo = codigo;
    }
    Regla6.prototype.optimizar = function () {
        for (var i = 0; i < this.codigo.length; i++) {
            var element = this.codigo[i];
            if (isComentario(element) || !isOperacion(element))
                continue;
            else if (element === "\n" || element === " " || element === "")
                continue;
            else {
                if (element.toLowerCase().indexOf("stack") != -1 || element.toLowerCase().indexOf("heap"))
                    continue;
                if (element.indexOf("+") !== -1 || element.indexOf("-")) {
                    var temporal = element.split("=")[0].trim();
                    var operacion = limpiarTemporal(element.split("=")[1]);
                    var simbolo = (operacion.indexOf("+") !== -1) ? "+" : "-";
                    var izq = operacion.split(simbolo)[0].trim();
                    var der = operacion.split(simbolo)[1].trim();
                    if (der === "0") {
                        addNewRegla(i, "Regla 6", "Se sustituye la instruccion: " + this.codigo[i]);
                        this.codigo[i] = temporal + " = " + izq;
                    }
                    else if (izq === "0") {
                        addNewRegla(i, "Regla 6", "Se sustituye la instruccion: " + this.codigo[i]);
                        this.codigo[i] = temporal + " = -" + der;
                    }
                }
            }
        }
        return this.codigo;
    };
    return Regla6;
}());
