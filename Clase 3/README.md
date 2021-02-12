# Módulos Kernel

## ¿Qué es un módulo kernel?

Un módulo kernel es código binario, pueden ser cargados y eliminados del kernel según las necesidades. El objetivo es extender las funcionalidades del kernel y que estas funcionalidades puedan ser cargadas y eliminadas del núcleo bajo demanda. Estas extienden las funcionalidades del núcleo sin la necesidad de reiniciar el sistema.

El kernel tiene diseño **modular**, cuando se instala un nuevo componente o se inicia la computadora, los módulos son cargados de forma dinámica para que funcionen de forma transparente.

## ¿Dónde están y cómo los veo?

Los módulos son almacenados en un directorio especial

```bash
# Ver módulos almacenados
$ /lib/modules/[nombre_kernel]

# Ver la versión del kernel
$ uname -r

# Revisar módulos instalados, esto listará todos los módulos instalados en el kernel
$ lsmod

# Revisamos o "buscamos" unicamente un módulo
$ lsmod | grep "[nombre_modulo]"

```

## ¿Qué contiene un módulo?

En su forma más básica, un módulo contiene el siguiente código:

```c
/*
Archivo: [nombre_modulo].c
*/

// Librerías a cargar
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

MODULE_LICENSE("MODULO");
MODULE_AUTHOR("AUTOR");
MODULE_DESCRIPTION("DESCRIPCION");
MODULE_VERSION("VERSION");

// Definicion de evento principal
static int __init event_init (void) {

    // Codigo dentro del evento INIT

    // Retornar 0 si todo está bien
    // Retornar [num] como código de error
    return 0;
}

static void __exit event_exit(void) {

    // Código dentro del evento EXIT
}

// esta llamada carga la función que se ejecutará en el init
module_init(event_init);

// esta llamada carga la función que se ejecutará en el exit
module_exit(event_exit);
```

Aparte, necesitaremos de un archivo especial llamado Makefile; este contendrá el siguiente contenido:

```Makefile
# Archivo: Makefile
obj-m += timestamps.o # Definir el nombre del archivo que esperamos de salida
all:
    # Definir que se hará cuando se compile
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd)
modulesclean:
    # Definir que se hará cuando se limpie el módulo
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd) clean
```

Este archivo lo utilizaremos para compilar todo el código que escribimos en el módulo.

Ahora que ya tenemos todo lo necesario para subir nuestro módulo, debemos de agregarle el código que queremos que realice.

## Dependencias

Se necesitan algunas dependencias que no están incluídas en general en las distribuciones de linux.

Para el caso de Ubuntu y debian, se pueden obtener de esta manera:

```bash
# Descargar headers del módulo específico que tenemos
$ sudo apt-get install linux-headers-$(uname -r)

# Descargar build essentials, para compilar el código c
$ sudo apt-get install build-essential
```

## Pasos a seguir para montar un módulo

```bash
# Instalar linux headers
$ sudo apt-get install linux-headers-$(uname -r)

# Instalar dependencias para compilar c y c++
$ sudo apt-get install build-essential
```

Para ver el directorio actual, y la versión del kernel, podemos usar los siguientes comandos.

Ya después que tenemos un módulo escrito, en el archivo [nombre_modulo].c:

```bash
# Ir al directorio del modulo
$ cd [directorio_modulo]

# Compilar archivos
$ make
```

Revisamos la información que generó el make.

```bash
# Revisar archivos salidos
$ ls -l

# -rw-rw-r-- 1 [usr] [usr]   169 [fecha y hora] Makefile
# -rw-rw-r-- 1 [usr] [usr]    74 [fecha y hora] modules.order
# -rw-rw-r-- 1 [usr] [usr]     0 [fecha y hora] Module.symvers
# -rw-rw-r-- 1 [usr] [usr]  2895 [fecha y hora] [nombre_modulo].c
# -rw-rw-r-- 1 [usr] [usr]  6080 [fecha y hora] [nombre_modulo].ko
# -rw-rw-r-- 1 [usr] [usr]   603 [fecha y hora] [nombre_modulo].mod.c
# -rw-rw-r-- 1 [usr] [usr]  2584 [fecha y hora] [nombre_modulo].mod.o
# -rw-rw-r-- 1 [usr] [usr]  5736 [fecha y hora] [nombre_modulo].o
```

