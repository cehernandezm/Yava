declare function analizarImport(direccion: String): any;
declare let GramaticaOLCEV: any;
class Import implements Instruccion {

    direccion: String;
    l: number;
    c: number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param direccion 
     * @param l 
     * @param c 
     */
    constructor(direccion: String, l: number, c: number) {
        this.direccion = direccion;
        this.l = l;
        this.c = c;
    }


    /**
     * METODO DE LA CLASE PADRE
     * @param entorno 
     */
    ejecutar(entorno: Entorno): Object {
        this.direccion = this.direccion.substring(1, this.direccion.length - 1)
        let resultado: any = analizarImport(this.direccion);
        if (resultado.error === false) {
            let codigo: String = resultado.codigo;
            GramaticaOLCEV.parse(codigo);
            let analizar = GramaticaOLCEV.arbol.raiz;

            let salida: Nodo = new Nodo([]);
            let instrucciones:Array<Instruccion> = (analizar as Analizar).instrucciones;
            instrucciones.forEach(clase => {
                let entorno: Entorno = new Entorno(this.direccion);
                if (clase instanceof Import) {
                    let resultado: Object = clase.ejecutar(entorno);
                    if (resultado instanceof MensajeError) return resultado;
                    let res: Nodo = resultado as Nodo;
                    salida.codigo = salida.codigo.concat(res.codigo);

                }
                if (clase instanceof Clase) {
                    clase.flagMain = 1;
                    let resultado: Object = clase.primeraPasada(entorno);
                    if (!(resultado instanceof MensajeError)) {
                        let res: Nodo = resultado as Nodo;
                        salida.codigo = salida.codigo.concat(res.codigo);
                    }
                    else return resultado;
                }
            });
            return salida;
        }
        let mensaje: MensajeError = new MensajeError("Semantico", "El archivo: " + this.direccion + " no existe", entorno.archivo, this.l, this.c);
        Auxiliar.agregarError(mensaje);
        return mensaje;
    }

    /**
     * ESTE METODO NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }



}