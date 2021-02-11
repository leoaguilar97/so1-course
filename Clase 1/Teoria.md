# ¿QUÉ ES UN SISTEMA OPERATIVO?

Un sistema operativo actúa como un intermediario entre el usuario de una computadora y el hardware de la misma.

Proporciona un entorno en el que el usuario puede ejecutar programas de una manera **práctica** y **eficiente**.

Básicamente es software manejando hardware; el hardware proporciona mecanismos apropiados, impedir que los programas de usuario interfieran con el funcionamiento del sistema.

Proporciona bases a los programas de aplicación, es un intermediario entre usuario y hardware.

Algunos sistemas operativos se desarrollan para ser _prácticos_, como Windows y MacOS; y otros para ser _eficientes_ (Solaris, Centos), y algunos para ambos (Suse, Fedora).

# ¿QUÉ HACE UN SISTEMA OPERATIVO?

Los sistemas informáticos se dividen en cuatro componentes:

1. Hardware: Así como la unidad central de procesamiento, la memoria, dispositivos E/S. Proporcionan los recursos básicos al sistema.

2. Sistema operativo
3. Programas de aplicación: Procesadores de texto, hojas de cálculo, compiladores, exploradores web, etc. Definen la forma en la que se empleará los recursos del hardware para resolver problemas informáticos a los usuarios.
4. Usuarios

_Un sistema operativo es similar a un gobierno; no realiza ninguna función útil por si mismo,pero proporciona un entorno en el que los otros programas pueden llevar a cabo un trabajo útil._

**El sistema operativo es el programa más íntimamente relacionado al hardware**

El S.O. se enfrenta a numerosas y conflictivas solicitudes de recursos; por ello debe decidir cómo asignar a los programas y usuarios específicos de modo que se puedan utilizar de forma eficiente y equitativa.

Es un programa de control, gestiona la ejecución de los programas de usuario para evitar errores y mejorar el uso de la computadora.

## Una definición más formal

En general no disponemos de una definición de S.O. que sea totalmente adecuada, los sistemas operativos existen porque ofrecen una forma razonable de resolver problemas y crear un sistema informático utilizable.

**No hay una definición universalmente aceptada de qué forma parte de un sistema operativo**.

Sin embargo, una definición común es que un sistema operativo es aquel programa que se ejecuta contínuamente en la computadora, al que usualmente se le denomina Kernel.

Una computadora en general cuenta con procesadores, memoria principal, dispositivos, interfaces de red etc. Es un sistema complejo y si todos los programadores de aplicaciones tuvieran que comprender el funcionamiento de todas las partes no se escribiría ningún
código.

El programa con el que generalmente estamos acostumbrados a utilizar se denomina _SHELL_ cuando el sistema está basado en texto y _GUI_ cuando utiliza gráficos o íconos.

Este **no forma parte** del sistema operativo, pero lo utiliza para llevar a cabo su trabajo al interactuar con el usuario.

Parte del problema definiendo qué es un sistema operativo es que realizan dos funciones básicas que no están relacionadas entre sí.

Estas son (1) proporcionar a los programadores de aplicaciones un conjunto abstracto de recursos simples, en vez de complejos conjuntos de hardware; y (2) administrar estos recursos.

# Máquina Extendida

La arquitectura, que es el conjunto de instrucciones, organización de memoria, E/S y
estructura del bus, de la mayoría de las computadoras a nivel de lenguaje de máquina es
primitiva y es compleja de programar; sobre todo para los dispositivos de entrada/salida.

Un diskette PD765 tiene 16 comandos, y cada uno de ellos se especifica mediante la carga de 1 a 9 bytes en un registro del dispositivo.

Estos comandos son para leer y escribir datos, desplazar el brazo del disco y dar formato a las pistas, asi como para inicializar, detectar, reestablecer y calibrar el dispositivo controlador y las unidades.

Los comandos más básicos son read y write, y cada uno de los cuales requiere 13 parámetros que son empaquetados en 9 buytes. Especifican la dirección del bloque de disco a leer, numero de sectores por pista, el modo de grabación utilizado en el medio físico, el espacio de separación entre sectores y lo que se debe hacer con una marca de dirección de datos eliminados.

Cuando se finaliza la operacion el chip del dispositivo controador devuelve 23 campos de
estado y error, empaquetados en 7 bytes. Y aparte el programador del disco flexible
también debe de constantemente al tanto de si el motor está encendido o apagado, si está
apagado, debe encenderse y esperar el retraso de arranque para que los datos puedan ser
leídos o escritos. El motor no se debe dejar demasiado tiempo encendido porque se
desgaastará, entonces el programador se ve obligado a lidiar con el problema de elegir
entre retrasos largos de arranque o desgastar los discos flexibles y posterirmente perder
todos los datos.

Es obvio que programar todo esto conlleva a un sinfín de validaciones y seguramente lo que
se está programando no es una lectura de archivos, sino esta es más bien una función dara _por sentada_ del programa.

