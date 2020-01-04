/**
 * ESTRUCTURA DE DATOS ALMACENADOS EN EL STACK
 * {TIPO,VALOR}
 * 
 */


 /**
  * TIPOS DE EDITORES
  * 0: OLCEV
  * 1: 3D
  * 
  */

/**
 * OPTIMIZACION:
 *  linea
 *  regla
 *  detalle
 */


var listaClases = [];



var listaSalida = [];
var listaEtiquetas = [];
var listaFuncion = [];
var listaEditores = [];
var reglasAplicada = [];

var TabId = 0;

var H = 0;
var P = 0;

let editorActual = null;
let markedText = null;
let instruccionesDebug = null;
let ambitoActual = null;

function redirigir(listaInstrucciones, posicion, actual) {
    let indice = actual;
    let index = 0;
    listaInstrucciones.forEach(element => {
        if (element.posicion === posicion) {
            indice = index;
        }
        index++;
    });
    return indice;
}

/**
 * METODO QUE INSERTA UNA ETIQUETA
 * @param {*} etiqueta NUEVA ETIQUETA
 */
function agregarEtiqueta(etiqueta) {
    eliminarEtiqueta(etiqueta.nombre);
    listaEtiquetas.push(etiqueta);
}

function eliminarEtiqueta(etiqueta) {
    for (let i = 0; i < listaEtiquetas.length; i++) {
        et = listaEtiquetas[i];
        if (et.nombre === etiqueta) listaEtiquetas.splice(i, 1);
    }
}

/**
 * METODO QUE BUSCA UNA ETIQUETA
 * @param {*} nombre ETIQUETA A BUSCARs
 * @return objeto | null
 */
function buscarEtiqueta(nombre) {
    let retorno = null;
    for (let i = 0; i < listaEtiquetas.length; i++) {
        let etiqueta = listaEtiquetas[i];
        if (etiqueta.nombre === nombre) retorno = etiqueta;
    }
    return retorno;
}

function buscarFuncion(nombre) {
    let retorno = null;
    for (let i = 0; i < listaFuncion.length; i++) {
        if (listaFuncion[i].nombre === nombre) retorno = listaFuncion[i].funcion;
    }
    return retorno;
}

/**
 * METODO PARA CREAR UN NUEVO ARCHIVO DE OLCEV
 */
$("#newOLCEV").on("click", function (e) {
    e.preventDefault();
    newOLCEV("");
});

/**
 * METODO PARA CREAR UN NUEVO ARCHIVO DE 3D
 */
$("#new3D").on("click", function (e) {
    e.preventDefault();
    new3D("");
});

/**
 * ABRIR UN ARCHIVO DE PASCAL
 */
$("#openOLCEV").on('click',function(e){
    let file = document.getElementById("filePascal");
    if(file) file.click();
});

/**
 * FUNCION QUE MANEJA EL INPUT FILE DE PASCAL
 */
function handleFilePascal(){
    let file = document.getElementById("filePascal").files[0];
    let fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        let text = fileLoadedEvent.target.result;
        newPascal(text);
    };
    fileReader.readAsText(file,"UTF-8");
}

/**
 * ABRIR UN NUEVO ARCHIVO DE CUADRUPLOS
 */
$("#open3D").on('click',function(e){
    let file = document.getElementById("file3D");
    if(file) file.click();
});

/**
 * FUNCION QUE MANEJA EL INPUT FILE DE 3D
 */
function handleFile3D(){
    let file = document.getElementById("file3D").files[0];
    let fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        let text = fileLoadedEvent.target.result;
        new3D(text);
    };
    fileReader.readAsText(file,"UTF-8");
}

/**
 * ARCHIVO PARA CREAR UN NUEVO ARCHIVO DE PASCAL
 */
function newOLCEV(texto){
    $("#nav-tab").append(
        '<a class="nav-item nav-link"  data-toggle="tab" href="#nav-' +
        TabId +
        '" role="tab" >' +
        " Pestaña " +
        TabId +
        '<span class="badge" id="Tab' +
        TabId +
        '">x</span>' +
        " </a>"
    );

    let tab = document.createElement("div");
    tab.setAttribute("id", "nav-" + TabId);
    tab.className = "tab-pane active";

    let cuerpo = document.createElement("textarea");
    tab.appendChild(cuerpo);

    let es = document.getElementById("espacioEditores");
    es.appendChild(tab);
    let editor = CodeMirror.fromTextArea(cuerpo, prefEditorPascal);
    editor.setSize(null, "100%");

    let objectEditor = {
        editor: editor,
        id: "Tab" + TabId,
        tab: "nav-" + TabId,
        breakpoins: [],
        tipo: 0
    };

    listaEditores.push(objectEditor);
    editor.getDoc().setValue(texto);
    editor.refresh;

    $("#nav-tab a").click();
    TabId++;
}

