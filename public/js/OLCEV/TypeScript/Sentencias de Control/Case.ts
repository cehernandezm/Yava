class Case implements Instruccion{
    condicion: Instruccion;
    comparar:Nodo;
    cuerpo: Array<Instruccion>;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param condicion 
     * @param cuerpo 
     * @param l 
     * @param c 
     */
    constructor(condicion: Instruccion, cuerpo: Array<Instruccion>, l: number, c: number) {
        this.condicion = condicion;
        this.cuerpo = cuerpo;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let nuevo: Entorno = Auxiliar.clonarEntorno(entorno);
        nuevo.localizacion = Localizacion.STACK;
        let salida: Nodo = new Nodo([]);
        let v = [];
        let f = [];
        if (this.condicion != null) {
            let resultado: Object = this.condicion.ejecutar(entorno);
            if (resultado instanceof MensajeError) return resultado;

            let nodo: Nodo = resultado as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            let result:Object = Relacional.comparacionComplicada(salida,nodo,this.comparar,entorno,this.l,this.c,"==");
            if(result instanceof MensajeError) return result;
            
            let nodoResult:Nodo = result as Nodo;
            v = nodoResult.verdaderas;
            f = nodoResult.falsas;
        }

        salida.codigo.push(";######################## VERDADERAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(v).codigo);

        this.cuerpo.forEach(element => {
            let result = element.ejecutar(nuevo);
            if (result instanceof MensajeError) return result;
            let temp: Nodo = result as Nodo;
            salida.codigo = salida.codigo.concat(temp.codigo);
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            salida.continue = salida.continue.concat(temp.continue);
            salida.retornos = salida.retornos.concat(temp.retornos);
        });
        salida.codigo.push(";######################## FALSAS ####################");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(f).codigo);

        return salida;
    }

    /**
     * PRIMERA PASADO
     * PASAMOS OBTENIENDO EL TAMAÑO DEL IF
     * @param entorno ENTORNO ACTUAL
     */
    primeraPasada(entorno: Entorno): Object {
        let i: number = 0;
        this.cuerpo.forEach(element => {
            let x: number = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    }
}