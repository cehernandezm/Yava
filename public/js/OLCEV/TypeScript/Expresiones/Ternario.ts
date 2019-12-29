class Ternario  implements Instruccion{
    condicion:Instruccion;
    verdadera:Instruccion;
    falsa:Instruccion;
    l:number;
    c:number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param condicion 
     * @param verdadera 
     * @param falsa 
     * @param l 
     * @param c 
     */
    constructor(condicion:Instruccion,verdadera:Instruccion,falsa:Instruccion,l:number,c:number){
        this.condicion = condicion;
        this.verdadera = verdadera;
        this.falsa = falsa;
        this.l = l;
        this.c = c;
    }






    /**
     * METODO DE LA CLASE PADRE
     * @param entorno Entorno actual
     */
    ejecutar(entorno: Entorno): Object {
        let resultado:Object = this.condicion.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let nodoCondicion:Nodo = resultado as Nodo;

        if(nodoCondicion.tipo != Tipo.BOOLEAN){
            let mensaje:MensajeError = new MensajeError("Semantico","Solo se aceptan condiciones, no se reconoce el tipo: " + Tipo[nodoCondicion.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        resultado = this.verdadera.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let izq:Nodo = resultado as Nodo;

        resultado = this.falsa.ejecutar(entorno);
        if(resultado instanceof MensajeError) return resultado;
        let der:Nodo = resultado as Nodo;

        if(!(Asignacion.casteoImplicito(izq.tipo,der.tipo))){
            let mensaje:MensajeError = new MensajeError("Semantico","No se puede regresar los tipos: " + Tipo[izq.tipo] + " y : " + Tipo[der.tipo],entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let salida:Nodo = new Nodo([]);
        let temporal:String = Auxiliar.generarTemporal();
        let s:String = Auxiliar.generarEtiqueta();
        salida.resultado = temporal;
        salida.tipo = izq.tipo;
        salida.codigo = salida.codigo.concat(nodoCondicion.codigo);
        salida.codigo.push(";################################# TERNARIO ##############################");
        nodoCondicion = Logica.arreglarBoolean(nodoCondicion,salida);
        salida.codigo.push(";############ VERDADERA #################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.verdaderas).codigo);
        salida.codigo = salida.codigo.concat(izq.codigo);
        if(izq.tipo === Tipo.BOOLEAN) izq = Aritmetica.arreglarBoolean(izq,salida);
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + izq.resultado,"Si es verdadero este sera su retorno"));
        salida.codigo.push(Auxiliar.saltoIncondicional(s));
        salida.codigo.push(";############## FALSA ##########");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(nodoCondicion.falsas).codigo);
        salida.codigo = salida.codigo.concat(der.codigo);
        if(der.tipo === Tipo.BOOLEAN) der = Aritmetica.arreglarBoolean(der,salida);
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + der.resultado,"Si es falsa este sera su retorno"));
        salida.codigo.push(s + ":");
        return salida;
    }    
    
    
    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        throw new Error("Method not implemented.");
    }


}