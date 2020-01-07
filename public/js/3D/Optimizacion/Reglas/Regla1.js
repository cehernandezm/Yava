var Regla1 = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA LAS ASIGNACIONES:
     * T1 = T4
     * T4 = T1
     * SIEMPRE Y CUANDO T1 NO CAMBIE DE VALOR Y NO EXISTA
     * UNA ETIQUETA ENTRE AMBAS ASIGNACIONES
     * @param codigo
     */
    function Regla1(codigo) {
        this.codigo = codigo;
    }
    Regla1.prototype.optimizar = function () {
        for (var i = 0; i < this.codigo.length; i++) {
            var element = this.codigo[i];
            if (isComentario(element) || !isOperacion(element))
                continue;
            else if (element === "\n" || element === " " || element === "")
                continue;
            else {
                if (element.indexOf("+") === -1 && element.indexOf("-") === -1 && element.indexOf("*") === -1 && element.indexOf("/") === -1 && element.indexOf("%") === -1 && element.toLowerCase().indexOf("heap") === -1 && element.toLowerCase().indexOf("stack") === -1) {
                    var operadorIzq = element.split("=")[0].trim();
                    var operadorDer = limpiarTemporal(element.split("=")[1]);
                    this.aplicarRegla(operadorIzq, operadorDer, i + 1);
                }
            }
        }
        return this.codigo;
    };
    Regla1.prototype.aplicarRegla = function (izquierdo, derecho, index) {
        for (var i = index; i < this.codigo.length; i++) {
            var element = this.codigo[i];
            if (element === "\n" || element === " " || element === "")
                continue;
            else if (isComentario(element))
                continue;
            else if (isEtiqueta(element))
                return;
            else if (!isOperacion(element))
                continue;
            else {
                if (element.indexOf("+") === -1 && element.indexOf("-") === -1 && element.indexOf("*") === -1 && element.indexOf("/") === -1 && element.indexOf("%") === -1 && element.toLowerCase().indexOf("heap") === -1 && element.toLowerCase().indexOf("stack") === -1) {
                    var operadorIzq = element.split("=")[0].trim();
                    var operadorDer = limpiarTemporal(element.split("=")[1]);
                    if (operadorIzq === derecho && operadorDer === izquierdo) {
                        addNewRegla(i, "Regla 1", "Se elimino: " + element);
                        this.codigo.splice(i, 1); // a = b y b = c eliminamos b =  c;
                    }
                }
                else {
                    var temporal = element.split("=")[0];
                    temporal = temporal.trim();
                    if (temporal === izquierdo)
                        return; // Rompemos la regla ya que el operador izquierdo esta cambiando de valor
                }
            }
        }
    };
    return Regla1;
}());
