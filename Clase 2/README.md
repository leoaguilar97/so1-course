# Virtualización

# Hipervisores

## Tipo 1. Bare Metal Hypervisors

Esencialmente el sistema operativo que corre en el hardware para que puedan utilizarse VM's encima.

- VMWare
- Citrix
- Redhat

Tiene acceso directo al hardware físico y le otorga estos recursos a las máquinas virtuales.

## Tipo 2

**No tiene acceso directo al hardware**.

- VMWare Player
- Parallels for machines
- VMWare Workstation

Este tipo de hipervisor está ejecutándose encima de otro sistema operativo.

# Virtualización a nivel de sistema operativo

## Docker

### Big Picture

Docker es una plataforma qeu te deja realizar paquetes, desarrollar y correr aplicaciones en contenedores.

Un contenedor es un ambiente virtual encima del sistema operativo; en él, se captura todo el software, librerías, dependencias, etc. Que se deseen utilizar.

Todos los contenedores están montados encima del kernel, y los contenedores se ejecutan en un ambiente **privado**.

No tienen la capacidad de afectar otros contenedores, por lo que se les denomina _ISOLATED_.

### ¿Por qué usamos Docker?

Docker provee una solución ligera, al menos más que las máquinas virtuales; y a diferencia, no necesitan todo el sistema operativo para ejecutarse.

Puedes imaginarte una empresa que tiene 5 aplicaciones, y cada aplicación necestia su propio ambiente con sus propias dependencias; por ejemplo, NodeJS 13, NodeJS 8 para manejar código Legacy, Python 3, Python 2.7; el último ambiente podría ser cualquiera.

Se podrían tener 5 máquinas virtuales, cada una con su diferente sistema operativo y con diferentes dependencias; sin embargo, esto nos ocuparía mucho espacio en disco (por ejemplo, 10GB por disco duro virtualizado, serían 50 GB); aparte nos dividiría los recursos de RAM y CPU por VM.

Además, podrían ser aplicaciones desarrolladas por varias personas, con lo cual cada desarrollador tendría que contar con la misma cantidad de almacenamiento por cada computadora
donde están alojadas las aplicaciones.

En cambio, utilizando Docker, utilizaríamos únicamente el espacio que ocupe cada contenedor, uno para cada aplicación; cada desarrollador tendría acceso a la misma imagen que genera el contenedor, y podría ser utilizada en cualquier sistema operativo donde esté docker instalado.

Este es solo un ejemplo de miles donde Docker se utiliza de manera adecuada y es una solución más óptima y ligera;

Uno de los beneficios más grandes de Docker es la _portabilidad_, cualquier contenedor realizado con Docker puede ser ejecutada en cualquier computadora que tenga instalada Docker.

Otro de los beneficios es la utilización de Docker en CI-CD y DevOps; por su facilidad de configurar varios ambientes de desarrollo, y una buena administración de pipelines.

### Main Features

- Crear contenedores e imágenes

Docker deja crear imágenes, y se pueden crear _N_ contenedores de esa misma imágen. (Como réplicas)

- Docker-Compose
  Aplicaciones con múltiples contenedores

- Docker Swarm
  Para utilizar múltiples máquinas ejecutando Docker.

## Docker Containers

### ¿Qué es un contenedor de Docker?

Es un ambiente aislado que se ejecuta en el S.O. del host, nos deja correr aplicaciones y código específico.

Un container comparte su kernel con otros containers. Se ejecutan como un proceso aislado en modo usuario del sistema operativo. No están atados a ninguna infraestructura, simplemente corren en cualquier computadora o infraestructura en la nube.

Algunos beneficios de utilizar contenedores son:

- **Flexibles**
  Hasta las aplicaciones más complejas se pueden contenerizar.
- **Ligeros**
  Comparten kernel del sistema operativo anfitrión, esto hace que sea mucho más eficiente comparado con las VMs.
- **Portables**
  Es posible construírlo y ejecutarlo en cualquier computadora con Docker.
- **Escalables**
  Se pueden aumentar y automáticamente distribuír réplicas de containers en datacenters.
- **Seguros**
  Aplican restricciones agresivas de aislamiento sin que se necesiten configurar nada.

### Docker Engine

- Consiste en el server llamado _Docker_, un _API_, y un _CLI_ con el que se permite interactuar.

- Este server generalmente es llamado **Docker Daemon**.
  _Un daemon son procesos en segundo plano ejecutándose en un sistema operativo._

- El Docker Daemon es como un equipo de construcción, este equipo se encarga de construír nuestros contenedores. La API es como los planos de construcción, y a través del CLI nosotros, como _clientes_ podemos decirle al equipo de construcción exactamente cómo queremos que construya nuestros planos.

## Docker Container Environments

### ¿Qué provee el ambiente de contenedores?

- Los procesos de un contenedor no pueden afectar los procesos de otros contenedores.
- Contiene límites de recursos, como CPU y Memoria.
- Application-Specific code, podemos correr una aplicación en un contenedor, y todas las dependencias están adentro del contenedor también, no del host.
- Esto es especialmente útil cuando se necesitan varios ambientes, o diferentes versiones.

### ¿Por qué son útiles?

- Portabilidad en múltiples sistemas operativos
- Less Time Setting Up, More Time Coding
- Acceso al mismo código, siempre corre igual en cualquier ambiente.
- Development, CI-CD environments.

## Docker Images

- Son _read-only templates_, con instrucciones para crear un contenedor de docker.
- Definel el código del contenedor, librerías, variables de ambiente, archivos de configuración y más.

La imagen dice cómo crear un contenedor, y muchos contenedores se pueden crear a partir de la misma imagen.

Podemos ver a las imágenes y contenedores con la misma relación que las clases con objetos, como en la programación orientada a objetos. La clase, al igual que la imagen, define como los objetos (en este caso contenedores) serán creados.

Los contenedores son instancias ejecutándose de una imagen.

## Docker Hub

Colecta imágenes de usuarios Docker, y los pone en línea. En DockerHub se encuentran miles de imágenes; estas tienen configuraciones ya listas y solo en espera de ser utilizadas para crear contenedores.

# Cloud Computing

## ¿Qué es cloud computing?

En una definición sencilla, la distribución de recursos informáticos bajo demanda a través de internet mediante un esquema de pago por uso. En lugar de comprar, tener y mantener servidores físicos (en lugar de poseer un datacenter), es posible acceder a los servicios que nos ofrecen estos a través de internet.

_Cloud is about how you do computing, not where you do computing_
-Paul Maritz, CEO de VMWare.

## Tipos de Cloud

- **Nube Pública**: Son los servicios informáticos que ofrecen proveedores externos a través de internet pública y que están disponibles para todo aquel que desee utilizarlos.

- **Nube Private**: Son servicios informáticos que se ofrecen a través de internet o de una red interna privada solo a algunos usuarios y no al público general.

## Modelos de Cloud

### Infrastructure as a Service (IaaS)

La infraestructura como servicios es la capa inferior y es un medio por el que se provee almacenamiento básico y capacidades de cómputo.

### Platform as a Service (PaaS)

Es una encapsulación de una abstracción de un ambiente de desarrollo de aplicaciones.

### Software as a Service (SaaS)

Es la capa más alta y se caracteriza como una aplicación completa ofrecida como un servicio bajo demanda a través de internet. Esto evita la necesidad de instalar la aplicación en nuestra computadora, evitando asumir los costos de soporte y el mantenimiento de hardware y software.