/**
 * CREA UNA NUEVA PESTAÑA CON UN ARCHIVO 3D
 * @param {*} texto 
 */
function new3D(texto){
    $("#nav-tab").append(
        '<a class="nav-item nav-link"  data-toggle="tab" href="#nav-' +
        TabId +
        '" role="tab" >' +
        " Pestaña " +
        TabId +
        '<span class="badge" id="Tab' +
        TabId +
        '">x</span>' +
        " </a>"
    );

    let tab = document.createElement("div");
    tab.setAttribute("id", "nav-" + TabId);
    tab.className = "tab-pane active";

    let cuerpo = document.createElement("textarea");
    tab.appendChild(cuerpo);

    let es = document.getElementById("espacioEditores");
    es.appendChild(tab);
    let editor = CodeMirror.fromTextArea(cuerpo, prefEditor3D);
    editor.setSize(null, "100%");

    let objectEditor = {
        editor: editor,
        id: "Tab" + TabId,
        tab: "nav-" + TabId,
        breakpoins: [],
        tipo: 1
    };

    editor.on("gutterClick", function (cm, n) {
        var info = cm.lineInfo(n);
        addBreakPoint(objectEditor.breakpoins, info.line);
        console.log(objectEditor.breakpoins);
        cm.setGutterMarker(
            n,
            "breakpoints",
            info.gutterMarkers ? null : makeMarker()
        );
    });

    listaEditores.push(objectEditor);
    editor.getDoc().setValue(texto);
    editor.refresh;

    $("#nav-tab a").click();
    TabId++;
}

/**
 * CREA UN NUEVO ARCHIVO ASSEMBLER
 * @param {*} texto 
 */
function newAssembler(texto){
    $("#nav-tab").append(
        '<a class="nav-item nav-link"  data-toggle="tab" href="#nav-' +
        TabId +
        '" role="tab" >' +
        " Pestaña " +
        TabId +
        '<span class="badge" id="Tab' +
        TabId +
        '">x</span>' +
        " </a>"
    );

    let tab = document.createElement("div");
    tab.setAttribute("id", "nav-" + TabId);
    tab.className = "tab-pane active";

    let cuerpo = document.createElement("textarea");
    tab.appendChild(cuerpo);

    let es = document.getElementById("espacioEditores");
    es.appendChild(tab);
    let editor = CodeMirror.fromTextArea(cuerpo, prefEditorAssembler);
    editor.setSize(null, "100%");

    let objectEditor = {
        editor: editor,
        id: "Tab" + TabId,
        tab: "nav-" + TabId,
        breakpoins: [],
        tipo: 2
    };

   
    listaEditores.push(objectEditor);
    editor.getDoc().setValue(texto);
    editor.refresh;

    $("#nav-tab a").click();
    TabId++;
}

/**
 * OBTENGO EL TEXTO DE LA PESTAÑA ACTUAL Y LO GUARDO EN UN ARCHIVO
 */
$("#saveFile").on('click',function(e){
    e.preventDefault();
    let edi = editorActual.editor;
    let texto = edi.getValue();
    let nombre = (editorActual.tipo === 0) ? "archivo.doslang" : "archivo.txt";
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(texto)
    );
    element.setAttribute("download", nombre);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});


/**
 * FUNCION QUE AGREGA UN MARCADOR(BREAKPOINT)
 */
function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

/**
 * FUNCION QUE ALMACENA QUE LINEA ESTAMOS AGREGADO EL BREAKPOINT
 * @param {*} breakpoins
 * @param {*} linea
 */
function addBreakPoint(breakpoins, linea) {
    let flag = 1;
    for (let i = 0; i < breakpoins.length; i++) {
        if (breakpoins[i] === linea + 1) {
            breakpoins.splice(i, 1);
            flag = 0;
            break;
        }
    }
    if (flag) breakpoins.push(linea + 1);
}

/**
 * MUESTRA LA NUEVA PESTAÑA
 */
