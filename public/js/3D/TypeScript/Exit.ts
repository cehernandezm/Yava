class Exit {
    numero: any;
    l: number;
    c: number;
    posicion: number;


    constructor(numero: any, l: number, c: number, posicion: number) {
        this.numero = numero;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }



    ejecutar(ambito: Ambito) {
        let resultado:any = (this.numero == null) ? null : this.numero.ejecutar(ambito);
        if(resultado instanceof MensajeError) return resultado;
        let opcion = resultado.valor;
        if (opcion === 0) {
            if (ambito.cadena === null) {
                addMensajeError("Semantico", "No se ha escrito nada un en un archivo", this.l, this.c);
                return new MensajeError("", "", 0, 0);
            }
            let filename: any = "file.txt";
            let filetype: any = "text/plain";

            var a:any = document.createElement("a");
            let dataURI = "data:" + filetype +
                ";base64," + btoa(ambito.cadena as string);
            a.href = dataURI;
            a['download'] = filename;
            var e = document.createEvent("MouseEvents");
            // Use of deprecated function to satisfy TypeScript.
            e.initMouseEvent("click", true, false,
                document.defaultView, 0, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            a.dispatchEvent(e);
            a.removeNode();
            ambito.cadena = null;
        }
        else if(opcion === 1){
            addMensajeError("Semantico","IndexOutofbounds Exception",this.l,this.c);
            return new MensajeError("", "", 0, 0);
            
        }
        else if(opcion === 2){
            console.log("error");
            addMensajeError("Semantico","NullException",this.l,this.c);
            return new MensajeError("", "", 0, 0);
            
        }

        return -1;
    }
}