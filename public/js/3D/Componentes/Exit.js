var Exit = /** @class */ (function () {
    function Exit(numero, l, c, posicion) {
        this.numero = numero;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }
    Exit.prototype.ejecutar = function (ambito) {
        var resultado = (this.numero == null) ? null : this.numero.ejecutar(ambito);
        if (resultado instanceof MensajeError)
            return resultado;
        var opcion = resultado.valor;
        if (opcion === 0) {
            if (ambito.cadena === null) {
                addMensajeError("Semantico", "No se ha escrito nada un en un archivo", this.l, this.c);
                return new MensajeError("", "", 0, 0);
            }
            var filename = "file.txt";
            var filetype = "text/plain";
            var a = document.createElement("a");
            var dataURI = "data:" + filetype +
                ";base64," + btoa(ambito.cadena);
            a.href = dataURI;
            a['download'] = filename;
            var e = document.createEvent("MouseEvents");
            // Use of deprecated function to satisfy TypeScript.
            e.initMouseEvent("click", true, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            a.removeNode();
            ambito.cadena = null;
        }
        else if (opcion === 1) {
            addMensajeError("Semantico", "IndexOutofbounds Exception", this.l, this.c);
            return new MensajeError("", "", 0, 0);
        }
        else if (opcion === 2) {
            console.log("error");
            addMensajeError("Semantico", "NullException", this.l, this.c);
            return new MensajeError("", "", 0, 0);
        }
        return -1;
    };
    return Exit;
}());
