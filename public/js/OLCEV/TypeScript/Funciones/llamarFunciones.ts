class llamarFunciones implements Instruccion{

    id:String;
    objeto:Instruccion;
    parametros:Array<Instruccion>
    l:number;
    c:number;

    /**
     * CONSTRUCTOR DE LA CLASE
     * @param id 
     * @param objeto 
     * @param parametro 
     * @param l 
     * @param c 
     */
    constructor(id:String,objeto:Instruccion,parametro:Array<Instruccion>,l:number,c:number)
    {
        this.id = id;
        this.objeto = objeto;
        this.parametros = parametro;
        this.l = l;
        this.c = c;
    }

    ejecutar(entorno: Entorno): Object {
        let salida:Nodo = new Nodo([]);
        let valores:Array<Nodo> = [];

        
        this.parametros.forEach(element => {
            let resultado:Object = element.ejecutar(entorno);
            if(resultado instanceof MensajeError) return resultado;
            let nodo:Nodo = resultado as Nodo;
            salida.codigo = salida.codigo.concat(nodo.codigo);
            if(nodo.tipo === Tipo.BOOLEAN) nodo = Aritmetica.arreglarBoolean(nodo,salida);
            valores.push(nodo);
        });

        let identificador:String = this.construirIdentificador(valores);
        let f:FuncionOLCEV = entorno.buscarFuncion(identificador,[]);
        

        if(f === null){
            let mensaje:MensajeError = new MensajeError("Semantico","No existe la funcion: " + this.id,entorno.archivo,this.l,this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }
        let temporal:String = Auxiliar.generarTemporal();
        let posicion:String = Auxiliar.generarTemporal();
        salida.codigo.push(temporal + " = P + 0");
        salida.codigo.push(temporal + " = Stack[" + temporal + "]");
        salida.codigo.push(Auxiliar.crearLinea("P = P + " + entorno.tamaño,"Simulacion de cambio de ambito"));
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 0","Posicion de this"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + temporal,"Pasamos la posicion de this"));
        
        let i:number = 1; //Iniciamos en 1 porque el 0 es apartado para this
        valores.forEach(element => {
            let posicion:String = Auxiliar.generarTemporal();
            salida.codigo.push(posicion + " = P + " + i);
            salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + element.resultado,"Valor del parametro: " + i));
            i++;
        });
        if(f.override === 1) salida.codigo.push(Auxiliar.crearLinea("call override_" + identificador,"Llamamos a la funcion: " + this.id));
        else salida.codigo.push(Auxiliar.crearLinea("call " + identificador,"Llamamos a la funcion: " + this.id));

        if(f.tipo != Tipo.VOID){
            let posicion:String = Auxiliar.generarTemporal();
            let temporal:String = Auxiliar.generarTemporal();
            salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + " + (f.tamaño - 1),"Posicion del retorno"));
            salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]","Obtenemos el valor del retorno"));
            salida.resultado = temporal;
        }
        salida.codigo.push(Auxiliar.crearLinea("P = P - " + entorno.tamaño,"Simulacion de cambio de ambito"));
        
        if(f.dimensiones > 0){
            salida.tipo = Tipo.ARREGLO;
            salida.valor = new Arreglo(f.tipo,f.dimensiones);
        }else {
            salida.tipo = f.tipo;
            salida.valor = f.valor;
        }
        salida.id = f.valor.toString();
        return salida;
    }    
    
    /**
     * METODO ENCARGADO DE REALIZAR
     * LA CONSTRUCCION
     * DEL IDENTIFICADOR DE LA FUNCION A LLAMAR
     */
    construirIdentificador(valores:Array<Nodo>):String{
        let identificador:String = this.id + "_";
        valores.forEach(element => {
            identificador += Tipo[element.tipo] + "_";
        });
        return identificador;
    }

    
    /**
     * ESTA CLASE NO POSEE PRIMERA PASADA
     * @param entorno 
     */
    primeraPasada(entorno: Entorno): Object {
        return 0;
    }


}