$("#nav-tab").on("click", "a", function (e) {
    let href = $(this).attr("href");
    href = href.slice(1);

    editorActual = listaEditores.find(function (element) {
        return element.tab === href;
    });

    $(this).tab("show");
});

/**
 * BORRA UNA PESTAÑA ACTUAL
 */

$("#nav-tab").on("click", ".badge", function () {
    let id = $(this).attr("id");
    $(this)
        .parents("a")
        .remove();
    $(id).remove();
    let cuerpo = getEditor(id);
    let div = document.getElementById(cuerpo);
    div.remove();
    let firsr = $("#nav-tab a:first");
    if (firsr != null) firsr.tab("show");
});

/**
 * OBTENGO EL EDITOR EN EL QUE ESTOY ACTUALMETE
 * @param {*} id
 */
function getEditor(id) {
    for (let i = 0; i < listaEditores.length; i++) {
        if (listaEditores[i].id === id) return listaEditores[i].tab;
    }
    return null;
}

/**
 * SHOW / HIDE CONSOLA
 */
$("#consolaClick").on("click", function (e) {
    $("#consolaTarget").toggle();
});

/**
 * INICIAR DEBUG
 */

$("#debugButton").on("click", function (e) {
    $("#debugTarget").toggle();
    if (document.getElementById("bodyInfo").style.visibility != "visible") document.getElementById("bodyInfo").style.visibility = "visible";
    else document.getElementById("bodyInfo").style.visibility = "hidden";
    let firstIndex = editorActual.breakpoins[0];
    //------------------------------------------ RECORRIDO QUE EJECUTARA TODO EL CODIGO ------------------------------------------
    let ambito = new Ambito();
    let listaInstrucciones = getInstrucciones();
    if (listaInstrucciones != null) {
        instruccionesDebug = new Instruccion3D(listaInstrucciones, ambito);
        ambitoActual = ambito;
        let index = instruccionesDebug.ejecutarDebugger(firstIndex);
        recorrerStack();
        recorrerHeap();
        markedText = editorActual.editor.markText({ line: index, ch: 0 }, { line: index, ch: 100 }, { className: "styled-background" });
    }

    if (!$("#consolaTarget").is(":visible")) $("#consolaTarget").toggle();
    
});

/**
 * STEP ON STEP EN DEBUG
 */
$("#nextStep").on("click", function (e) {
    let index = instruccionesDebug.siguienteDebug();
    markedText.clear();
    if (index === -777) {
        $("#debugTarget").toggle();
        document.getElementById("bodyInfo").style.visibility = "hidden";
    } else {
        jumpToLine(index);
        recorrerStack();
        recorrerHeap();
        markedText = editorActual.editor.markText({ line: index, ch: 0 }, { line: index, ch: 100 }, { className: "styled-background" });
    }
});

/**
 * FUNCION QUE SE ENCARGA DE RECORRER EL STACK E IMPRIMIRLO
 */
function recorrerStack(){
    let codigo = "";

    for(let i = 0; i < ambitoActual.getAllStack().length; i++){
        let dato = ambitoActual.getAllStack()[i];
        if(dato.valor != -11){
            let div = '<div class="element">' + i +".       " + dato.valor + '</div>';
            codigo += "\n" + div;
        }
    }
    document.getElementById("elementsStack").innerHTML = codigo;
}

/**
 * FUNCION QUE RECORRE E IMPRIME EL HEAP
 */
function recorrerHeap(){
    let codigo = "";

    for(let i = 0; i < ambitoActual.getAllHeap().length; i++){
        let dato = ambitoActual.getAllHeap()[i];
        if(dato.valor != -11){
            let div = '<div class="element">' + i +".       " + dato.valor + '</div>';
            codigo += "\n" + div;
        }
    }
    document.getElementById("elementsHeap").innerHTML = codigo;
}



/**
 * HACE UNA SALTO DE LINEA DESDE EL DEBUG
 * @param {*} i
 */
function jumpToLine(i) {
    editorActual.editor.setCursor(i);
}

/**
 * METODO ENCARGADO DE EJECUTAR CODIGO DE PASCAL (TRADUCIR EL CODIGO)
 */
