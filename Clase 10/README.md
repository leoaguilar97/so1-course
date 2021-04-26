# Sistemas Distribuidos

Hasta el momento todos hemos hecho un tipo de sistema denominado centralizado; nuestra base de datos está en el mismo lugar que nuestro controlador, nuestra vista está en el mismo lugar que la base de datos y el controlador.

Básicamente estamos ejecutando todo en la misma computadora; sin embargo, esto dejó de ser suficiente mediante los sitemas iban incrementando en tamaño necesitaban más potencia de computación, se necesitaba aislamiento de cierta información, segmentación de las responsabilidades, etc.

Desde que inicamos a pensar en un sistema como un conjunto de partes, podemos iniciar a pensar en sistemas distribuídos. Básicamente necesitamos segregar los componentes de una misma aplicación en varias computadoras, ahora esto suena fácil pero lleva mucha tarea atrás, ¿cómo nos comunicaremos? ¿qué información estará replicada? ¿cada cuanto nos comunicaremos entre sub-sistemas? etc.

Un sistema distribuído es una colección de computadoras que en conjunto ejecutan una misma aplicación, se ve como si fuera una sola computadora ejecutando todo. Este paradigma dicta que múltiples computadoras pueden hacer muchas tareas que tienen un mismo objetivo.

Una de las ventajas más claras en este paradigma es la independencia respecto a los fallos, ya que cada computadora está ejecutando en su propio ambiente, el fallo de una no afectará a las otras. Además, cada computadora está ejecutándose de manera concurrente, cada tarea tiene su propio tiempo y podemos aprovechar a realizar tareas más complicadas pero más específicas.

## Sistemas Centralizados Vs Sistemas Distribuidos

En los sistemas centralizados el estaod de una aplicación se almacena en una sola computadora.

La aplicación es mucho más sencilla de comprender y desarrollar.

Puede ser más efeciente si no tenemos necesidad de alta disponibilidad y alta concurrencia.

En los sistemas distribuídos el estado de la aplicación está dividido y almacenado en muchas computadoras. Estas aplicaciones son mucho más robustas y pueden tolerar fallos.

El hecho de que sean robustas y tolerables a los fallos las hace más escalables.

Cuando la aplicación necesita mucho más cómputo basta con agregarle una computadora más.

# Kubernetes

## Un poco de historia

El nombre "Kubernetes" viene de una palabra griega que significa piloto o guía.

Kubernetes inició como un proyecto secreto de Google llamado Borg. En 2015, Google lo donó a CNCF, por lo que actualmente es código open source.

En parte, esta decisión fue atribuída a la visión que Google tiene de crear una plataforma qeu sea utilizada bástamente por muchas empresas y firmas a lo largo del mundo. Sin embargo esta decisión surgió a raíz que AWS dominaba la nube para ese entonces, Google necesitaba una manera de revolucionar también en el mundo de Cloud Computing.

Básicamente lo hizo estratégicamente para quitarle parte del trabajo a los otros proveedores de nube, promover el desarrollo de varios proyectos internos más (como KubeBuilder o Knative) y también para promocionar su nube, con una compatibilidad extraordinaria con Kubernetes, como era de esperarse.

Sin embargo, esta decisión de sacar el código como open-source vino con ciertas desventajas para Google, tal como el impulsamiento de sus competidores proveedores de servicios en la nube, y con ello aumentando sus ganancias y presencia en el mercado.

Desde que salió Kubernetes fue muy popular; incluso, según https://analyticsindiamag.com/kubernetes-docker-container-orchestration-race/ , le ganó a Docker en ser la plataforma más amada por desarrolladores.

De acuerdo a https://www.zdnet.com/article/kubernetes-jumps-in-popularity/, se investigaron 109 herramientas para manejar contenedores, y 89% de esas herramientas son versiones modificadas de Kubernetes.

## Qué es Kubernetes?

Es un sistema de orquestación de contenedores de docker. ¿Han visto cómo en las óperas o en las orquestas hay una persona que está dirigiendo a todos los músicos? Imaginemos que todos los músicos son contenedores de Docker, con diferentes propósitos.

