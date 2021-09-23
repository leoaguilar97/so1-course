# PROMETHEUS

## Descarga e instalación

Para descargar prometheus se utiliza lo siguiente:

```shell
# Descargar la ultima version de prometheus
$ wget -c https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.linux-amd64.tar.gz

# Instalar el tar
$ tar xvfz prometheus-*.tar.gz

# Nos vamos al folder donde está contenido
$ cd prometheus-*

# En este folder se encuentra el ejecutable de prometheus. También se encuentra un ejemplo de cómo utilizar prometheus.

$ ls -l

# La salida esperada es:
# -rw-r--r-- 1 leoag leoag    11357 Mar 31 12:07 LICENSE
# -rw-r--r-- 1 leoag leoag     3646 Mar 31 12:07 NOTICE
# drwxr-xr-x 2 leoag leoag     4096 Mar 31 12:07 console_libraries
# drwxr-xr-x 2 leoag leoag     4096 Mar 31 12:07 consoles
# drwxrwxr-x 4 leoag leoag     4096 May  3 11:25 data
# -rwxr-xr-x 1 leoag leoag 88636724 Mar 31 11:58 prometheus
# -rw-r--r-- 1 leoag leoag      926 Mar 31 12:07 prometheus.yml
# -rwxr-xr-x 1 leoag leoag 77930000 Mar 31 12:00 promtool

# Vemos el contenido de prometheus.yml
$ cat prometheus.yml
```

El contenido del archivo es el siguiente:

```yml
global:
  scrape_interval: 15s # By default, scrape targets every 15 seconds.

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  external_labels:
    monitor: "codelab-monitor"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s

    static_configs:
      - targets: ["localhost:9090"]
```

## Instalar Node Exporter

Para obtener todas las métricas de la máquina virtual, se utilizará Node Exporter. Lo podemos descargar desde esta página: https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz

### Instalar Node Exporter

```shell
# Descargar el precompilado
$ wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz

# Descomprimir el tar
$ tar xvfz node_exporter-*.*-amd64.tar.gz

# Cambiarse al directorio de node_exporter
$ cd node_exporter-*.*-amd64

# Ejecutar el server de node_exporter
$ ./node_exporter
```

Ahora procedemos a crear el job para controlar las métricas de Prometheus.

```yml
scrape_configs:
  - job_name: node
    static_configs:
      - targets: ["localhost:9100"]
```

## Grafana

Para visualizar de mejor manera los datos, Grafana puede ser utilizado para crear un dashboard con múltiples gráficas.

### Instalando Grafana

```bash
# Descargar el paquete
$ sudo apt-get install -y apt-transport-https
$ sudo apt-get install -y software-properties-common wget
$ wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

# Instalar el paquete
$ echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# Finalizar instalacion de grafana
$ sudo apt-get update
$ sudo apt-get install grafana

```

# Configuración de Monitoreo

En el archivo prometheus.yml se pone la siguiente configuración:

```yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

  external_labels:
    monitor: "codelab-monitor"

rule_files:
  - "prometheus.rules.yml"

scrape_configs:
  - job_name: "prometheus"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:9100"]

  - job_name: "localhost"
    scrape_interval: 5s
    static_configs:
      - targets: ["localhost:4000"]
        labels:
          alias: host
```

# Iniciando el server

Para iniciar el server de prometheus

```bash
# Irse al directorio donde esta prometheus
$ cd /home/leoag/prometheus/prometheus-2.26.0.linux-amd64

# Iniciar prometheus
$ ./prometheus --config.file=prometheus.yml
```

Iniciar el server de node exporter

```bash
# Irse al directorio donde esta node exporter
$ cd /home/leoag/node_exporter-1.1.2.linux-amd64

# Iniciar node exporter
$ ./node_exporter
```

Iniciar el server de grafana

```bash
# Inicializar el server de grafana
$ sudo systemctl daemon-reload
$ sudo systemctl start grafana-server
$ sudo systemctl status grafana-server

# PM2 start el server
$ pm2 restart all
```

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
