var Condicional = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param linea
     * @param l
     * @param c
     * @param operacion
     * @param izq
     * @param der
     * @param etiqueta
     * @param tipo
     */
    function Condicional(linea, l, c, operacion, izq, der, etiqueta, tipo) {
        this.posicion = linea;
        this.l = l;
        this.c = c;
        this.operacion = operacion;
        this.izq = izq;
        this.der = der;
        this.etiqueta = etiqueta;
        this.tipo = tipo;
    }
    Condicional.prototype.ejecutar = function (ambito) {
        var op1 = (this.izq == null) ? null : this.izq.ejecutar(ambito);
        var op2 = (this.der == null) ? null : this.der.ejecutar(ambito);
        if (op1 != null && op2 != null) {
            if (!(op1 instanceof MensajeError) && !(op2 instanceof MensajeError)) {
                var etiqueta = buscarEtiqueta(this.etiqueta);
                if (etiqueta != null) {
                    switch (this.operacion) {
                        case "==":
                            if (this.controlarFlujo(op1.valor === op2.valor))
                                return etiqueta.posicion;
                            break;
                        case "!=":
                            if (this.controlarFlujo(op1.valor != op2.valor))
                                return etiqueta.posicion;
                            break;
                        case ">":
                            if (this.controlarFlujo(op1.valor > op2.valor))
                                return etiqueta.posicion;
                            break;
                        case "<":
                            if (this.controlarFlujo(op1.valor < op2.valor))
                                return etiqueta.posicion;
                            break;
                        case ">=":
                            if (this.controlarFlujo(op1.valor >= op2.valor))
                                return etiqueta.posicion;
                            break;
                        case "<=":
                            if (this.controlarFlujo(op1.valor <= op2.valor))
                                return etiqueta.posicion;
                            break;
                    }
                }
                else
                    addMensajeError("Semantico", "No existe la etiqueta: " + this.etiqueta, this.l, this.c);
            }
        }
        return -1;
    };
    /**
     * METODO QUE SE ENCARGA DE CONTROLAR SI ES IF O IFELSE
     * @param condicion
     */
    Condicional.prototype.controlarFlujo = function (condicion) {
        if (this.tipo === 0)
            return condicion;
        return !condicion;
    };
    return Condicional;
}());