$("#playButton").on("click", function (e) {
    e.preventDefault();
    inicializarDatos();
    if (editorActual) {
        switch (editorActual.tipo) {
            //------------------------------------- EJECUTAR 3D -----------------------------------------------------------------------
            case 0:
                analizarCodigoOLCEV();
                break;
            
            case 1:
                ejecutar3D();
                break;
        }
    }
});

/**
 * OBTENER EL REPORTE ATRAVEZ DE SOCKETS
 */
$("#reportButton").on('click',function(e){
    socket.emit("getReporte","");
});

/**
 * METODO QUE SE ENCARGARA
 * DE ANALIZAR EL CODIGO DE ALTO NIVEL
 */
function analizarCodigoOLCEV(){
    let ed = editorActual.editor;
    let codigo = ed.getValue();
    listaClases = [];
    GramaticaOLCEV.parse(codigo);
    let analizar = GramaticaOLCEV.arbol.raiz;
    let nodo = analizar.ejecutar("principal");
    let texto = obtenerCodigo(nodo.codigo);
    new3D(texto);
}

/**
 * METODO QUE SE ENCARGARA DE RECORRER
 * EL ARREGLO DE TEXTO Y NOS
 * DEVUELVE UN TEXTO PLANO
 */
function obtenerCodigo(codigo){
    let texto = "";
    codigo.forEach(element => {
        texto += element + "\n";
    });
    return texto;
}



/**
 * EJECUTA EL CODIGO 3D -
 */
function ejecutar3D() {
    //------------------------------------------ RECORRIDO QUE EJECUTARA TODO EL CODIGO ------------------------------------------
    let ambito = new Ambito();
    let listaInstrucciones = getInstrucciones();
    if (listaInstrucciones != null) {
        let instruccionCuerpo = new Instruccion3D(listaInstrucciones, ambito);
        instruccionCuerpo.ejecutar();
    }

    if (!$("#consolaTarget").is(":visible")) $("#consolaTarget").toggle();
}

/**
 * NOS DEVUELVE EL CONJUNTO DE INSTRUCCIONES DEL ANALISIS DE UN CODIGO 3D PARA EJECUTAR
 */
function getInstrucciones() {
    let codigo = editorActual.editor.getValue();
    inicializarDatos();

    Gramatica.parse(codigo);
    let listaInstrucciones = Gramatica.arbol.raiz;
    if (Gramatica.arbol.errores.length > 0) {
        Gramatica.arbol.errores.forEach(element => {
            addMensajeError(
                element.tipo,
                element.mensaje,
                element.linea,
                element.columna
            );
        });
        Gramatica.arbol.errores = [];
        return null;
    }
    return listaInstrucciones;
}

/**
 * INICIALIZA TODAS LAS VARIABLES Y ESTRUCTURAS
 */
function inicializarDatos() {
    listaSalida = [];
    listaFuncion = [];
    listaEtiquetas = [];
    H = 0;
    P = 0;
    document.getElementById("consolaTarget").innerHTML = "";
}

/**
 * MENSAJE DE ERROR
 * @param {*} tipo
 * @param {*} mensaje
 * @param {*} linea
 * @param {*} columna
 */
function addMensajeError(tipo, mensaje, linea, columna) {
    let salida =
        '<p class="messageError"> > ' +
        tipo +
        ": " +
        mensaje +
        ", Linea: " +
        linea +
        ", Columna: " +
        columna +
        "</p>";
    $("#consolaTarget").append(salida);
}

/**
 * CONSOLA NORMAL
 * @param {} mensaje
 */
function addMessage(mensaje) {
    let salida = '<spam class="message">' + mensaje + "</spam>";
    $("#consolaTarget").append(salida);
}



/**
 * SE ENCARGARA DE OPTIMIZAR CODIGO 3D
 */