La abstracción es clave para lidiar con la complejidad. Las buenas abstarcciones convierten tareas imposibles en tareas manejables. La base de la ciencia siempre ha sido aplicar innovaciones para seguir creando innovaciones, y la misma metodología es aplicada al momento
de realizar abstracciones computacionales.

## Convertir lo feo a lo bonito

Una abstracción que casi cualquier usuario de computadora comprende es el archivo, una
pieza util de información. Es fácil lidiar con fotografías, correos y páginas web, que con detalles de los discos.

El hardware es feo, muchas veces presentan interfaces difíciles e inconsistentes, enredades, peculiares para las personas que tienen que escribir software para utilizarlos.

Se debe a la necesidad de tener compatibilidad con el hardware anterior, un deseo de ahorrar dinero, o quizá los diseñadores no tienen idea o no les interesa el problema grave que le dan a los desarrolladores.

**Una de las principales tareas del sistema operativo es ocultar hardware y presentar a los programas y sus programadores abstracciones agradables, elegantes y simples; consistentes con als que puedan trabajar.**

_Los sistemas operativos ocultan la parte fea con la parte hermosa._

## En resumen

El concepto de "máquina extendida" puede ser un poco complejo de entender
al inicio, quizá la palabra "máquina" y "extendida" no nos proveen mucha información
acerca de qué es lo que queremos dar a entender con ese nombre.

Sin embargo podemos pensarlo así, máquina debido a que estamos trabajando con una máquina, un dispositivo al que se le suministran entradas, se realizan cambios dentro a esas entradas, y nos proporciona salidas.

Y extendida debido a que nos da el poder de extender las funcionalidades que tiene,
no tenemos que preocuparnos por cada aspecto a tomar en cuenta, sino más bien empezar
a programar con todas las abstracciones que nos provee el sistema operativo.

Es como si estuvieramos utilizando _otra máquina_ pero con más funcionalidades a las que se nos provee solo con el hardware.

# Sistema Operativo como Admin. de Recursos

El sistema operativo está presente para administrar todas las piezas de un sistema complejo.

Las computadoras modernas constan de prprocesadores, memorias,
temporizadores, ets.

El trabajo del sistema operativo es proporcionar una asignación ordenada y controlada de los procesadores, memorias, dispositivos de ES entre los diversos programas que compiten por estos recursos.

Los sistemas operativos modernos permiten la ejecución simultánea de varios programas.

**El sistema operativo impone orden al caos.**

En esta visión el sistema operativo tiene como tarea principal llevar un registro de qué
programa esta utilizando qué recursos.

Acá hay un termino muy importante que se le denomina _multiplexaje_, compartir información de recursos de dos formas distintas.

## Multiplexaje

### Multiplexaje en el tiempo

Los distintos programas o usuarios toman turnos para utilizar los recursos, uno de ellos obtiene el recurso, después otro, y así en lo sucesivo.

### Multiplexaje en el espacio

En vez de que toman turnos, cada uno obtiene parte del recurso. La memoria principal se divide entre varios programas en ejecución para que cada uno pueda estar residente al mismo tiempo.

**Notar que los dos tipos de multiplexaje _no_ son mutuamente excluyentes. Mientras un recurso se puede dividir en el espacio, otro puede ser dividido en el tiempo.**

# Diseños del sistema operativo

- Monolíticos
- Capas
- MicroKernels
- Sistemas Cliente-Servidor
- Máquinas Virtuales
- ExoKernels

## Monolíticos

Se consideraba la organización más común, el sistema operativo completo se ejecuta en
modo kernel.

Se escribe como una larga colección de procedimientos enlazados entre sí por
un solo programa binario ejecutable extenso.

Cada procedimiento en el sistema tiene la libertad de llamar a cualquier otro, si este
proporciona cierto cómputo útil que el primero necesita.

Se pueden llamar entre sí sin restricción miles de procedimientos, se produce un sistema
poco manejable y difícil de comprender. No hay encapsuación de la información, todos los procedimientos son visibles para otros procedimientos.

El núcleo del sistema operativo se carga al arrancar la computadora, muchos sistemas
operativos soportan extensiones que se pueden cargar, como drivers de ES y sistemas de
archivo. En estos casos, cada componente se carga por demanda.

Linux es un ejemplo de este tipo de kernel.

## MicroKernels

