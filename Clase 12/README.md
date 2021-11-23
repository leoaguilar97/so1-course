# KAFKA

## ¿De dónde sale Kafka?

Imaginémonos un sistema informático para una empresa que está en pleno crecimiento. Quizá en este momento lo más importante es realizar las funcionalidades básicas que necesita ejecutar la empresa. Pensemos en una empresa que desarrolla juegos, por ejemplo. Al inicio esta empresa estará interesada en sacar las funcionalidades básicas del juego: el juego como tal y un sistema de texturas que permitirá agregarle diferentes funcionalidades posteriormente.

Mediante pasa el tiempo, el juego decide agregegar un sistema anti-cheating debido a la cantidad grande de denuncias de este tipo que están teniendo en los foros de sus comunidades. Además, implementarán un sistema de envío de correos para mantener a sus jugadores informados de sus siguientes actualizaciones.

Después de unos meses, se anuncia el lanzamiento del juego para la plataforma de PlayStation, XBox y teléfonos móviles. El despliegue es un éxito, pero el código está creciendo de manera desmedida y agregar funcionalidades ha estado siendo un reto.

Al finalizar ese mismo año, se le agrega un sistema para detección de la posición de personajes en el juego, un chat por voz adentro de las partidas para que los equipos se comuniquen, una actualización agrega también la función de streaming dentro del juego que permite enviar datos a twitch y facebook gaming del estado actual de tu partida para poder monetizar tus juegos.

En este ejemplo, corto, podemos darnos cuenta que la necesidad de segmentar la información es inmensa. Estamos trabajando con actualizaciones periódicas y funcionalidades que no están directamente relacionadas con el core de las funcionalidades. Acá finalizamos con 6 servicios de trabajo diferentes, y con 4 clientes diferentes que deben consumir estos servicios. Adicionando a esto, cada uno de estos servicios tiene su propio protocolo de comunicación, formato de intercambio de datos, y un sinfín de configuraciones diferentes para cada servicio.

Si trabajamos de manera normal, estos servicios tendrán que interconectarse todos entre todos, por ello resultará en una interconexión difícil de manejar y difícil de cambiar con relación al tiempo. Acá es donde entra **kafka** al juego.

Kafka nace de la necesidad de los sistemas de compartir información de manera distribuída. Al tener sistemas que están segmentados en diferentes módulos que realizan diferentes operaciones pero con un mismo fín, es sencillo interconectarlos todos con una herramienta capaz de guardar información y mandarla a diferentes receptores.

## Un poco de historia...

Apache Kafka fue creado por LinkedIn. Es un proyecto que ahora es open source y mantenido por Confluent. Es un sistema distribuído, resiliente y tolerante a fallos. Provee la capacidad de escalar horizontalmente, con lo cual da la pauta a crear sistemas robustos y altamente disponibles; además de escalar a millones de mensajes por segundo. Tiene un alto performance y una latencia de menos de 10ms, es utilizado por más de dos mil compañías, y por el 35% de las firmas en el fortune 500, con utilización en empresas como Airbnb, Netflix, LinkedIn, Uber y Walmart.

## Algunos casos de uso

Kafka es ampliamente utilizado en aplicaciones que implementan las siguientes funcionalidades:

- Servicios de mensajería y chats
- Tracking de actividades como aplicaciones de Fitness
- Obtener métricas de diferentes proveedores
- Aplicaciones de logs e informes
- Procesamiento de streams de datos
- Decoplamiento de sistemas interdependientes
- Integraciones con Spark, Flink, Storm, Hadoop y otras tecnologías de Big Data.

Por ejemplo, en Netflix Kafka es utilizado para aplicar recomendaciones en tiempo real mientras estás viendo shows. Uber lo utiliza para recolectar información del usuario, conductor y viaje en tiempo real y computar y previsualizar la demanda que habrá. Linked in lo utiliza para prevenir spam, recolectar iteracciones entre usuarios y crear una mejor conexión e interacción de usuarios en tiempo real.

Es importante notar que Kafka es utilizado como mecanismo de transporte, no como todo el sistema de envío y recepción de datos. Kafka es bueno en una cosa: **mover datos de manera rápida**.

## Un poco de teoría...

Para utilizar Kafka hay algunos conceptos básicos que son importante entender antes de iniciar. A continuación los presento:

### Topics

Un topic es la base de todo Kafka. Es un canal a donde estará pasando información. Es similiar a una tabla en una base de datos, excepto que sin todas las reglas y limitaciones que tiene esta.

