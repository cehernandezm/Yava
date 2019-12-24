declare function agregarClase(clase:any):any;
declare function getClase(id:any):any;
class Clase implements Instruccion {
    modificador: Array<Modificador>;
    nombre: String;
    instrucciones: Array<Instruccion>
    extender: String;
    l: number;
    c: number;

    constructor(modificiador: Array<Modificador>, nombre: String, instrucciones: Array<Instruccion>, extender: String, l: number, c: number) {
        this.modificador = modificiador;
        this.nombre = nombre;
        this.instrucciones = instrucciones;
        this.extender = extender;
        this.l = l;
        this.c = c;
    }


    ejecutar(entorno:Entorno): Object {
        return null;
    }

    primeraPasada(entorno: Entorno): Object {
        let claseTemp: Simbolo = getClase(this.nombre);
        if (claseTemp != null) {
            let mensaje: MensajeError = new MensajeError("Semantico", "La clase: " + this.nombre + " ya existe", entorno.archivo, this.l, this.c);
            Auxiliar.agregarError(mensaje);
            return mensaje;
        }

        let visibilidad = null;
        let isStatic: Boolean = false;
        let isAbstract: Boolean = false;
        let isFinal: Boolean = false;

        /**
         * VERIFICAMOS QUE NO TENGA MODIFICADORES DE MAS
         * Y QUE VENGAN SOLO UNA VEZ
         */
        if (this.modificador != null) {
            this.modificador.forEach(element => {
                switch (element) {
                    case Modificador.PUBLIC:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PUBLIC;
                        break;
                    case Modificador.PRIVATE:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PRIVATE;
                        break;
                    case Modificador.PROTECTED:
                        if (visibilidad != null) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya posee una visibilidad", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        visibilidad = Modificador.PROTECTED;
                        break;
                    case Modificador.STATIC:
                        if (isStatic) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Static", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isStatic = true;
                        break;
                    case Modificador.FINAL:
                        if (isFinal) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Final", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isFinal = true;
                        break;
                    case Modificador.ABSTRACT:
                        if (isAbstract) {
                            let mensaje: MensajeError = new MensajeError("Semantico", "La clase ya es Abstract", entorno.archivo, this.l, this.c);
                            Auxiliar.agregarError(mensaje);
                            return mensaje;
                        }
                        isAbstract = true;
                        break;
                }

            });
        }
        if (visibilidad == null) visibilidad = Modificador.PUBLIC;
        
        /**
         * SI VAMOS A EXTENDER DE UNA CLASE
         */
        if (this.extender != null) {
            claseTemp = getClase(this.extender);
            if (claseTemp == null) {
                let mensaje: MensajeError = new MensajeError("Semantico", "No existe la clase: " + this.extender + " que se quiere extender", entorno.archivo, this.l, this.c);
                Auxiliar.agregarError(mensaje);
                return mensaje;
            }
            this.instrucciones = this.instrucciones.concat(claseTemp.instrucciones);

        }
        let tam: number = this.instrucciones.length;
        let s:Simbolo = new Simbolo(this.nombre,Rol.CLASE,tam,Auxiliar.crearObjectoAtributos(visibilidad,isFinal,isStatic,isAbstract),this.instrucciones);
        s.entorno = entorno;
        agregarClase(s);

        this.instrucciones.forEach(element => {
            if(element instanceof Declaracion) element.ejecutar(entorno);
        });
        return true;
    }
}