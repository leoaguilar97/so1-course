# Módulos

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

    // Codigo dentro del evento

    // Retornar 0 si todo está bien
    // Retornar [num] como código de error
    return 0;
}

static void __exit event_exit(void) {

    // Código dentro del evento
}

// esta llamada carga la función que se ejecutará en el init
module_init(event_init);

// esta llamada carga la función que se ejecutará en el exit
module_exit(event_exit);
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

# REFERENCIAS Y LECTURAS POSTERIORES

- https://www.quora.com/What-is-the-difference-between-printk-and-seq_printf-Kernel-API
- https://elixir.bootlin.com/linux/latest/ident/seq_printf
- https://gist.github.com/NahianAhmed/074d378f0142132c5397fa0a0aa2b7a3
- https://blog.sourcerer.io/writing-a-simple-linux-kernel-module-d9dc3762c234
- https://www.thegeekstuff.com/2013/07/write-linux-kernel-module/

```

```
