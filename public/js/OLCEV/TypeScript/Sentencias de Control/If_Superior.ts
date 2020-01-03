class If_Superior implements Instruccion{
    lista:Array<If>;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param lista 
     */
    constructor(lista:Array<If>){
        this.lista = lista;
    }
    
    
    
    
    
    
    
    
    
    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);

        this.lista.forEach(element => {
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
        salida.saltos = [];
        return salida;
    }    
    
    /**
     * LA PRIMERA PASADA OBTIENE
     * TODOS LOS TAMAÑOS DE LOS IF
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