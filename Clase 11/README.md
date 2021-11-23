# Redis

Significa Remote Dictionary Server. Redis es una base de datos clave-valor en memoria. Es open source y se puede utilizar como base dedatos, cache, encolador y otros servicios de mensajería.

Redis ofrece tiempos de respuesta inferiores a un milisegundo, se pueden realizar millones de solicitudes por segundo en aplicaciones en tiempo real de videojuegos, servicios financieros, etc.

Es una opción muy común en almacenamiento en caché, administración de sesiones, videojuegos, tablas de clasificación, análisis en tiempo real, datos geoespaciales, servicios de vehículos compartidos, chats y mensajería, streaming de contenido multimedia y pubsubs.

## ¿Cómo funciona?

En Redis toda la información se encuentra en la memoria primaria. Ahora podrían pensar si está en la memoria primaria, ¿qué pasará si se va la luz? Redis también tiene la opción de almacenar datos de manera persistente cuando se es necesario.

Ya que estamos accediendo a la memoria principal, el acceso a la información es incluso 100 veces más rápido que en disco. En comparación de bases tradicionales basadas en disco, donde la mayoría de operaciones implican ir y volver al disco.

En algunas ocasiones no hay necesidad de obtener acceso al disco, este tipo de almacenamiento en memoria evita retrasos y permite acceso en cuestión de milisegundos.

Redis incluye estructuras de datos versátiles, alta disponibilidad, datos geoespaciales, scripts escritos en Lua, transacciones, persistencia en disco y soporte de clúster, lo que simplifica la creación a aplicaciones a escala de internet en tiempo real.

## ¿Qué gano?

Lo principal, velocidad. El acceso a la memoria principal es órdenes de magnitud más rápido que el acceso a memoria secundaria. Es increiblemente rápido, en cuestión de milisegundos es posible extraer información.

Es open-source, también hay una versión pagada que tiene más características pero todo lo necesario para utilizar redis ya está incluido en su versión.

Podemos realizar sistemas con alta disponibilidad, redis ofrece escalamiento horizontal increíble, se puede configurar replicación a cualquier número de nodos.

## ¿Qué pierdo?

Al ser una base de datos tan enfocada en usabilidad, más que en administración (por ejemplo, como SQL) no es apta para ser utilizada como una base de datos primaria, por ejemplo para guardar información de usuarios o de datos que necesitamos un alto nivel de seguridad, o de segregación de la información.

## ¿Qué otras opciones tengo?

Existe Memcached, que también es un almacenamiento de datos en memoria. Un servicio de almacenamiento en caché de memoria distribuída de alto rendimiento, diseñado por simplicidad.

Redis en comparación tiene un extenso conjunto de herramientas y características que lo ahcen más versatil y aplicable en más contextos.

## Algunos casos de uso...

Como ya mencioné, Redis puede ser muy rápido y con muchas funcionalidades; sin embargo no todos los casos son aplicables para utilizar redis. Queda como nosotros como ingenieros saber cuándo aplicarlo, cómo aplicarlo bien.

Algunos casos comunes de utilización de redis son:

### Almacenamiento en caché

Muchas veces la información que vamos a traer a la base de datos no necesariamente necesita ser pedida múltiples veces. Si tenemos control acerca de cuándo algunos datos se están modificando, y cuándo son solamente retornados podemos configurar fiablemente uin sistema de caché.

### Chat, mensajería y colas

Redis permite tareas de publicación y suscripción con correspondencia de patrones y variedad de estructuras de datos como listas, conjuntos ordenados y hashes.

Redis es una muy buena opción para implementar salas de chat de alto rendimiento, streaming de comentarios en tiempo real, entre otros.

La estructura de listas en redis facilita la implementación de colas simples, ofrece operaciones atómicas y capacidad de bloqueo por lo que resulta muy práctico para aplicaciones que requieren un agente de mensajes fiables.

### Videojuegos

Hay muchos casos donde los desarrolladores de videojuegos utilizan redis como una fuente de recursos de rápido acceso. Posiciones de movimiento en MMOs, acciones encoladas, tablas de clasificación de datos, etc.

### Streaming de contenido multimedia

Redis es un almacenamiento predilecto para la implementación de buffers de streaming.

### Análisis geoespacial

Al igual que en MongoDB, redis ofrece una gama de comandos para trabajar con datos geoespaciales.

### Machine Learning

Para casos como detección de fraudes en juegos y servicios financieros, subastas en tiempo real, coincidencias de aplicaciones de citas y viajes compartidos, etc.

Redis proporciona un almacén de datos en memoria para crear, entrenar e implementar rápidamente modelos de ML.

# Ejemplo práctico

## Instalando Redis

