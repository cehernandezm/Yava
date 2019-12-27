var Simbolo = /** @class */ (function () {
    function Simbolo(id, rol, tam, atributo, instrucciones, localizacion) {
        this.verdaderas = null;
        this.falsas = null;
        this.id = id;
        this.rol = rol;
        this.tam = tam;
        this.atributo = atributo;
        this.instrucciones = instrucciones;
        this.isNul = true;
        this.localizacion = localizacion;
    }
    return Simbolo;
}());
