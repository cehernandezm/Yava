var Regla4 = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA LAS ASIGNACIONES:
     * T1 = T1 + 0
     * T1 = 0 + t1
     * SIEMPRE Y CUANDO T1 NO CAMBIE DE VALOR Y NO EXISTA
     * UNA ETIQUETA ENTRE AMBAS ASIGNACIONES
     * @param codigo
     */
    function Regla4(codigo) {
        this.codigo = codigo;
    }
    Regla4.prototype.optimizar = function () {
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
                    console.log(operacion);
                    var der = operacion.split(simbolo)[1].trim();
                    if ((izq === temporal && der === "0") || (der === temporal && izq === "0")) {
                        addNewRegla(i, "Regla 5", "Se elimina la instruccion: " + this.codigo[i]);
                        this.codigo.splice(i, 1);
                    }
                }
            }
        }
        return this.codigo;
    };
    return Regla4;
}());
