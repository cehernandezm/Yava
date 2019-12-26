
class Asignacion3D {
    izq: any;
    der: any;
    operacion: String;
    temporal: String;
    posicion: number;
    l: number;
    c: number;


    /**
     * CONSTRUCTOR DE LA CLASE
     * @param izq OPERANDO IZQ
     * @param der OPERANDO DER
     * @param operacion TIPO DE OPEACION
     * @param temporal TEMPORAL|HEAP|H|STACK|
     * @param l LINEA
     * @param c COLUMNA
     * @param posicion POSICION EN EL ARREGLO DE INSTRUCCIONES
     */
    constructor(izq:any, der:any, operacion:String, temporal:String, l:number, c:number, posicion:number) {
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
        this.temporal = temporal;
        this.l = l;
        this.c = c;
        this.posicion = posicion;
    }

    ejecutar(ambito: Ambito) {
        var op1: Object = (this.izq == null) ? null : this.izq.ejecutar(ambito);;
        var op2: Object = (this.der == null) ? null : this.der.ejecutar(ambito);
        //-------------------------------------- PRIMERA VALIDACION DE ERRORES ------------------------------------------
        if (op1 instanceof MensajeError || op2 instanceof MensajeError) return -1;



        switch (this.temporal) {
            case "heap": return this.controlHeap(op1,op2,ambito);
            case "stack": return this.controlStack(op1,op2,ambito);
            case "h" : return this.controlH(op1,op2,ambito);
            case "p" : return this.controlP(op1,op2,ambito);
            default: return this.controlTemporal(op1, op2,ambito);
        }



        return -1;
    }


    /**
     * METODO QUE SE ENCARGARA DE REALIZAR LAS OPERACIONES SOBRE LOS TEMPORALES
     * @param op1 VALOR|HEAP|STACK|H|TEMPORAL|
     * @param op2 VALOR|H
     */
    controlTemporal(op1:any, op2:any, ambito: Ambito) {
        //--------------------------------------------- SI EL VALOR ESTA EN EL HEAP ------------------------------------------------------
        if(op1.tipo === "heap"){
            if(op2 != null){
                if(op2.tipo === "number" || op2.tipo == "h"){
                    let valorTemp = ambito.getHeap(op2.valor);
                    //---------------------------------- Si encuentra el valor entonces op1 obtendra ese valor y op2 sera null (Solo se puede realizar asignaciones);
                    if(valorTemp != null){
                        op1 = valorTemp;
                        op2 = null;
                    }
                    else {
                        addMensajeError("Semantico", "No se encontro la posicion: " + op2.valor + " en el Heap", this.l, this.c);
                        return -1;
                    }
                }
                else {
                    addMensajeError("Semantico", "Se necesita una posicion para acceder al Heap", this.l, this.c);
                    return -1;
                }

            }
            else {
                addMensajeError("Semantico", "Se necesita una posicion para acceder al Heap", this.l, this.c);
                return -1;
            }
        }
        //----------------------------------------- SI ES UN VALOR EN EL STACK ------------------------------------------------------------------
        else if(op1.tipo === "stack"){
            if(op2 != null){
                if(op2.tipo === "number" || op2.tipo === "p"){
                    let valorTemp = ambito.getValueStack(op2.valor);
                    //---------------------------------- Si encuentra el valor entonces op1 obtendra ese valor y op2 sera null (Solo se puede realizar asignaciones);
                    if(valorTemp != null){
                        op1 = valorTemp;
                        op2 = null;
                    }
                    else {
                        addMensajeError("Semantico", "No se encontro la posicion: " + op2.valor + " en el Stack", this.l, this.c);
                        return -1;
                    }
                }
                else {
                    addMensajeError("Semantico", "Se necesita una posicion para acceder al Stack", this.l, this.c);
                    return -1;
                }

            }
            else {
                addMensajeError("Semantico", "Se necesita una posicion para acceder al Stack", this.l, this.c);
                return -1;
            }
        }
        


        switch (this.operacion) {

            case "suma":
                if (op2 != null) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor + op2.valor, tipo: "number", ambito : ambito.getEntorno() });
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una suma con un null", this.l, this.c));
                break;