Se podia fdefinir donde dibujar el l[imite entre kernel y usuario. Se pone lo mínimo posible
en el modo kernel; un error en modo kernel puede paralizar el sistema de inmediato.
Los procesos de usuario se pueden configurar para que tengan menos poder y por lo tanto
un error en ellos no sería fatal.

La idea fundamental detrás del diseño del microkernel es lograr una alta confiabilidad al
dividir el sistema operativo en módulos pequeños y bien definidos.

El único que se ejecuta en modo kernel es el microkernel y los demás procesos en modo usuario.

Al ejecutar cada driver del dispositivo y sistema de archivos como un proceso de usuario separado un error en alguno de estos procesos puede hacer que falle ese componente, pero no que falle todo el sistema.

El microkernel de MINIX3 (un ejemplo de sistema opeartivo MINIX3) solo tiene 3200 líneas de C y 800 líneas de ensamblador para las funciones de muy bajo nivel. Como las que se usan para atrapar interrupciones y conmutar procesos. Realiza alrededor de 35 llamadas al kernel para permitir que el resto del sistema operativo realice su trabajo.

Estas llamadas realizan funciones tales como asociar los drivers a las interrupciones, despalzar datos entre espacios de direcciones e instalar nuevos mapas de memoria para procesos recién creados.

Fuera del kernel el sistema se estructura como tres capas de procesos, todos se ejecutan en modo usuario, no tienen acceso físico al espacio de puiertos ES y no pueden emitir comandos de ES directamente.

## Híbridos

Básicamente son _lo mejor de dos mundos_. El kernel híbrido es un mircrokernel que tiene algo de código no escencial en el espacio del kernel, para que se ejecute más rápido de lo que lo haría estando en espacio de usuario.

Se confunde a los híbridos con los monolíticos por la capacidad de cargar módulos después del arranque. El concepto de kernel híbrido se refiere a que el kernel en cuestión usa mecanismos o conceptos de estructura tanto del diseño monolítico y microkernel. Microsoft, MacOS son kernel hibridos.

# Virtualización

En ciertas ocasiones una empresa tiene una una red intrincada de servidores, al que se le
denonmina multicomputadora. (Servidores web, SMTP, Servidores FTP, de respaldo, de
bases de datos, etc...)

Todos estos servidores se ejecutan generalmente en distintas computadoras, la razon
principal es debido a la confiabilidad. La administración no confía que un mismo sistema
operativo se ejecute las 24 horas del día los 365 o 366 días del año sin fallar.
Al colocar cada una de estas máquinas por separado se tiene cierta tolerancia a flalas, pero
es una solución costosa y difícil de administrar.

El objetivo era buscar una manera de solucionar este problema a través de utilizar menos
computadoras, por lo cual se propone como solución la tecnología de las máquinas
virtuales, que a menudo se conoce como virtualización. Este término se viene investigando
desde hace 50 años.

**Ojo**, acá realmente empieza este curso, basado en su totalidad en la nube, uno de los
pilares más importantes para este concepto es la virtualización (aparte obviamente de las
redes de computadoras)

La virtualización es el conjunto de componentes o metodología que permite la división de
recursos de hardware de una computadora en múltiples ambientes de ejecución, aplicando
conceptos como el particionamiento del hardware, software, y la emulación o simulación
parcial o completa de una arquitectura de software.

Claro que consolidar múltiples servidores de esta forma es como poner todos los huevos en
una canasta, si el servidor se llega a caer todas las máquinas virtuales se caen, y
provocaría una falla aún más catastrófica que cuando falla un solo servidor dedicado.

Sin embargo, el hardware a lo alrgo de los años se ha podido concluír que es una de las
menores razones por las cuales un sistema falla, generalmente, es debido a errores de
software, y en especial a los sistemas operativos.

La razón por la cual la virtualización peude funcionar mejor, es debido a que tiene un
software especial que se conoce como **hipervisor**, que es el único que se ejecuta en modo
kernel.

Este software tiene 100 veces menos líneas de código, por ende tiene 100 veces menos
errores.
La virtualización tiene varias ventajas más, como el ahorro de energía debido a que hay
menos hardware; hay también menos espacio que ocupar.

Otra ventaja podría ser utilizar puntos de comprobación y migrar datos entre máquinas
virtuales.

# Tipos de virtualización

## Full Virtualization

Es una técnica de virtualización que provee una simulación completa del comportamiento de hardware en una máquina virtual.

## ParaVirtualización

Provee una simulación virtual del comportamiento del hardware.

## Híbrida

Combinación de Full Virtualization y Paravirtualization

# Hipervisores

Es un programa encargado de crear y administrar las máquinas virtuales en una máquina anfitrión. Podemos llamarle _monitor de máquinas virtuales_, y en el caso de las máquinas virtualizadas, **es el único programa que se ejecuta en modo kernel**.

Existen dos tipos:

- Tipo 1: Se ejecutan directamente sobre el hardware
- Tipo 2: Se ejecutan sobre un sistema operativo anfitrión.

# Referencias

Esta es una lista de referencias que se utilizaron para realizar este texto.

- Sistemas Operativos Modernos. Tercera Edición. Tanenbaum, Andrew S.,
- Fundamentos de Sistemas Operativos, Séptima Edición. Silberschatz, Galvin, Gagne.
- Operating Systems from Scratch - Part 1. Vignesh Sekar. Udemy.
