var Regla2 = /** @class */ (function () {
    /**
     * CONSTRUCTOR DE LA CLASE
     * ESTA REGLA ELIMINA EL CODIGO ENTRE UN SALTO Y SU ETIQUETA
     * GOTO L1:
     * <CODIGO>
     * L1:
     * SIEMPRE Y CUANDO NO EXISTA UNA ETIQUETA DENTRO DE <CODIGO>
     * @param codigo
     */
    function Regla2(codigo) {
        this.codigo = codigo;
    }
    Regla2.prototype.optimizar = function () {
        for (var i = 0; i < this.codigo.length; i++) {
            var linea = this.codigo[i];
            linea = linea.trim();
            linea = linea.toLowerCase();
            if (linea.indexOf("goto") === 0 && linea.indexOf("if") === -1) {
                var etiqueta = linea.substring(4, linea.length);
                etiqueta = etiqueta.split(";")[0];
                etiqueta = etiqueta.trim();
                if (this.aplicar(etiqueta, i + 1)) {
                    addNewRegla(i, "Regla 2", "Se elimino: " + this.codigo[i]);
                    this.codigo.splice(i, 1);
                }
            }
        }
        return this.codigo;
    };
    Regla2.prototype.aplicar = function (etiqueta, index) {
        for (var i = index; i < this.codigo.length; i++) {
            var linea = this.codigo[i];
            linea = linea.toLowerCase();
            if (isComentario(linea))
                continue;
            if (isEtiqueta(linea)) {
                var temp = linea.split(";")[0];
                temp = linea.trim();
                if (temp === etiqueta + ":") {
                    var diferencia = i - index;
                    for (var j = 0; j < diferencia; j++) {
                        addNewRegla(index + j, "Regla 2", "Se elimino: " + this.codigo[index]);
                        this.codigo.splice(index, 1);
                    }
                    return true;
                }
                return false;
            }
        }
        return false;
    };
    return Regla2;
}());