Procedemos a montar el módulo

```bash
# Instalar el módulo con el comando insmod
# https://linux.die.net/man/8/insmod#:~:text=insmod%20is%20a%20trivial%20program,is%20taken%20from%20standard%20input
# No se espera ninguna salida cuando este comando es exitoso.

$ sudo insmod [nombre_modulo].ko
```

Ahora, revisamos que el módulo esté instalado correctamente. Para ver el listado de módulos cargados:

```bash
# Revisar los logs de los modulos
$ sudo dmesg

# Ahora, revisamos el documento generado, cada vez que lo revisemos se reescribirá
$ cat /proc/[nombre_modulo]

```

**El resultado de este último comando sera escrito en la pantalla.**

Para eliminar el módulo (para volver a cargarlo o simplemente eliminarlo).

```bash

# Eliminar el modulo
# No se espera ninguna salida cuando este comando es exitoso.

$ sudo rmmod "[nombre_modulo]"

```

# API Node

Luego de tener instalado el módulo kernel, podemos acceder a él en el archivo "/procs/[nombre_modulo]", en el caso específico del ejemplo de clase, en /procs/timestamps.

Este archivo puede ser leído por _cualquier librería de archivos_, esto quiere decir que no necesitamos de una arquitectura ni lenguaje específico, unicamente necesitamos estar en el grupo de permisos de lectura del archivo.

En este caso, utilizaremos NodeJS para realizar una muy pequeña API que únicamente nos devolverá el timestamp en formato HTML y como un string.

## NodeJS

Node.js es un entorno de tiempo de ejecución de JavaScript (de ahí su terminación en .js). Este entorno de tiempo de ejecución en tiempo real incluye todo lo que se necesita para ejecutar un programa escrito en JavaScript.

Nodejs facilita la realización de APIs y de servidores web, debido a la gran versatilidad de JavaScript.

En este caso, realizaremos la API utilizando un framework llamado express.

Node.js utiliza un modelo de entrada y salida sin bloqueo controlado por eventos que lo hace ligero y eficiente (con entrada nos referimos a solicitudes y con salida a respuestas). Puede referirse a cualquier operación, desde leer o escribir archivos de cualquier tipo hasta hacer una solicitud HTTP.

La idea principal de Node.js es usar el modelo de entrada y salida sin bloqueo y controlado por eventos para seguir siendo liviano y eficiente frente a las aplicaciones en tiempo real de uso de datos que se ejecutan en los dispositivos. Es una plataforma que no dominará el mundo del desarrollo web pero si que satisface las necesidades de una gran mayoría de programadores.

La finalidad de Node.js no tiene su objetivo en operaciones intensivas del procesador, de hecho, usarlo para programación de más peso eliminará casi todas sus ventajas. Donde Node.js realmente brilla es en la creación de aplicaciones de red rápidas, ya que es capaz de manejar una gran cantidad de conexiones simultáneas con un alto nivel de rendimiento, lo que equivale a una alta escalabilidad.

## Express

Express.js es un framework para Node.js que sirve para ayudarnos a crear servicios web, e incluso aplicaciones web. Provee de todas las herramientas necesarias para cumplir con esta misión (batteries-included), como routers, manejo de sesiones, cookies; y también mucha adaptabilidad utilizando middlewares.

En el caso de este ejemplo, lo utilizaremos únicamente para realizar una API que nos retornará el timestamp y posteriormente lo guardará.

https://expressjs.com/

## MongoDB

MongoDB es una base de datos NoSQL que utiliza documentos para guardar la información, ofrece muy buena escalabilidad y flexibilidad.
En este caso, utilizaremos un servicio SaaS llamado Mongo Atlas, que será utilizado para tener mongodb en la nube.

