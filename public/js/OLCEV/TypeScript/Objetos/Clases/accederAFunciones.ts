
declare function getClase(id: any): any;
class accederAFunciones implements Instruccion {

    objeto: Instruccion;
    id: String;
    parametros: Array<Instruccion>;
    l: number;
    c: number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param objeto 
     * @param id 
     * @param parametros 
     * @param l 
     * @param c 
     */
    constructor(objeto: Instruccion, id: String, parametros: Array<Instruccion>, l: number, c: number) {
        this.objeto = objeto;
        this.id = id;
        this.parametros = parametros;
        this.l = l;
        this.c = c;
    }

    /**
     * METODO DE LA CLASE PADRE
     */
    ejecutar(entorno: Entorno): Object {
        let salida: Nodo = new Nodo([]);
        let valores: Array<Nodo> = [];
        let resultado: Object = this.objeto.ejecutar(entorno);
        if (resultado instanceof MensajeError) return resultado;

        let nodo: Nodo = resultado as Nodo;
        salida.codigo = salida.codigo.concat(nodo.codigo);

        if (nodo.tipo === Tipo.ID) {
            let clase: Clase = getClase(nodo.id);
            if (clase === null) {
                let mensaje: MensajeError = new MensajeError("Semantico", "La clase: " + nodo.id + " no existe", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }



            this.parametros.forEach(element => {
                let resultado: Object = element.ejecutar(entorno);
                if (resultado instanceof MensajeError) return resultado;
                let nodo: Nodo = resultado as Nodo;
                salida.codigo = salida.codigo.concat(nodo.codigo);
                if (nodo.tipo === Tipo.BOOLEAN) nodo = Aritmetica.arreglarBoolean(nodo, salida);
                valores.push(nodo);
            });

            let identificador: String = this.construirIdentificador(valores);
            let f: FuncionOLCEV = clase.entorno.buscarFuncion(identificador, []);

            if (f === null) {
                let mensaje: MensajeError = new MensajeError("Semantico", "No existe la funcion: " + this.id, entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }


            let temporal: String = Auxiliar.generarTemporal();
            let posicion: String = Auxiliar.generarTemporal();
            salida.codigo.push(temporal + " = " + nodo.resultado);
            salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño, "Simulacion de cambio de ambito"));
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0", "Posicion de this"));
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal, "Pasamos la posicion de this"));

            let i: number = 1; //Iniciamos en 1 porque el 0 es apartado para this
            valores.forEach(element => {
                let posicion: String = Auxiliar.generarTemporal();
                salida.codigo.push(posicion + " = P + " + i);
                salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado, "Valor del parametro: " + i));
                i++;
            });


            salida.codigo.push(Auxiliar.crearLinea("call " + identificador, "Llamamos a la funcion: " + this.id));

            if (f.tipo != Tipo.VOID) {
                let posicion: String = Auxiliar.generarTemporal();
                let temporal: String = Auxiliar.generarTemporal();
                salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + (f.tamaño - 1), "Posicion del retorno"));
                salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
                salida.resultado = temporal;
            }
            salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño, "Simulacion de cambio de ambito"));

            if (f.dimensiones > 0) {
                salida.tipo = Tipo.ARREGLO;
                salida.valor = new Arreglo(f.tipo, f.dimensiones);
            } else {
                salida.tipo = f.tipo;
                salida.valor = f.valor;
            }
            salida.id = f.valor.toString();

            return salida;

        }
        else {
            let mensaje: MensajeError = new MensajeError("Semantico", "No se puede acceder a los elementos de un tipo: " + Tipo[nodo.tipo], entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        return salida;
    }




    /**
     * ESTA CLASE NO TIENE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


    /**
    * METODO ENCARGADO DE REALIZAR
    * LA CONSTRUCCION
    * DEL IDENTIFICADOR DE LA FUNCION A LLAMAR
    */
    construirIdentificador(valores: Array<Nodo>): String {
        let identificador: String = this.id + "_";
        valores.forEach(element => {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    }
}