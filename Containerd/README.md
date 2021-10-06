# Containerd

A menudo asociamos docker y contenedores, incluso podemos cometer el error de decir que son términos para definir el mismo concepto. Cuando pensamos en contenedores rápidamente se nos cruza Docker por la cabeza. Sin embargo, el término contenedores no empezó con Docker, y aunque el papel de Docker en el mundo del desarrollo es sumamente importante y relevante por ser el pionero de la popularización de los contenedores en el desarrollo y devops, en la actualidad existen diversas tecnologías que también pueden hacer lo que realiza docker e incluso más.

Como siempre, todo es cuestión de gustos y de _necesidades_.

## Un poco de historia...

En su lanzamiento en 2013, Docker era un proyecto que tenía todo lo necesario para construir y correr contenedores. El único problema de Docker era que le faltaba una manera fácil de orquestar sus contenedores y su deployment en la nube.

Al final de 2013, Google como siempre innovando en tecnología desarrolló un prototipo de lo que pronto se convertiría como Kubernetes. Esta herramienta estaba diseñada para simplificar las operaciones que se realizan con Docker a lo largo de diferentes máquinas o clústers.

Kubernetes y Docker tenían una relación estrecha, Kubernetes utilizaba Docker directamente para interactuar con los contenedores, incluso si solo utilizaba una pequeña parte de todas las herramientas y opciones que Docker proporcionaba; en efecto lo único que necesitaba Kubernetes era la parte que ejecutaba los contenedores.

Docker tenía una interfaz de utilización desarrollada para personas que conocían de tecnología, pero al final usuarios finales. Y esto le hizo difícil a Kubernetes mostrar todo su poder. Antes, se utilizaba una herramienta dedicada que se llamaba Dockershim para obtener la funcionalidad básica y a bajo nivel de Docker. El problema era que Docker y Kubernetes no estaban siguiendo la misma trayectoria en su crecimiento.

Docker por su cuenta lanzó Swarm, una alternativa para Kubernetes que ofrecía una orquestación que venía por defecto en Docker.

Mientras esto pasaba, Kubernetes seguía ganando incluso más popularidad que Docker, creció y se convirtió en una de las herramientas más innovadoras desarrolladas. Cada vez más herramientas parecidas a Docker fueron lanzandose, y las limitaciones de Docker se fueron volviendo bastante claras.

Al mismo tiempo, se iniciaba a estandarizar los formatos y configuraciones que debían tener los contenedores en el OCI Open Container Iniciative. Esto resultó en contenedores estandarizados los cuales múltiples runtimes podían ejecutar, entre ellos, Docker.

Docker extrajo su programa para ejecución de contenedores en un nuevo proyecto, containerd. Containerd fue donado al CNCF Cloud Native Computing Foundation para proveer a la comunidad una base para crear nuevas herramientas para manejar contenedores.

Herramientas como containerd hicieron que Kubernetes pudieran acceder a los niveles más bajos de Docker para extraer únicamente la funcionalidad que necesiten. En vez de utilizar Docker, ahora pueden utilizar containerd que les provee una interfaz más accesible y flexible de como manejar contenedores.

Además, con la estandarización de OCI ahora Kubernetes puede ser utilizada con otras tecnologías para ejecutar contenedores.

## ¿Qué hace containerd entonces?

Pensemos un momento en como es que funcionan los contenedores. Realmente, un contenedor es una abstracción de varias funcionalidades del kernel de linux. Para ejecutar un contenedor es necesario realizar llamadas al sistema (denominadas syscalls) para crear un ambiente _containerizado_.

Estas llamadas y configuraciones varían de versión en versión, y de plataforma en plataforma. Containerd abstrae esta funcionalidad de tan bajo nivel y funciona como una capa más amigable para utilizar contenedores, para que se puedan utilizar a partir de más software.

Anteriormente Kubernetes tenía unicamente dos opciones: seguir utilizando el Dockershim que tenía la interfaz de Docker, o interactuar con el kernel de linux directamente. Al sacar containerd de Docker, una alternativa nueva surgió: Utilizar containerd sin mezclar a Docker y toda la funcionalidad que no era necesaria.

## ¿Cómo se combina todo?

- Docker: Docker es un software orientado a desarrolladores, que tiene un nivel muy alto de abstracción en su interfaz y permite crear y ejecutar contenedores desde su cliente. Actualmente utiliza a Containerd como su capa baja de ejecución de contenedores.

- Kubernetes: Es un orquestador de contenedores que permite trabajar con múltiples interfaces de ejecución de contenedores (entre ellas, containerd). Está enfocado en ser utilizado para la escalabilidad y despliegue de contenedores a través de múltiples sistemas. Anteriormente, estaba totalmente ligado con Docker.

- Containerd: Es una abstracción de todas las funcionalidades del kernel de linux necesarias que son necesarias para ejecutar contenedores. Está diseñado para ser una base de otras herramientas para el manejo de contenedores.

## ¿Qué otras opciones hay?

Containerd es unicamente una de múltiples opciones para ejecutar contenedores. Algunas otras herramientas que trabajan con el OCR son runC y CRI-O.

- https://www.docker.com/blog/runc/ es un container runtime ligero y universal.
- https://cri-o.io/ es un container runtime especialmente diseñado para Kubernetes. Minikube utiliza CRI-O.