$("#optimizarButton").on('click',function(e){
    if(editorActual.tipo === 1){
        reglasAplicada = [];
        let codigo = editorActual.editor.getValue().split('\n');
        let primeraRegla = new Regla1(codigo);
        let optimizado = primeraRegla.optimizar();
         
        let segundaRegla = new Regla2(optimizado);
        optimizado = segundaRegla.optimizar();

        let R4 = new Regla4(optimizado);
        optimizado = R4.optimizar();

        let R5 = new Regla5(optimizado);
        optimizado = R5.optimizar();

        let sextaRegla = new Regla6(optimizado);
        optimizado = sextaRegla.optimizar();

        

        let septimaRegla = new Regla7(optimizado);
        optimizado = septimaRegla.optimizar();

        let octavaRegla = new Regla8(optimizado);
        optimizado = octavaRegla.optimizar();

        let novenaRegla = new Regla9(optimizado);
        optimizado = novenaRegla.optimizar();


        let R10 = new Regla10(optimizado);
        optimizado = R10.optimizar();


        let R11 = new Regla11(optimizado);
        optimizado = R11.optimizar();

        let R12 = new Regla12(optimizado);
        optimizado = R12.optimizar();

        let R13 = new Regla13(optimizado);
        optimizado = R13.optimizar();

        let R14 = new Regla14(optimizado);
        optimizado = R14.optimizar();

        let R15 = new Regla15(optimizado);
        optimizado = R15.optimizar();

        let R16 = new Regla16(optimizado);
        optimizado = R16.optimizar();

        let codigoFinal = "";
        optimizado.forEach(element => {
            
            codigoFinal += element + "\n";
        });

        new3D(codigoFinal);
        let codigoHTML = "";
        reglasAplicada.forEach(element => {
            codigoHTML += '<tr><td>' + element.linea + '</td><td>' + element.regla + '</td><td>' + element.detalle + '</td></tr>\n'; 
        });
        document.getElementById("bodyOptimizacion").innerHTML = codigoHTML;
        $("#modalOptimizacion").modal();
        

    }
});


/**
 * NOS DEVUELVE EL CONJUNTO DE INSTRUCCIONES DEL ANALISIS DE UN CODIGO 3D PARA TRADUCIR
 */
function getInstrucciones3D() {
    let codigo = editorActual.editor.getValue();

    Gramatica3D.parse(codigo);
    let listaInstrucciones = Gramatica3D.arbol.raiz;

    if (Gramatica3D.arbol.errores.length > 0) {
        Gramatica3D.arbol.errores.forEach(element => {
            addMensajeError(
                element.tipo,
                element.mensaje,
                element.linea,
                element.columna
            );
        });
        return null;
    }
    return listaInstrucciones;
}



/**
 * METODO QUE SE ENCARGARA DE PARA EL DEBUG
 */
$("#stopDebug").on("click", function (e) {
    if(markedText) markedText.clear();
    $("#debugTarget").toggle();
    document.getElementById("bodyInfo").style.visibility = "hidden";
});


/**
 * --------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * ------------------------------------------------------------- METODOS DE OPTIMIZACION -------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
*/

/**
 * VERIFICA QUE ES UN CUADRUPLO Y NO UN COMENTARIO O UN SALTO DE LINEA
 */
function isCuadruplo(linea){
    let cuadruplo = linea.split(',');
    return cuadruplo.length === 4; 
}

/**
 * METODO PARA OBTENER UN TEMPORAL Y NO TIENE UN COMENTARIO ADYACENTE EJEMPLO T1//OPERACION
 */
function limpiarTemporal(temp){
    return temp.split('/')[0].trim();
}

/**
 * METODO PARA VERIFICAR SI ES UNA ETIQUETA LX
 */
function isEtiqueta(linea){
    return linea.toLowerCase().includes("l");
}

/**
 * AGREGA UNA NUEVA REGLA APLICADA EN LA EJECUCION DEL PROGRAMA
 */
function addNewRegla(linea,tipo,detalle){
    reglasAplicada.push({linea:linea,regla:tipo,detalle:detalle});
}

/**
 * VERIFICA SI ES UN COMENTARIO
 */
function isComentario(linea){
    linea = linea.trim();
    return linea.indexOf("\/") === 0;
}

/**
 * FUNCION QUE RETONAR SI ES UN TEMPORAL
 * @param {*} linea 
 */
function isTemporal(linea){
    return linea.toLowerCase().includes("t");
}

/**
 * RETORNA SI EXISTE UN OPERADOR O NO
 * @param {*} operador 
 */
function operadoresLogicos(operador){
    let operadores  = ["je","jne","jg","jl","jge","jle"];
    return operadores.find(element => element === operador.toLowerCase());
}


/**
 * METODO PARA AGREGAR CLASES
 */
function agregarClase(clase){
    listaClases.push(clase);
}

/**
 * METODO PARA BUSCAR CLASES
 * @param id Nombre de la clase a buscar
 */
function getClase(id){
    for(let i = 0; i < listaClases.length; i++){
        if(listaClases[i].nombre === id) return listaClases[i]
    }
    return null;
}