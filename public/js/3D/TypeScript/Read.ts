class Read {
    variable: any;
    posHeap: any;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param variable 
     * @param posHeap 
     * @param l 
     * @param c 
     */
    constructor(variable: any, posHeap: any, l: number, c: number) {
        this.variable = variable;
        this.posHeap = posHeap;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO QUE SE ENCARGARA DE EJECUTAR TODO;
     */
    ejecutar(ambito: Ambito) {
        let pos1: any = this.variable.ejecutar(ambito);
        let pos2: any = (this.posHeap == null) ? null : this.posHeap.ejecutar(ambito);

        //------------------------------------------------ Si no existe la posicion en el stack --------------------------------------
        let indiceStack = ambito.getValueStack(pos1.valor);
        if (indiceStack === null) {
            addMensajeError("Semantico", "No existe esta posicion: " + pos1.valor + " en el Stack", this.l, this.c);
            return -1;
        }
        //------------------------------------ Es una Cadena ------------------------------------
        if (pos2 != null) {
            let cadena: String = prompt("Ingrese el valor solicitado");
            if (cadena != null) {
                ambito.setValueStack(pos1.valor,{tipo : "heap", valor: H});
                let indiceHeap = ambito.getHeap(pos2.valor);
                //------------------------------------------------- Si no existe la posicion en el Heap --------------------------
                if(indiceHeap === null){
                    addMensajeError("Semantico", "No existe esta posicion en Heap " + pos2.valor, this.l, this.c);
                    return -1;
                }

                for(let i = 0; i < cadena.length; i++){
                    ambito.setValueHeap(H,{ tipo: "number", valor: cadena.charCodeAt(i) });
                    H++;
                    ambito.incrementarEspacioHeap();
                }
                ambito.setValueHeap(H,{tipo:"number",valor:0});
                H++;
                ambito.incrementarEspacioHeap();
            }
            else addMensajeError("Semantico", "Se necesita que ingrese una cadena", this.l, this.c);
        }
        //----------------------------------------- ENTEROS DECIMALES O CARACTERES-------------------------------------
        else {


            let valorUsuario = prompt("Ingrese el valor solicitado");
            if (valorUsuario != null) {
                let numero = isNaN(+valorUsuario);
                //---------------------------- Significa que es un numero ---------------------------
                if (numero == false) ambito.setValueStack(pos1.valor, { tipo: "number", valor: +valorUsuario });
                //--------------------------- ES UN CARACTER ---------------------------------------
                else {
                    if (valorUsuario.length === 1) ambito.setValueStack(pos1.valor, { tipo: "number", valor: valorUsuario.charCodeAt(0) });

                    else listaSalida.push(new MensajeError("Semantico", "Se esperaba un caracter no se reconoce: " + valorUsuario, this.l, this.c));
                }
            }
            else listaSalida.push(new MensajeError("Semantico", "Se necesita que se ingrese un valor", this.l, this.c));

        }


        return -1;
    }


}