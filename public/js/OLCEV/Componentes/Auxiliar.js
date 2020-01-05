var Auxiliar = /** @class */ (function () {
    function Auxiliar() {
    }
    /**
     * METODO PARA GENERAR TEMPORALES
     */
    Auxiliar.generarTemporal = function () {
        var n = Auxiliar.temporal;
        Auxiliar.temporal++;
        return "t" + n;
    };
    /**
     * METODO QUE CREA UNA NUEVA LINEA DE CODIGO
     * @param linea CODIGO 3D
     * @param comentario COMENTARIO QUE ACOMPAÑARA A LA LINEA
     */
    Auxiliar.crearLinea = function (linea, comentario) {
        return linea + "                ;" + comentario;
    };
    /**
     * METODO QUE GENERAR NUEVAS ETIQUETAS
     */
    Auxiliar.generarEtiqueta = function () {
        var i = this.etiqueta;
        this.etiqueta++;
        return "L" + i;
    };
    /**
     * METODO QUE MOSTRARA LOS ERRORES EN CONSOLA
     * @param error clase error con toda la informacion del error
     */
    Auxiliar.agregarError = function (error) {
        console.error(error);
    };
    /**
     * METOODO QUE LLEVA EL CONTROL DE LAS POSICIONES ABSOLUTAS
     */
    Auxiliar.posicionAbsoluta = function () {
        var i = Auxiliar.posicion;
        Auxiliar.posicion++;
        return i;
    };
    /**
     * METODO ENCARGADO DE CREAR UN OBJETO ATRIBUTO
     * @param visibilidad Visivilidad del objeto
     * @param isFinal  si es final
     * @param isStatic  si es estatica
     * @param isAbstract  si es abstracta
     */
    Auxiliar.crearObjectoAtributos = function (visibilidad, isFinal, isStatic, isAbstract) {
        return { visibilidad: visibilidad, isStatic: isStatic, isFinal: isFinal, isAbstract: isAbstract };
    };
    /**
     * METODO QUE SERVIRA PARA CLONAR UN ENTORNO
     * @param entorno ENTORNO A CLONAR
     */
    Auxiliar.clonarEntorno = function (entorno) {
        var e = new Entorno(entorno.archivo);
        e.listaSimbolos = [];
        e.listaSimbolos = e.listaSimbolos.concat(entorno.listaSimbolos);
        e.metodos = [];
        e.metodos = e.metodos.concat(entorno.metodos);
        e.listaBreak = entorno.listaBreak;
        e.listaContinue = entorno.listaContinue;
        e.etiquetaSalida = entorno.etiquetaSalida;
        e.clase = entorno.clase;
        e.archivo = entorno.archivo;
        e.posRelativaStack = entorno.posRelativaStack;
        e.tamaño = entorno.tamaño;
        return e;
    };
    /**
     * METODO QUE DEVUELVE EL CODIGO 3D
     * DE LA FUNCION TRUNK
     */
    Auxiliar.funcionTrunk = function () {
        var nodo = new Nodo();
        nodo.codigo = [];
        var posicion = this.generarTemporal();
        var valor = this.generarTemporal();
        var modulo = this.generarTemporal();
        var retorno = this.generarTemporal();
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";############################### FUNCION TRUNK############################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc trunk{");
        nodo.codigo.push(this.crearLinea(posicion + " = P  + 0", "posicion del numero a recibir"));
        nodo.codigo.push(this.crearLinea(valor + " = Stack[" + posicion + "]", "Obtenemos el valor numerico"));
        nodo.codigo.push(this.crearLinea(modulo + " = " + valor + " % 1 ", "Nos devuelve el residuo"));
        nodo.codigo.push(retorno + " = " + valor + " - " + modulo);
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1", "Posicion del retorno"));
        nodo.codigo.push("Stack[" + posicion + "] = " + retorno);
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    };
    /**
     * METODO QUE CREA SALTOS CONDICIONALES
     * @param condicion CONDICION A EVALUAR
     * @param etiqueta ETIQUETA DONDE SE REALIZARA EL SALTO
     */
    Auxiliar.saltoCondicional = function (condicion, etiqueta) {
        return "if " + condicion + " goto " + etiqueta;
    };
    /**
     * METODO QUE GENERA SALTOS INCONDICIONALES
     * @param etiqueta SALTO
     */
    Auxiliar.saltoIncondicional = function (etiqueta) {
        return "goto " + etiqueta;
    };
    /**
     * METODO QUE DEVUELVE EL CODIGO 3D
     * DE CONVERTIR UN NUMERO A CADENA
     */
    Auxiliar.functionNumberToCadena = function () {
        var nodo = new Nodo();
        nodo.codigo = [];
        var posicion = this.generarTemporal();
        var valor = this.generarTemporal();
        var v1 = this.generarEtiqueta();
        var v2 = this.generarEtiqueta();
        var newValor = this.generarTemporal();
        var modulo = this.generarTemporal();
        var ascii = this.generarTemporal();
        var salto = this.generarEtiqueta();
        var division = this.generarTemporal();
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";######################### FUNCION NUMBERTOCADENA ########################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc numberToCadena{");
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", "Posicion del parametro 1"));
        nodo.codigo.push(this.crearLinea(valor + " = Stack[" + posicion + "]", "Almacenamos el valor del numero en un temporal"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " >= 0", v1), "Si el numero es mayor a cero hacemos un salto"));
        nodo.codigo.push(this.crearLinea(valor + " = " + valor + " * -1 ", "Convertirmos a positivo el numero"));
        nodo.codigo.push(this.crearLinea("Heap[H] = 45", "Guardamos un - en el heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1", "Aumentamos el Heap"));
        nodo.codigo.push(v1 + ":");
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " < 10 ", v2), ""));
        nodo.codigo.push(this.crearLinea("P = P + 1", "Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", ""));
        nodo.codigo.push(this.crearLinea(division + " = " + valor + " / 10", ""));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + " ] = " + division, "Pasamos el parametro"));
        nodo.codigo.push(this.crearLinea("call trunk", "Llamamos a la funcion trunk para obtener el numero entero"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1", "Posicion del return"));
        nodo.codigo.push(this.crearLinea(newValor + " = Stack[" + posicion + "]", "Obtenemos el valor de retorno"));
        nodo.codigo.push(this.crearLinea("P = P - 1", "Fin de simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea("P = P + 1", "Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", "Posicion del primer parametro"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + newValor, "Seteamos el valor del primer parametro"));
        nodo.codigo.push("call numberToCadena");
        nodo.codigo.push(this.crearLinea("P = P - 1", "Fin de simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(modulo + " = " + valor + " % 10", ""));
        nodo.codigo.push(this.crearLinea(ascii + " = " + modulo + " + 48", "Le sumamos 48 para obtener su ascii"));
        nodo.codigo.push(this.crearLinea("Heap[H] = " + ascii, "Almacenamos el valor en el Heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1", "Aumentamos el Heap"));
        nodo.codigo.push(this.crearLinea(this.saltoIncondicional(salto), ""));
        nodo.codigo.push(";############################## SI EL NUMERO ES MENOR A 10 #########################");
        nodo.codigo.push(v2 + ":");
        nodo.codigo.push(this.crearLinea(ascii + " = " + valor + " + 48", "Le sumamos 48 para obtener su ascii"));
        nodo.codigo.push(this.crearLinea("Heap[H] = " + ascii, "Almacenamos el valor en el Heap"));
        nodo.codigo.push(this.crearLinea("H = H + 1", "Aumentamos el Heap"));
        nodo.codigo.push(salto + ":");
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    };
    /**
     * METODO QUE ESCRIBE LAS ETIQUETAS EN 3D
     * @param etiquetas ETIQUETAS A ESCRIBIR
     */
    Auxiliar.escribirEtiquetas = function (etiquetas) {
        var nodo = new Nodo();
        nodo.codigo = [];
        etiquetas.forEach(function (element) {
            nodo.codigo.push(element + ":");
        });
        return nodo;
    };
    /**
     * METODO QUE GENERA EL CODIGO 3D
     * DE LA FUNCION POW
     */
    Auxiliar.funcionPow = function () {
        var nodo = new Nodo();
        nodo.codigo = [];
        var posicion = this.generarTemporal();
        var base = this.generarTemporal();
        var exponente = this.generarTemporal();
        var retorno = this.generarTemporal();
        var nuevo = this.generarTemporal();
        var v = this.generarEtiqueta();
        var s = this.generarEtiqueta();
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";######################### FUNCION NUMBERTOCADENA ########################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc funcionPow{");
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", "Obtenemos la posicion de la base"));
        nodo.codigo.push(this.crearLinea(base + " = Stack[" + posicion + "] ", "Obtenemos el valor de la base"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1", "Obtenemos la posicion del exponente"));
        nodo.codigo.push(this.crearLinea(exponente + " = Stack[" + posicion + "]", "Obtenemos el valor del exponente"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(exponente + " > 0", v), "Si el exponente aun no es 0"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 2", "Posicion del retorno"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = 1", "Retornamos un valor"));
        nodo.codigo.push(this.saltoIncondicional(s));
        nodo.codigo.push(v + ":");
        nodo.codigo.push(this.crearLinea("P = P + 3", "Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", "Obtenemos la posicion de la base"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + base, "Seteamos el valor de la base"));
        nodo.codigo.push(this.crearLinea(exponente + " = " + exponente + " -  1", "Le quitamos 1 al exponente"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 1", "Obtenemos la posicion de la exponente"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + exponente, "Seteamos el valor del exponente"));
        nodo.codigo.push("call funcionPow");
        nodo.codigo.push(this.crearLinea(posicion + " = P + 2", "Obtenemos la posicion del retorno"));
        nodo.codigo.push(this.crearLinea(retorno + " = Stack[" + posicion + "]", "Almacenamos el valor que retorno la funcion"));
        nodo.codigo.push(this.crearLinea("P = P - 3", "Fin simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(nuevo + " = " + retorno + " * " + base, "Realizamos la multiplicacion"));
        nodo.codigo.push(this.crearLinea(posicion + " = P + 2", "Posicion del retorno"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + nuevo, "Retornamos un valor"));
        nodo.codigo.push(s + ":");
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    };
    /**
     * FUNCION QUE SE ENCARGA DE
     * GENERAR CODIGO 3D
     * PARA LA CONVERSION DE STRING TO
     * INT
     */
    Auxiliar.stringToNumber = function () {
        var nodo = new Nodo([]);
        var posicion = this.generarTemporal();
        var posicion2 = this.generarTemporal();
        var valor = this.generarTemporal();
        var acarreo = this.generarTemporal();
        var retorno = this.generarTemporal();
        var posicionTemporal = this.generarTemporal();
        var v = this.generarEtiqueta();
        var s = this.generarEtiqueta();
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push(";######################### FUNCION String To Number ########################");
        nodo.codigo.push(";#########################################################################");
        nodo.codigo.push("proc stringToNumber{");
        nodo.codigo.push(this.crearLinea(posicion + " = P + 0", "Obtenemos la referencia a la posicion de la cadena"));
        nodo.codigo.push(this.crearLinea(posicion2 + " = P + 1", "Obtenemos la posicion del valor acarreado"));
        nodo.codigo.push(this.crearLinea(posicion + " = Stack[" + posicion + "]", "posicion en Heap de la cadena"));
        nodo.codigo.push(this.crearLinea(valor + " = Heap[" + posicion + "]", "valor (caracter)"));
        nodo.codigo.push(this.crearLinea(acarreo + " = Stack[" + posicion2 + "]", "Valor de acarreo"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " == 0", v), "Si es el final de la cadena"));
        nodo.codigo.push(this.crearLinea(valor + " = " + valor + " - 48", "Convertimos el ascii a entero"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " < 0", v), "Si es menor al ascii 47 entonces no es un numero"));
        nodo.codigo.push(this.crearLinea(this.saltoCondicional(valor + " > 9", v), "Si es mayor al ascii 57 no es un numero"));
        nodo.codigo.push(this.crearLinea(retorno + " = " + acarreo + " * 10", "Multiplicamos el acarreo por la decena"));
        nodo.codigo.push(this.crearLinea(retorno + " = " + retorno + " + " + valor, "Le sumamos el valor actual"));
        nodo.codigo.push(this.crearLinea("P = P + 3", "Simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicionTemporal + " = P + 0", "Posicion del primer parametro"));
        nodo.codigo.push(this.crearLinea(posicion + " = " + posicion + " +  1", "Aumentamos en 1 la posicion en Heap de la cadena"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicionTemporal + "] = " + posicion, "Pasamos la posicion del siguiente caracter"));
        nodo.codigo.push(this.crearLinea(posicionTemporal + " = P + 1", "Posicion del segundo parametro"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicionTemporal + "] = " + retorno, "Pasamos el valor del acarreo"));
        nodo.codigo.push("call stringToNumber");
        nodo.codigo.push(this.crearLinea(posicionTemporal + " = P + 2", "Posicion del retorno"));
        nodo.codigo.push(this.crearLinea(retorno + " = Stack[" + posicionTemporal + "]", "Obtenemos el retorno de la funcion"));
        nodo.codigo.push(this.crearLinea("P = P - 3", "Fin simulacion de cambio de ambito"));
        nodo.codigo.push(this.crearLinea(posicionTemporal + " = P + 2", "Posicion del retorno"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicionTemporal + "] = " + retorno, "retornamos el valor numerico"));
        nodo.codigo.push(this.saltoIncondicional(s));
        nodo.codigo.push(v + ":");
        nodo.codigo.push(this.crearLinea(posicion + " = P +  2", "Posiciond el retorno"));
        nodo.codigo.push(this.crearLinea("Stack[" + posicion + "] = " + acarreo, "Retornamos el valor numerico"));
        nodo.codigo.push(s + ":");
        nodo.codigo.push("}");
        nodo.codigo.push("\n");
        nodo.codigo.push("\n");
        return nodo;
    };
    /**
     * FUNCITON QUE SE ENCARGA DE
     * GENERAR CODIGO 3D PARA
     * OBTENER EL LARGO DE UNA CADENA
     */
    Auxiliar.funcionLength = function () {
        var salida = new Nodo([]);
        var posicion = Auxiliar.generarTemporal();
        var valor = Auxiliar.generarTemporal();
        var temporal = Auxiliar.generarTemporal();
        var v = Auxiliar.generarEtiqueta();
        var s = Auxiliar.generarEtiqueta();
        salida.codigo.push(";#########################################################################");
        salida.codigo.push(";######################### FUNCION LENGHT OF STRING ########################");
        salida.codigo.push(";#########################################################################");
        salida.codigo.push("proc stringLength{");
        salida.codigo.push(temporal + " = 0");
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(posicion + " = Stack[" + posicion + "]");
        salida.codigo.push(s + ":");
        salida.codigo.push(Auxiliar.crearLinea(valor + " = Heap[" + posicion + "]", "Se obtiene el inicio de la cadena"));
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + " == 0", v), "Si estamos al final de la cadena nos salimos"));
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = " + posicion + " + 1", "Aumentamos la posicion"));
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = " + temporal + " + 1", "Aumentamos el contador"));
        salida.codigo.push(Auxiliar.saltoIncondicional(s));
        salida.codigo.push(v + ":");
        salida.codigo.push(Auxiliar.crearLinea(posicion + " = P + 1", "Posicion del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] =" + temporal, "Guardamos el valor del retorno"));
        salida.codigo.push("}");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        salida.tipo = Tipo.INT;
        salida.resultado = temporal;
        return salida;
    };
    /**
     * FUNCION ENCARGADA DE GENERAR
     * EL CODIGO 3D PARA CONVERTIR
     * UNA CADENA A UN ARREGLO DE
     * CARACTERES
     */
    Auxiliar.toCharArray = function () {
        var salida = new Nodo([]);
        salida.codigo.push(";#########################################################################");
        salida.codigo.push(";######################### FUNCION toCHARARRAY ########################");
        salida.codigo.push(";#########################################################################");
        salida.codigo.push("proc toCharArray{");
        var posicion = Auxiliar.generarTemporal();
        var temporal = Auxiliar.generarTemporal();
        var cadena = Auxiliar.generarTemporal();
        var retorno = Auxiliar.generarTemporal();
        var valor = Auxiliar.generarTemporal();
        var v = Auxiliar.generarEtiqueta();
        var s = Auxiliar.generarEtiqueta();
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(cadena + " = Stack[" + posicion + "]");
        salida.codigo.push(Auxiliar.crearLinea("P = P + 2", "Simulacion de cambio de ambito"));
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + cadena, "Pasamos la referencia de la cadena"));
        salida.codigo.push("call stringLength");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea(temporal + " = Stack[" + posicion + "]", "Obtenemos el valor del retorno"));
        salida.codigo.push(Auxiliar.crearLinea("P = P - 2", "Fin simulacion de cambio de ambito"));
        salida.codigo.push(Auxiliar.crearLinea(retorno + " = H", "Inicio del arreglo"));
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + temporal, "Guardamos el tamanio"));
        salida.codigo.push("H = H + 1");
        salida.codigo.push(temporal + " = " + temporal + " - 1");
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + temporal, "Guardamos el limite"));
        salida.codigo.push("H = H + 1");
        salida.codigo.push(posicion + " = " + cadena);
        salida.codigo.push(s + ":");
        salida.codigo.push(Auxiliar.crearLinea(valor + " = Heap[" + posicion + "]", "Obtenemos el caracter"));
        salida.codigo.push(Auxiliar.saltoCondicional(valor + " == 0", v));
        salida.codigo.push(posicion + " = " + posicion + " + 1");
        salida.codigo.push("Heap[H] = " + valor);
        salida.codigo.push("H = H + 1");
        salida.codigo.push(Auxiliar.saltoIncondicional(s));
        salida.codigo.push(v + ":");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + retorno, "Guardamos la referencia del arreglo para retornar"));
        salida.codigo.push("}");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        return salida;
    };
    /**
     * FUNCION QUE GENERA
     * EL CODIGO 3D DE UNA CADENA
     * CONVIRTIENDO TODAS SUS LETRAS
     * A MAYUSCULAS
     */
    Auxiliar.toUpperCase = function () {
        var salida = new Nodo([]);
        var posicion = Auxiliar.generarTemporal();
        var resultado = Auxiliar.generarTemporal();
        var loop = Auxiliar.generarEtiqueta();
        var valor = Auxiliar.generarTemporal();
        var exit = Auxiliar.generarEtiqueta();
        var f = Auxiliar.generarEtiqueta();
        salida.codigo.push(";#########################################################################");
        salida.codigo.push(";######################### FUNCION toUpperCase ########################");
        salida.codigo.push(";#########################################################################");
        salida.codigo.push("proc toUpperCase{");
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(posicion + " = Stack[" + posicion + "]");
        salida.codigo.push(resultado + " = H");
        salida.codigo.push(loop + ":");
        salida.codigo.push(Auxiliar.crearLinea(valor + " = Heap[" + posicion + "]", "Obtenemos el caracter"));
        salida.codigo.push(Auxiliar.saltoCondicional(valor + " == 0", exit));
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + "< 97", f), "si es menor a 97 no es una letra"));
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + "> 122", f), "si es mayor a 122 no es una letra"));
        salida.codigo.push(Auxiliar.crearLinea(valor + " = " + valor + " - 32", "Los volvemos a mayuscula"));
        salida.codigo.push(f + ":");
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + valor, "Almacenamos el nuevo caracter"));
        salida.codigo.push("H = H + 1");
        salida.codigo.push(posicion + " = " + posicion + " + 1");
        salida.codigo.push(Auxiliar.saltoIncondicional(loop));
        salida.codigo.push(exit + ":");
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
        salida.codigo.push("H  = H + 1");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + resultado, "Almacenamos el apuntador de la cadena a retornar"));
        salida.codigo.push("}");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        return salida;
    };
    /**
     * FUNCION ENCARGADA DE GENERAR
     * EL CODIGO 3D DE UNA CADENA
     * CONVIRTIENDO TODAS SUS LETRAS
     * A MINUSCULA
     */
    Auxiliar.toLoweCase = function () {
        var salida = new Nodo([]);
        var posicion = Auxiliar.generarTemporal();
        var resultado = Auxiliar.generarTemporal();
        var loop = Auxiliar.generarEtiqueta();
        var valor = Auxiliar.generarTemporal();
        var exit = Auxiliar.generarEtiqueta();
        var f = Auxiliar.generarEtiqueta();
        salida.codigo.push(";#########################################################################");
        salida.codigo.push(";######################### FUNCION toLoweCase ########################");
        salida.codigo.push(";#########################################################################");
        salida.codigo.push("proc toLowerCase{");
        salida.codigo.push(posicion + " = P + 0");
        salida.codigo.push(posicion + " = Stack[" + posicion + "]");
        salida.codigo.push(resultado + " = H");
        salida.codigo.push(loop + ":");
        salida.codigo.push(Auxiliar.crearLinea(valor + " = Heap[" + posicion + "]", "Obtenemos el caracter"));
        salida.codigo.push(Auxiliar.saltoCondicional(valor + " == 0", exit));
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + "< 64", f), "si es menor a 64 no es una letra"));
        salida.codigo.push(Auxiliar.crearLinea(Auxiliar.saltoCondicional(valor + "> 90", f), "si es mayor a 90  no es una letra"));
        salida.codigo.push(Auxiliar.crearLinea(valor + " = " + valor + " + 32", "Los volvemos a mayuscula"));
        salida.codigo.push(f + ":");
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = " + valor, "Almacenamos el nuevo caracter"));
        salida.codigo.push("H = H + 1");
        salida.codigo.push(posicion + " = " + posicion + " + 1");
        salida.codigo.push(Auxiliar.saltoIncondicional(loop));
        salida.codigo.push(exit + ":");
        salida.codigo.push(Auxiliar.crearLinea("Heap[H] = 0", "Fin de la cadena"));
        salida.codigo.push("H  = H + 1");
        salida.codigo.push(posicion + " = P + 1");
        salida.codigo.push(Auxiliar.crearLinea("Stack[" + posicion + "] = " + resultado, "Almacenamos el apuntador de la cadena a retornar"));
        salida.codigo.push("}");
        salida.codigo.push("\n");
        salida.codigo.push("\n");
        return salida;
    };
    Auxiliar.temporal = 0;
    Auxiliar.posicion = 0;
    Auxiliar.etiqueta = 0;
    return Auxiliar;
}());