Ahora imaginemos que la persona que los está dirigiendo es Kubernetes; esta persona tiene que decidir a qué ritmo está los instrumentos de viento, en qué momento tiene que entrar la percusión, los instrumentos de cuerda.

Pensemos que Kubernetes es tan buen orquestador que incluso, si hace falta un poco de sonido de, por ejemplo, el violín, es capaz de mágicamente aparecer a otro violinista, y si por alguna razón esto no es suficiente, podría aparecer a otros tres más.

Sin embargo, si el orquestador se da cuenta que el volúmen del violín es demasiado alto y empieza a opacar a otros músicos, puede decidir mágicamente desaparecer violinistas.

Kubernetes permite realizar las mismas acciones con Docker, y muchas, muchísimas más.

Podríamos simplificar y generalizar de manera enorme las tareas que podemos hacer con esta herramienta diciendo lo siguiente acerca de ella:

- Permite planificar contenedores en un clúster de máquinas
- Puede ejecutar múltiples contenedores en una máquina
- Puede correr aplicaciones que se ejecutan por largos períodos de tiempo, como apps Web.
- Permite administrar el estado de los contenedores:
  - Puede empezar un contenedor en nodos específicos
  - Puede reiniciar un contenedor cuando este muere
  - Puede mover contenedores de un nodo a otro nodo

## ¿Por qué usarlo?

En vez de correr algunos contenedores en un host manualmente, kubernetes es una plataforma que maneja todos los contenedores automáticamente por nosotros.

Los clústers pueden iniciar con un nodo o con miles de ellos.

Algunos otros orquestadores son:

- Docker Swarm
- Mesos

## Palabras Clave

- Container: es una imagen ligera y portable que contiene software y todas sus dependencias.

- Container Runtime: es un software que es responsable de mantener contenedores ejecutándose.

- Pod: Es el objeto más simple y pequeño que puede tener Kubernetes. Representa _contenedores_ ejecutándose en un clúster.

- Nodo: Es una máquina que ejecuta un trabajo en Kubernetes. Puede ser una máquina virtual o una máquina física, dependiendo del clúster donde esté. Tiene todos los demonios locales necesarios para ejecutar a los pods y es manejado por el control plane.

En versiones iniciales de Kubernetes, eran denominados Minions.

- Clúster: Es un grupo de máquinas (workers), llamadas nodos, que corren aplicaciones containerizadas. Cada clúster tiene al menos un nodo worker.

- Nodo Worker: aloja a los pods que son componentes de la aplicación.

- Namespace: es una abstracción utilizada por Kubernetes para soportar múltiples clústers virtuales en el mismo clúster físico.

- Servicio: es una manera de exponer una aplicacion que ejecuta pods a través de una red.

## La clave de todo...

Para nuestro ejemplo de la orquesta y su orquestador imaginemos lo siguiente:

Estamos a media estrofa musical, y por alguna razón la persona encargada de los timbales se lastima la muñeca. Kubernetes en este momento mágicamente aparece a otra persona que sabe tocar timbales para reemplazarlo, con una pérdida de notas muy baja.

A esta característica le llamamos tolerancia a fallos; en un clúster con múltiples nodos, Kubernetes puede recuperar y reemplazar contenedores en los nodos que fallaron.

Ahora, ya que tenemos a nuestros timbales sonando en su punto, nos podemos dar cuenta que los violines nuevamente no están sonando como debe de ser, tres violinistas se ausentaron esa noche. Kubernetes realiza tres copias exactas del único violinista que quedó, y se percata si se necesita o no se necesitan más.

A esta característica le llamamos escalamiento horizontal; agregar contenedores si son necesarios (y quitarlos también) por criterios y reglas establecidos previamente.

Por último, imaginemos que nuestros músicos por alguna razón olvidaron cierta pieza musical que es necesaria tocar en frente de un gran público; para Kubernetes esto no es problema, únicamente saca un disco previamente grabado de la última vez que tocaron esa pieza y la pone a reproducir sin que el público se de cuenta.