Se pueden tener todos los tópicos que se deseen, y lo que los identifica es un _nombre_.

Los tópicos están divididos en algo llamado _particiones_:

- Cada partición está ordenada de manera específica
- Cada mensaje en la partición obtiene un ID incremental al que le denominamos **OFFSET**.

Para identificar un mensaje único, sería entonces lo siguiente:

El tópico _A_, en la partición _P1_ con el Offset _5_.

#### Ejemplo

Imaginemos que tenemos una flota de camiones, y cada camión debe reportar su posición GPS. Podemos utilizar Kafka para esto, ya que estaremos enviando mensajes constantes desde cada camión, a diferentes clientes. Por lo tanto, podríamos tener
el tópico _CamionGPS_ que contiene las posiciones de todos los camiones. Cada camión va a enviar el mensaje a Kafka cada 20 segundos, y cada mensaje va a contener el ID del camión y la posición (latitud y longitud) donde se encuentra.

#### Notas importantes a tomar en cuenta...

El OFFSET únicamente tiene significado para una partición específica, varios mensajes pueden tener el mismo offset pero deben de ser de una partición diferente. El Orden es únicamente garantizado en una partición, y no a través de particiones.

La información es almacenada únicamente una cantitad limitada de tiempo, el valor por defecto de esta duración es de una semana. Una vez almacenados los datos no pueden cambiar, a esto se le llama inmutabilidad.

Por último, la información es asignada de manera random a una partición a menos que una _llave_ sea enviada junto con el mensaje.

## Brokers

Un clúster de Kafka está compuesto por múltiples brokers. Un broker es básicamente un servidor que puede realizar todas las acciones de Kafka. Cada uno de estos brokers está identificado por un ID entero. Cada broker contiene únicamente ciertas particiones de tópicos, estos brokers tienen alguna información pero no toda ya que Kafka es un sistema distribuído y no almacena toda la información en los mismos lugares.

Cuando se conecta un broker (esto es denominado Bootstrap Broker) está conectado a todo el clúster. Un buen número para iniciar con brokers en un ambiente de producción son 3, sin embargo en algunos casos llegan hasta 100 brokers.

## Factor de replicación

El factor de replicación de los tópicos debe ser mayor a uno (usualmente está entre dos y tres). De esta manera, si un broker se desactiva o se apaga por alguna razón, otro broker puede enviar la información.

También hay un broker denominado Líder para **cada partición**. En cualquier punto del tiempo únicamente un broker puede ser el líder para una partición específica. Esto significa que únicamente ese lider puede recibir y enviar información a una determinada partición. Los demás brokers únicamente sincronizarán la información para almacenarla en caso de fallos en los brokers. Por lo tanto, cada partición tiene un líder, y múltiples ISR (in-sync replicas).

La decisión de quién es el líder y cómo se deben de replicar lo decide una parte de Kafka denominado zookeeper. Es un tipo de árbitro que administra los brokers y toma decisiones.

## Producers and message Keys

Los productores son los que escriben los datos en los tópicos. Cada productor automáticamente sabe a qué broker conectarse y en qué partición escribir, esto es totalmente controlado por kafka. Solamente tenemos que conectarnos a Kafka y el productor sabrá a quién hablarle.

En caso que el broker falle, los productores automáticamente recuperarán la información y la volverán a enviar.

Los productores utilizan un modelo denominado Round Robin para hacer la multiplexión de particiones a las que escriben.

## Ack

Los productores pueden escoger si reciben reconocimiento de vuelta de que la información que escribieron fue recibida.

- Los productores con ack = 0 no esperarán reconocimiento. Esto podría producir pérdida de datos.
- Los productores con ack = 1 esperarán al líder a reconocer que la información ya fue enviada. Esto podría producir una limitada pérdida de datos.
- Los productores con ack = all esperarán a que todas las réplicas y el lider reconozcan que ya fue obtenida la información. De esta forma nunca habrá pérdida de datos.

## Message Keys

Los productores pueden escoger enviar una llave con el mensaje (un string o un número). Si la llave es nula,
entonces la información se enviará en manera Round Robin a las particiones.

Si existe una llave, todos los mensajes con esa llave siempre irán a la misma partición. Una llave es básicamente una manera de especificar orden para mensajes específicos.

No sae especificará cual partición será a la que se envíe la información, pero si se garantizará que será la misma para todos los mensajes con esa llave.