            case "resta":
                if (op2 != null) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor - op2.valor, tipo: "number", ambito : ambito.getEntorno() });
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una resta con un null", this.l, this.c));
                break;

            case "multiplicacion":
                if (op2 != null) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor * op2.valor, tipo: "number", ambito : ambito.getEntorno() });
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una multiplicacion con un null", this.l, this.c));
                break;

            case "division":
                if (op2 != null) {
                    if (op2.valor != 0) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor / op2.valor, tipo: "number", ambito : ambito.getEntorno() });
                    else listaSalida.push(new MensajeError("Semantico", "No se puede dividir entre 0", this.l, this.c));
                }
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una division con un null", this.l, this.c));
                break;

            case "modulo":
                if (op2 != null) {
                    if (op2.valor != 0) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor % op2.valor, tipo: "number", ambito : ambito.getEntorno() });
                    else listaSalida.push(new MensajeError("Semantico", "No se puede obtener el modulo entre 0", this.l, this.c));
                }
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar un modulo con un null", this.l, this.c));
                break;

            case "potencia":
                if (op2 != null) return ambito.agregarTemporal({ id: this.temporal, valor: Math.pow(op1.valor, op2.valor), tipo: "number", ambito : ambito.getEntorno() });
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una potencia con un null", this.l, this.c));
                break;

            case "igual":
                if (op2 === null) return ambito.agregarTemporal({ id: this.temporal, valor: op1.valor, tipo: "number", ambito : ambito.getEntorno() });
                else listaSalida.push(new MensajeError("Semantico", "No se puede ejecutar una asignacion con dos valores", this.l, this.c));
                break;

        }
        return -1;
    }

   
    /**
     * METODO QUE SE ENCARGA DE REALIZAR LAS OPERACIONES SOBRE H
     * @param op1 VALOR|H > 0
     * @param op2 VALOR|H > 0
     */
    controlH (op1:any,op2:any, ambito: Ambito){
        switch (this.operacion) {
            case "suma":
                if(op1.valor < 0 || op2.valor <0){
                    addMensajeError("Semantico", "H solo acepta el incremento " + this.operacion, this.l, this.c); break;
                    return -1;
                } 
                H = op1.valor + op2.valor; 
                ambito.incrementarEspacioHeap();
            break;
            default: addMensajeError("Semantico", "H solo acepta el incremento, No se reconoce: " + this.operacion, this.l, this.c); break;
        }
        return -1;
    }

   

     /**
     * METODO ENCARGADO DE REALIZAR LAS OPERACIONES CON P
     * @param dato 
     * @param valor 
     */
    controlP (op1:any,op2:any, ambito : Ambito){
        switch (this.operacion) {
            case "suma":  
                P = op1.valor + op2.valor; 
            break;
            case "resta":
                P = op1.valor - op2.valor;
                break;
            default: addMensajeError("Semantico", "H solo acepta el incremento, No se reconoce: " + this.operacion, this.l, this.c); break;
        }
        return -1;
    }

    /**
     * METODO QUE SE ENCARGA DE LAS OPERACIONES DEL HEAP
     * @param dato 
     * @param valor 
     */
    controlHeap(dato:any,valor:any, ambito: Ambito) {
        switch (this.operacion) {
            case "igual":
                let existePos = ambito.getHeap(dato.valor);
                if(existePos != null) ambito.setValueHeap(dato.valor,valor);
                else addMensajeError("Semantico", "No existe esta posicion: " + dato.valor + " en el Heap", this.l, this.c); break; 
            break;
            default: addMensajeError("Semantico", "El Heap solo acepta el operador =, No se reconoce: " + this.operacion, this.l, this.c); break;
        }
        return -1;
    }


      /**
     * METODO QUE SE ENCARGA DE LAS OPERACIONES DEL STACK
     * @param dato 
     * @param valor 
     */
    controlStack(dato:any,valor:any, ambito:Ambito) {
        switch (this.operacion) {
            case "igual":
                let existePos = ambito.getValueStack(dato.valor);
                if(existePos != null) ambito.setValueStack(dato.valor,valor);
                else addMensajeError("Semantico", "No existe esta posicion: " + dato.valor + " en el Stack", this.l, this.c); break; 
            break;
            default: addMensajeError("Semantico", "El Stack solo acepta el operador =, No se reconoce: " + this.operacion, this.l, this.c); break;
        }
        return -1;
    }








}