## OCI

El OCI es el encargado de definir los estándares de los contenedores. El trabajo realizado por la OCI ha sido de gran utilidad para facilitar la interoperabilidad entre diferentes componentes tecnológicos orientados a contenedores.

Las especificaciones de las imágenes OCI definen qué tienen que tener los contenedores. Los contenedores especifican qué interfaz debería tener un container runtime. Containerd se apega a esta especificación.

## CRI

El Container Runtime Interface es una abstracción especialmente diseñada para Kubernetes de las especificaciones de OCI.

## Entonces, ¿ya no puedo utilizar Docker?

Si, puedes seguir utilizando tranquilamente Docker. Realmente una imagen de Docker no es exactamente eso, ahora que Docker utiliza por defecto a containerd, las imagenes son construidas utilizando el estandar de OCI Open Container Initiative.

No hay problema de intercompatibilidad entre las imagenes de Docker y el ambiente en el qeu son utilizadas. Las imagenes que se crean utilizando Docker pueden seguir siendo utilizadas por Kubernetes sin ningun problema, ya que Kubernetes sigue soportando las imágenes de contenerdores con especificación OCI.

## Las malas noticias...

Kubernetes _terminó_ con Docker, por así decirlo, en 2020. Pronto Docker será removido de Kubernetes en 2021. Después de esto, Kubernetes no seguirá dando soporte al Docker runtime. Containerd u otro container runtime que acepte las especificaciones OCI será necesario para utilizar Kubernetes.

Esta noticia ha preocupado a multiples desarrolladores acerca de las implicaciones que tiene, sin embargo este cambio no debería impactar a la mayoría de servicios. Todas las imagenes que se han creado con Docker seguirán funcionando sin ningun problema en Kubernetes si estas fueron realizadas utilizando las especificaciones de OCI.

## Utilizando Containerd

```sh
# Instalar wget

$ sudo apt install wget

$ sudo apt update

# crear un nuevo directorio para containerd
$ mkdir containerd && cd $_

# instalar el paquete
$ wget https://github.com/containerd/containerd/releases/download/v1.5.4/containerd-1.5.4-linux-amd64.tar.gz

# esto nos descarga lo siguiente
$ ls -l

# descomprimir el tar utilizando xvf, x de extract, v de verbose y f de file
$ tar xvf containerd-1.5.4-linux-amd64.tar.gz

# Ahora veamos que tiene adentro el directorio que descargamos
$ cd bin && ls -l

# Ahora movemos CTR a un lugar donde podamos utilizarlo sin recordar la ruta donde estamos

$ sudo mv ctr /usr/bin

# utilizando ctr

$ ctr

# en este podemos ver la documentacion de la herramienta

# ahora veamos la lista de imagenes que tenemos a disposicion
$ sudo ctr image list

# nos damos cuenta que no funciona, ¿por qué?

# es necesario que containerd esté ejecutándose como un proceso para poder utilizar CTR, como había dicho CTR unicamente es el cliente para utilizar y administrar containerd sin utilizar Go
$ cd ~/containerd/bin && sudo ./containerd

# ahora hagamos un pull

$ sudo ctr i pull docker.io/library/redis:latest

$ sudo ctr i list

$ sudo ctr run -h

$ sudo ctr run --rm docker.io/library/redis:latest

$ sudo ctr run --rm docker.io/library/redis:latest redis

# Esto nos falla porque aun no tenemos runc instalado, recordemos que containerd utiliza runc para toda la parte que vimos del soporte de imagenes OCI y otras funcionalidades avanzadas.
$ sudo apt-get install runc

# ahora volvemos a tratar de correr nuestro container
$ sudo ctr run --rm docker.io/library/redis:latest redis

# ahora veamos de conectarnos, yo ya tengo instalado el redis y redis-cli
$ redis-cli ping

# no se puede porque todavia no estan abiertas las conexiones
$ sudo ctr run --rm --tty --net-host docker.io/library/redis:latest redis

# ahora si podemos intentar conectarnos
$ redis-cli ping

# ya estamos listos para conectarnos desde afuera de la máquina virtual


# ahora veamos si necesitamos que nuestra instancia se ejecute en segundo plano
$ sudo ctr run --detach --tty --net-host docker.io/library/redis:latest redis

# ahora estamos ejecutando redis en segundo plano
$ sudo ctr task list

# ahora para finalizarlo podemos utilizar el comando delete
$ sudo ctr task kill redis

# si intentamos conectarnos no nos dejará
$ redis-cli ping
```

# ¿Qué es un SHIM?

Shim es una librería que intercepta llamadas a una API y cambia los argumentos que fueron pasados por esta llamada, también puede manejar la petición ella misma o redireccionar la operación a otro lugar.

En docker un shim es un demonio muy ligero que contiene acciones que controlan los procesos que se realizan en un contenedor y que permiten ejecutar runc.

# Referencias

https://www.cloudsavvyit.com/10075/what-is-containerd-and-how-does-it-relate-to-docker-and-kubernetes/

https://github.com/containerd/containerd/blob/main/docs/getting-started.md

https://github.com/containerd/containerd

https://containerd.io/docs/getting-started/

https://stackoverflow.com/questions/59393496/how-to-run-docker-images-in-containerd-using-ctr-in-cli

https://github.com/containerd/nerdctl