A esta característica le llamamos recuperación, Kubernetes puede guardar la aplicación que estamos lanzando y sus versiones. Si es necesario, Kuberenetes puede recuperar o restablecer la aplicación a un estado estable.

## ¿Qué arquitectura tiene kubernetes?

Kubernetes consiste en tres capas principales:

La interfaz de usuario
El máster node
Los worker nodes

## Máster Node

Proveer conexiones a la interfaz de usuario y ejecutar los servicios del plano de control.

Los servicios del plano de control administran y operan el clúster de Kubernetes. Cada servicio se ejecuta con un rol distinto en la operación del clúster.

El máster node es quien ejecuta al clúster por lo cual no se permite que esté en downtime. Se encarga de la estrategia de redundancia y aplicación. Todas estas tareas son realizadas en modo de alta disponibilidad, además debe mantener todas las réplicas sincronizadas.

El máster node tiene cuatro componentes:

- El controlador: administra el estado del clúster y los pods que están corriendo. El estado óptimo del clúster o el número requerido de pods corriendo son configurados en el controlador, este es quien actúa cuando un pod se desactiva. Ejecuta las tareas necesarias si se le ordena al clúster regresar a un estado anterior.

- etcd: Es un repositorio de clave valor donde Kubernetes almacena el estado del repositorio.

- API Server: administra todas las tareas en el Máster Node, recibe llamadas REST. Accede a los datos del estado del etcd y al finalizar todos los procesos de la API el nuevo estado del clúster es escrito en el etcd, en él se almacenan las claves e información vital.

- El planificador: asigna objetos a los nodos, se hace a través del estado actual del clúster y los requerimientos actuales. Consulta el etcd y los requerimientos del nuevo objeto antes de realizar una operación.

# Worker Nodes

Estos también tienen cuatro componentes:

- Container runtime
- Kubelet
- Kube-proxy
- Plugins

La app conrre en los pods, estos son administrados en este nodo donde consumen recursos de computación como memoria, almacenamiento, acceso a la red.

Kube-proxy es un proxy de red que está ejecutándose en cada nodo del clúster.

Kubelet es un servicio que se comunica con el máster node y los contenedores, esta comunicación la hace a través del Container Runtime Interface.

Kubernetes necesita un container runtime y algunos de los que utiliza son:

- Docker
- Containerd
- Rklet

# Manifesto

Un archivo manifesto de kubernetes incluye instrucciones en un archivo yaml o json que especifican cómo desplegar una aplicación al nodo o nodos en un clúster de kuberenetes.

las instrucciones incluyen información sobre el despliegue de Kubernetes, el servicio kubernetes y otros objetos de Kubernetes que se crearán en el clúster.

## Kubectl

Kubectl es una herramienta para desplegar y gestionar aplicaciones en kubernetes.

# Utilizando Kubernetes

## Minikube

Es una herramienta para ejecutar kubernetes localmente. Ejecuta un clúster de Kubernetes de un solo nodo adentro de una máquina virtual de linux. Es únicamente para utilización en desarrollo.

```bash
# Windows
$ choco install minikube

# Linux
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Una vez ya tenemos nuestro paquete instalado, hay que configurarlo

```bash
# Inicializar el servicio de minikube
$ minikube start

# Instalar una version de kubectl
$ minikube kubectl -- get po -A

# Inicializar el dashboard de minikube
$ minikube dashboard
```

### La primera prueba

```bash
# Iniciando imagenes de un server de prueba
$ kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
$ kubectl expose deployment hello-minikube --type=NodePort --port=8080

# Obtener informacion de los servicios
$ kubectl get services hello-minikube
# Abrir automaticamente en el browser
$ minikube service hello-minikube

# Redireccionar el puerto
$ kubectl port-forward service/hello-minikube 7080:8080
```

### Prueba con snake

```bash
$ git clone https://github.com/skynet86/hello-world-k8s.git
$ cd hello-world-k8s/
$ kubectl create -f hello-world.yaml
$ minikube service hello-world
```

### Lens

Lens es un IDE de Kubernetes para obtener todo el control de los cl[usters de Kubernetes. Es de mucha ayuda para monitorear los servicios que creamos.
