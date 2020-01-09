class Switch implements Instruccion{
    lista:Array<Case>;
    condicion:Instruccion;
    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista 
     */
    constructor(condicion:Instruccion,lista:Array<Case>){
        this.condicion = condicion;
        this.lista = lista;
    }
    
    
    
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);
        let resul = this.condicion.ejecutar(entorno);
        if(resul instanceof MensajeError) return resul;
        let nodoCon:Nodo = resul as Nodo;

        salida.codigo = salida.codigo.concat(nodoCon.codigo);
        if(nodoCon.tipo === Tipo.BOOLEAN) nodoCon = Aritmetica.arreglarBoolean(nodoCon,salida);

        this.lista.forEach(element => {
            element.comparar = nodoCon;
            let resultado:Object = element.ejecutar(entorno);
            if(resultado instanceof MensajeError) return resultado;
            let nodo:Nodo = resultado as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.continue = salida.continue.concat(nodo.continue);
            salida.retornos = salida.retornos.concat(nodo.retornos);
            if(nodo.retornos.length > 0){
                salida.tipo = nodo.tipo;
                salida.valor = nodo.valor;
            }
        });

        salida.codigo.push(";##################### SALTOS DE SALIDA ###############");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.saltos).codigo);
        salida.codigo.push(";##################### SALTOS DE BREAK ###############");
        salida.codigo = salida.codigo.concat(Auxiliar.escribirEtiquetas(salida.breaks).codigo);
        salida.saltos = [];
        salida.breaks = [];
        return salida;
    }    
    
    /**
     * LA PRIMERA PASADA OBTIENE
     * TODOS LOS TAMAÑOS DE LOS CASE
     * Y LOS RETORNA A UN PADRE
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        let i:number = 0;
        this.lista.forEach(element => {
            let x:number = +element.primeraPasada(entorno);
            i += x;
        });
        return i;
    }
}