Página de MongoAtlas: https://cloud.mongodb.com/

Se creará un cluster en mongoatlas para su utilización de forma fácil.

## Mongoose

Mongoose es una librería para Node. js que nos permite escribir consultas para una base de datos de MongooDB, con características como validaciones, construcción de queries, middlewares, conversión de tipos y algunas otras, que enriquecen la funcionalidad de la base de datos.

https://mongoosejs.com/

# Docker

## Docker build

Necesitamos realizar un build a nuestro Dockerfile, basicamente necesitamos crear una imagen.

Docker puede construir imágenes automáticamente, leyendo las instrucciones indicadas en un fichero Dockerfile. Se trata de un documento de texto que contiene todas las órdenes a las que un usuario dado puede llamar, desde la línea de comandos, para crear una imagen.

Referencia docker build: https://docs.docker.com/engine/reference/builder/

Los pasos principales para crear una imagen a partir de un fichero Dockerfile son:

1. Crear un nuevo directorio que contenga el fichero, con el guión y otros ficheros que fuesen necesarios para crear la imagen.
2. Crear el contenido.
3. Construir la imagen mediante el comando docker build.

```bash
# Sintaxis básica de docker build

$ docker build [opciones] RUTA | URL | -

# En nuestro caso:
# Ir al directorio donde esta el Dockerfile
$ cd [PATH_AL_DOCKERFILE]

# Crear imagen utilizando build, notar el -t
# -t define un tag con el que nos referiremos a la imagen
$ docker build . -t node:14
```

## Docker run

El comando docker run crea un contenedor desde una imagen, e inicia el contenedor.

```bash
# Sintaxis básica de docker run
$ docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# En nuestro caso:
# -dit dice a docker que haga detach (correr en segundo plano), y que el contenedor podra ser interactivo con una consola de tipo tty.
# --name le asigna un nombre al container
# -v copia al volumen del contenedor /elements/procs el contenido de la carpeta /procs en el sistema operativo
# -p dice que puerto exponer al mundo
# por ultimo ponemos el tag que le definimos a la imagen
$ docker run -dit --name node-api -v /proc/:/elements/procs/ -p 80:80 node:14
```

## Accediendo a la api

Al correr estos comandos esperamos que docker nos responda con un alfanumérico, este es el identificador del contenedor; para posteriormente utilizarlo
para reiniciarlo, eliminarlo, pararlo, etc.

Podemos acceder al contenedor con el siguiente comando:

```bash
$ docker exec -i -t [id_contenedor] /bin/bash
```

Esto nos dejará acceder al contenedor e interactuar en la consola con él.

Nuestra API ya está corriendo actualmente, podemos ver su estado con el comando

```bash
$ docker container list
```

En este se mostrará información del contenedor, como por ejemplo:

```bash
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                NAMES
ab70ce605965   node:14   "docker-entrypoint.s…"   32 minutes ago   Up 20 minutes   0.0.0.0:80->80/tcp   node-api-v2
```

Por último, podemos acceder a nuestra api realizando una petición en CURL o en nuestro navegador.

Con Curl:

```bash
$ curl localhost:80/
```

# REFERENCIAS Y LECTURAS POSTERIORES

## Docker

- https://docs.docker.com/engine/reference/builder/
- https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- https://linuxize.com/post/docker-run-command/
- https://docs.docker.com/engine/reference/run/

## Modulos

- https://www.quora.com/What-is-the-difference-between-printk-and-seq_printf-Kernel-API
- https://elixir.bootlin.com/linux/latest/ident/seq_printf
- https://gist.github.com/NahianAhmed/074d378f0142132c5397fa0a0aa2b7a3
- https://blog.sourcerer.io/writing-a-simple-linux-kernel-module-d9dc3762c234
- https://www.thegeekstuff.com/2013/07/write-linux-kernel-module/