## Consumers

Los consumidores son los que leen la información del tópico que se identifica con un nombre. Los consumidores saben a qué broker deben de leer. En caso de fallos, los consumidores saben cómo recuperarse.

La información es leida en cada partición.

### Consumer Groups

Los consumidores leen la información en grupos. Cada consumidor que es parte de un grupo lee la información de particiones exclusivas. Si uno tiene más consumidores que particiones, algunos consumidores estarán inactivos.

# Iniciando con Kafka...

## Instalacion Windows

Como prerrequisito necesitamos la versión de Java 8 SDK o posteriores.

Después de tener esto instalado y configurado correctamente, descargamos los archivos binarios de la plataforma.

http://kafka.apache.org/downloads

Yo descargué la que tiene la versión Scala 2.13. Extraemos los archivos en el directorio C:/.

## Iniciar el zookeeper

Abrimos el archivo config/zookeeper.properties en un editor de texto y cambiamos la dirección de DataURL por una dirección donde deseemos guardar la información de Kafka.

En este caso, yo lo tengo de esta manere:

```bash
dataUrl=C:/kafka_2.13-2.8.0/data/zookeeper
```

Ahora ejecutar el comando:

```bash
$ .\zookeeper-server-start.bat ../../config/zookeeper.properties
```

## Iniciar el server

Abrimos el archivo config/server.properties en un editor de texto y cambiamos la dirección de Logs.Dirs por una dirección donde deseemos guardar la información de Kafka.

En este caso, yo lo tengo de esta manere:

```bash
log.dirs=C:/kafka_2.13-2.8.0/data/kafka
```

Ahora ejecutar el comando:

```bash
$ kafka-server-start config/server.properties
```

# Kafka CLI

Para crear un tópico necesitamos definir dónde está nuestro zookeeper, el nombre del tópico, la cantidad de particiones y el factor de replicación.

Yo tengo mi zookeeper corriendo en el puerto 2300 de mi localhost, mi tópico se llamará _topic1_, le daré 3 particiones y únicamente tengo un broker, por lo cual el factor de replicación será **1**.

```bash
$ kafka-topics --zookeeper 127.0.0.1:2300 --topic topic1 --create --partitions 3 --replication-factor 1
```

Ahora veamos que fue lo que creo

```bash
$ kafka-topics --zookeeper 127.0.0.1:2300 --list
```

Vemos que esto nos devuelve el nombre "topic1". Veamos la información que tiene adentro el tópico 1.

```bash
$ kafka-topics --zookeeper 127.0.0.1:2300 --topic topic1 --describe
```

El cero significa que el lider es el broker 0, o sea el servidor donde estoy ejecutándo actualmente.

### Enviando datos...

Necesitamos un productor para enviar mensajes, para ello utilizaremos el programa de CLI que trae Kafka por defecto.

```bash
$ kafka-console-producer
```

Especificamos a la lista de brokers a la queremos conectarnos y el tópico al que vamos a publicar los mensajes.

```bash
$ kafka-console-producer --broker-list 127.0.0.1:9092 --topic topic1
```

Tambien podemos utilizar los acknowledgments

```bash
$ kafka-console-producer --broker-list 127.0.0.1:9092 --topic topic1 --producer-property acks=all
```

### Podemos crear nuevos topicos en ejecucion

No es necesario crear tópicos y luego utilizarlos, los tópicos pueden crearse sobre la marcha:

```bash
$ kafka-console-producer --broker-list 127.0.0.1:9092 --topic new_topic
```

Esto produce la siguiente salida

```bash
> Hola
> WARNING! Pero el producer puede recuperarse de errores
> otro mensaje!
```

veamos el nuevo topico

```bash
$ kafka-topics --zookeeper 127.0.0.1:2300 --topic new_topic --describe
```

Los defaults son 1 en replication y en partitions, usualmente no es buena idea tener una particion unica y sin replicacion.

## Consumidores

Para revisar que la información fue enviada de la manera correcta, podemos utilizar los siguientes comandos:

```bash
$ kafka-console-consumer --bootstrap-server 127.0.0.1:9092 --topic topic1
```

Esto no leerá nada, ya que los consumidores por defecto no leen todos los mensajes que han sido publicados antes.

Para leer todos podemos utilizar la siguiente opción:

```bash
$ kafka-console-consumer --bootstrap-server 127.0.0.1:9092 --topic topic1 --from-beginning
```