En este ejemplo utilizaremos redis en una computadora con sistema operativo Windows.

Redis no está por defecto para windows, la instalación en linux depende de herramientas como make y otro tipo de programas de compilación y enlazamiento que no están presentes tan fácilmente en Windows.

Sin embargo en https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/ hay un tutorial muy detallado acerca de cómo instalar correctamente redis en windows.

También está la opción fácil, si Docker está instalado en el sistema es sencillo utilizar un contenedor con Redis dentro. Esta será la opción que utilizaré.

```bash
# utilizamos este comando para instalar redis en un contenedor de docker
$ docker run --name cacheRedis1 -p 6379:6379 -d redis
```

## Redis CLI

Redis CLI es una aplicación en consola que permite interactuar muy bien con redis. Es ampliamente utilizada para realizar todo tipo de acción con nuestros datos. Esta es la forma más sencilla de utilizar redis.

Como no estamos utilizando un redis instalado en windows, tenemos dos opciones:

1. Ingresar a nuestro docker y utilizar redis-cli desde ahí.
2. Instalar una versión sin redis de nuestro redis-cli a través de nodejs.

## ¿GUI para redis?

Existe una forma de visualizar nuestros datos de una manera más cómoda. En el mercado hay dos o tres GUIs para utilizar redis que son pagadas.

La forma más sencilla de tener los beneficios visuales de una GUI es utilizar la extensión para Visual Studio Code de redis.

https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-redis-client

Si bien no nos deja realizar

# Utilizando el Redis-CLI

```bash

# Utilizamos este comando para instalar redis-cli con
$ npm install -g redis-cli

$ rdcli -h localhost -p 6379
```

## Algunos comandos básicos...

```bash

# Guardar un nuevo valor. KEY SENSITIVE
$ set curso sopes

# Obtener un valor
$ get curso
# sopes

# Obtener todas las llaves que tenemos almacenadas
$ keys *

# Eliminar una llave
$ del curso

# Utilizar una secuencia

$ set seq 1
$ get seq
$ incr seq
$ get seq

# Visualizar el tamaño de nuestra BD
$ dbsize

# Ingresando varias variables a la vez
$ mset rick 1 morty 2 jerry 5

# Obteniendo varias variables a la vez
$ mget rick morty

# Revisar si una variable existe
$ exists jerry
$ exists summer
$ exists rick summer

# Definir tiempo de vida  EX: seconds | PX: miliseconds

# Guardar una variable 20 segundos
$ set ironman 0 EX 20
$ set ironman 0 PX 5000

# Expirar la variable ya almacenada segundos
$ expire rick 10

# Vaciar toda la base de datos
$ flushall

# Iniciar una lista
$ lpush avengers Ironman Thor Spiderman

# Ver los valores de una lista
$ lrange avengers 0 -1

# Ver el primero
$ lrange avengers 0 0

# Ver el final
$ lrange avengers -1 -1

# Ingresar un valor

# Izquierda (inicio)
$ lpush avengers Capitan

# Derecha (final)
$ rpush avengers "Black Panther"

# Ver "top 3"
$ lrange avengers 0 2

# Ver tamaño de la lista
$ llen avengers

# Eliminar elmentos de la lista
$ lpop avengers
$ rpop avengers
$ ltrim avengers 0 2
$ lrem avengers 1 "Spiderman"

# HashSets

# Crear un nuevo hashset
$ hset persona nombre Rick apellido Sanchez

# Obtener un valor del hashset
$ hget persona nombre

# Obtener varios valores
$ hmget persona nombre apellido

# Sets son colecciones de strings sin orden
# Permiten añadir, remover y revisar si existe un valor

# Añadir a un set
$ sadd users marooned

# Añadir varios a un set
$ sadd users edaral spgg zevetse

# Revisar la cantidad de datos que tenemos en el set
$ scard users

# Revisar los valores que tenemos en el set
$ smembers users

# Añadir usuarios que iniciaron sesión ayer
$ sadd ayer marooned spgg damc

# ¿Qué usuarios iniciaron sesión hoy y no ayer?
$ sdiff users ayer

# ¿Qué usuarios iniciaron sesión ayer y no hoy?
$ sdiff ayer users

# Revisar si una persona inicio sesion ayer
$ sismember ayer edaral
$ sismember ayer spgg

# Banear usuario
$ smove ayer banned damc

# Revisar el cambio
$ smembers ayer
$ smembers banned

# Quitar un valor aleatorio
$ spop users

# Quitar un valor especifico
$ sadd users leo
$ smembers users
$ srem users leo
$ smembers users
```

Un ejemplo de la utilización de REDIS puede ser encontrado en la carpeta /Tutoriales/Redis.
