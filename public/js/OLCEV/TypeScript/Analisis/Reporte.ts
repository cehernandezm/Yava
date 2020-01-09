declare var listaClases: Array<Clase>;
class Reporte {


    generarReporte(): String {
        let index: number = 0;
        let codigo: String = "";
        listaClases.forEach(clase => {
            let atributo: Object = clase.atributos;
            let visibilidad: Visibilidad = atributo['visibilidad'] as Visibilidad;
            let isStatic: Boolean = atributo['isStatic'] as Boolean;
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
            clase.entorno.listaSimbolos.forEach(simbolo => {
                let atributo: Object = simbolo.atributo;
                let visibilidad: Visibilidad = atributo['visibilidad'] as Visibilidad;
                let isStatic: Boolean = atributo['isStatic'] as Boolean;
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
            clase.entorno.metodos.forEach(metodo => {
                let atributo: Object = metodo.atributos;
                let visibilidad: Visibilidad = atributo['visibilidad'] as Visibilidad;
                let isStatic: Boolean = atributo['isStatic'] as Boolean;
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
                metodo.padre.listaSimbolos.forEach(simbolo => {
                    let atributo: Object = simbolo.atributo;
                    let visibilidad: Visibilidad = atributo['visibilidad'] as Visibilidad;
                    let isStatic: Boolean = atributo['isStatic'] as Boolean;
                    codigo += "\n<tr>";
                    codigo += "\n<td>" + index + "</td>";
                    codigo += "\n<td>" + simbolo.id + "</td>";
                    codigo += "\n<td>" + "variable" + "</td>";
                    codigo += "\n<td>" + Visibilidad[visibilidad] + "</td>";
                    codigo += "\n<td>" + isStatic + "</td>";
                    codigo += "\n<td>" + simbolo.posRelativa + "</td>";
                    codigo += "\n<td>" + Tipo[simbolo.tipo] + "</td>";
                    codigo += "\n<td>" + clase.nombre + "_" + metodo.id +  "</td>";
                    codigo += "\n</tr>";
                    index++;
                });
            });
        });
  

        return codigo;
    }
}