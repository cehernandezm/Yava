var Regla3 = /** @class */ (function () {
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
    function Regla3(codigo) {
        this.codigo = codigo;
    }
    Regla3.prototype.optimizar = function () {
        for (var i = 0; i < this.codigo.length; i++) {
            var linea = this.codigo[i].toLowerCase();
            linea = linea.split(";")[0];
            linea = linea.trim();
            if (linea.indexOf("if") === 0) {
                if (this.codigo[i + 1].indexOf("goto") !== -1) {
                    var falsa = this.codigo[i + 1].substring(4, this.codigo[i + 1].length);
                    falsa = falsa.split(";")[0].trim();
                    var verdadera = linea.substring(linea.indexOf("goto") + 4, linea.length);
                    verdadera = verdadera.trim();
                    var condicion = linea.substring(linea.indexOf("if") + 2, linea.indexOf("goto"));
                    condicion = condicion.trim();
                    var simbolo = this.getSimbolo(condicion);
                    var izquierda = this.operadorIzq(condicion, simbolo);
                    var derecha = this.operadorDer(condicion, simbolo);
                    if (!isNaN(+izquierda) && !isNaN(+derecha)) {
                        if (simbolo === "==") {
                            if (+izquierda === +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                        else if (simbolo === "!=") {
                            if (+izquierda !== +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                        else if (simbolo === ">") {
                            if (+izquierda > +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                        else if (simbolo === "<") {
                            if (+izquierda < +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                        else if (simbolo === ">=") {
                            if (+izquierda >= +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                        else if (simbolo === "<=") {
                            if (+izquierda <= +derecha) {
                                addNewRegla(i, "Regla 3", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + verdadera;
                            }
                            else {
                                addNewRegla(i, "Regla 4", "Se sustituyo: " + this.codigo[i]);
                                this.codigo[i] = "goto " + falsa;
                            }
                            this.codigo.splice(i + 1, 1);
                        }
                    }
                }
            }
        }
        return this.codigo;
    };
    Regla3.prototype.operadorIzq = function (linea, simbolo) {
        return linea.split(simbolo)[0].trim();
    };
    Regla3.prototype.operadorDer = function (linea, simbolo) {
        return linea.split(simbolo)[1].trim();
    };
    Regla3.prototype.getSimbolo = function (linea) {
        if (linea.indexOf("==") !== -1)
            return "==";
        if (linea.indexOf(">") !== -1)
            return ">";
        if (linea.indexOf("<") !== -1)
            return "<";
        if (linea.indexOf(">=") !== -1)
            return ">=";
        if (linea.indexOf("<=") !== -1)
            return "<=";
        if (linea.indexOf("!=") !== -1)
            return "!=";
    };
    return Regla3;
}());
