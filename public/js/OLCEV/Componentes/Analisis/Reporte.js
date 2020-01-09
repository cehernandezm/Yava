var Reporte = /** @class */ (function () {
    function Reporte() {
    }
    Reporte.prototype.generarReporte = function () {
        var index = 0;
        var codigo = "";
        listaClases.forEach(function (clase) {
            var atributo = clase.atributos;
            var visibilidad = atributo['visibilidad'];
            var isStatic = atributo['isStatic'];
            codigo += "\n<tr>";
            codigo += "\n<td>" + index + "</td>";
            codigo += "\n<td>" + clase.nombre + "</td>";
            codigo += "\n<td>" + "clase" + "</td>";
            codigo += "\n<td>" + Visibilidad[visibilidad] + "</td>";
            codigo += "\n<td>" + isStatic + "</td>";
            codigo += "\n<td>" + "-" + "</td>";
            codigo += "\n<td>" + "-" + "</td>";
            codigo += "\n<td>" + "-" + "</td>";
            codigo += "\n</tr>";
            index++;
            clase.entorno.listaSimbolos.forEach(function (simbolo) {
                var atributo = simbolo.atributo;
                var visibilidad = atributo['visibilidad'];
                var isStatic = atributo['isStatic'];
                codigo += "\n<tr>";
                codigo += "\n<td>" + index + "</td>";
                codigo += "\n<td>" + simbolo.id + "</td>";
                codigo += "\n<td>" + "atributo" + "</td>";
                codigo += "\n<td>" + Visibilidad[visibilidad] + "</td>";
                codigo += "\n<td>" + isStatic + "</td>";
                codigo += "\n<td>" + simbolo.posRelativa + "</td>";
                codigo += "\n<td>" + Tipo[simbolo.tipo] + "</td>";
                codigo += "\n<td>" + clase.nombre + "</td>";
                codigo += "\n</tr>";
                index++;
            });
            clase.entorno.metodos.forEach(function (metodo) {
                var atributo = metodo.atributos;
                var visibilidad = atributo['visibilidad'];
                var isStatic = atributo['isStatic'];
                codigo += "\n<tr>";
                codigo += "\n<td>" + index + "</td>";
                codigo += "\n<td>" + metodo.id + "</td>";
                codigo += "\n<td>" + "Metodo/Funcion" + "</td>";
                codigo += "\n<td>" + Visibilidad[visibilidad] + "</td>";
                codigo += "\n<td>" + isStatic + "</td>";
                codigo += "\n<td>" + "-" + "</td>";
                codigo += "\n<td>" + Tipo[metodo.tipo] + "</td>";
                codigo += "\n<td>" + clase.nombre + "</td>";
                codigo += "\n</tr>";
                index++;
                metodo.padre.listaSimbolos.forEach(function (simbolo) {
                    var atributo = simbolo.atributo;
                    var visibilidad = atributo['visibilidad'];
                    var isStatic = atributo['isStatic'];
                    codigo += "\n<tr>";
                    codigo += "\n<td>" + index + "</td>";
                    codigo += "\n<td>" + simbolo.id + "</td>";
                    codigo += "\n<td>" + "variable" + "</td>";
                    codigo += "\n<td>" + Visibilidad[visibilidad] + "</td>";
                    codigo += "\n<td>" + isStatic + "</td>";
                    codigo += "\n<td>" + simbolo.posRelativa + "</td>";
                    codigo += "\n<td>" + Tipo[simbolo.tipo] + "</td>";
                    codigo += "\n<td>" + clase.nombre + "_" + metodo.id + "</td>";
                    codigo += "\n</tr>";
                    index++;
                });
            });
        });
        return codigo;
    };
    return Reporte;
}());
