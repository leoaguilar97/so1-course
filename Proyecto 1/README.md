# PROYECTO 1

## DESCRIPCION

Dada la situación actual, con la pandemia COVID-19, se require hacer un análisis en tiempo real de los datos de infecciones alrededor de Guatemala. Por ello, es necesario realizar un sistema que pueda almacenar los datos de infecciones y mostrar gráficas relevantes; así tomar mejor decisiones en la búsqueda de métodos para sobrellevar la contingencia de la mejor manera.
El sistema contará con una carga masiva de datos, los cuales tendrán un formato específico detallado más adelante; además, contarán con una app web que mostrará las gráficas y métricas más relevantes de los datos que se suministren al sistema, por último, mostrará el estado de la RAM y un listado de procesos del servidor donde se almacenarán los datos.
Se utilizarán cuatro alternativas de middlewares de mensajería; cada uno de ellos será utilizado para enviar el tráfico generado en conjunto, esto con el fin de tener una respuesta más rápida al momento de cargar datos, además de utilizar tecnología de vanguardia para sobrellevar este sistema.

## Flujo general del programa

El flujo del programa se puede visualizar en el siguiente diagrama:

![Flujo General](./SO1-PROYECTO-FLUJO.png)

En el diagrama, se sigue la siguiente convención:

| SIMBOLO                               |     NOMBRE      | DESCRIPCION                                                                |
| ------------------------------------- | :-------------: | -------------------------------------------------------------------------- |
| ![Flujo General](./img/vm.png)        | MAQUINA VIRTUAL | El recuadro donde se encuentra el símbolo es una máquina virtual distinta. |
| ![Flujo General](./img/container.png) | MAQUINA VIRTUAL | El servicio donde se encuentra está dentro de un contenedor docker.        |
