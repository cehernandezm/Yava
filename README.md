<h1 align="center">
  <br>
  <a></a>
  <br>
 YAVA
  <br>
</h1>

<h4 align="justify">Yava es una aplicacion web desarrollada en html5,css3,javascript y typescript. El editor permite un lenguaje de alto nivel(Java) para su traduccion a un lenguaje de bajo nivel(Tres Direcciones)
para su ejecucion,debug y optimizacion</h4>


  <a href="https://github.com/wolfghost9898/Yava/actions"><img alt="GitHub Actions status" src="https://github.com/wolfghost9898/Yava/workflows/Node%20CI/badge.svg">[![GitHub issues](https://img.shields.io/github/issues/Naereen/StrapDown.js.svg)](https://github.com/wolfghost9898/Yava/issues) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)  

<p align="center">
  <a href="#instalar">Instalar</a> •
  <a href="#paquetes">Paquetes</a>•
  <a href="#como-funciona">Como Funciona</a> •
  <a href="#license">Licencia</a>•
  <a href="#soporte">Soporte</a>
</p>

## Instalar

Para clonar esta aplicacion necesitas tener instalado [Git](https://git-scm.com) and [Nodejs](https://nodejs.org/es/)

```bash
# Clonar el repositorio
$ git https://github.com/wolfghost9898/Yava

# Entrar a la carpeta
$ cd Yava

# Ejecutar la aplicacion
$ node index.js
```

Nota: Para ejecutar el proyecto es necesario tener instaladas los package necesarios.



## Como Funciona
La aplicacion realiza tres tipos de analisis al codigo de Alto nivel
> * <b>Lexico</b> Que todos los simbolos de la entrada esten en nuestros simbolos permitidos
> * <b>Sintactico</b> Que la estructura sea correcta
> * <b>Semantico</b> Que tenga coherencia el codigo a ejecutar

Si no se encuentra ningun error se procede a realizar la traduccion a Tres Direcciones.
<br/>
En tres direcciones se permite
> * <b>Ejecutar</b> Se ejecuta el codigo tres direcciones realizando los mismos analisis que para el lenguaje de alto nivel
> * <b>Optimizar</b> Se aplican 5 reglas de optimizacion al codigo
> * <b>Debbugear</b> Se muestra en tiempo real la instruccion que se esta ejecutando asi mismo las estructuras del Stack Y Heap


## Paquetes
### Express
```bash
$ npm i express
```
### FS
```bash
$ npm i fs
```

### Body-Parser
```bash
$ npm i body-parser
```
### Jison
>[Analizador](https://zaa.ch/jison/) Lexico-Sintactico
```bash
$ npm i jison
```






## License
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

## Soporte


- Twitter at <a href="https://twitter.com/cehernandezz" target="_blank">`@cehernandezz`</a>

---

