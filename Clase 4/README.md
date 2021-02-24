# COMUNICACIÓN ENTRE CONTENEDORES

Ahora que ya vimos qué son los contenedores y hemos creado uno utilizando NodeJS para realizar una API, podemos iniciar con el proceso de crear más.

Al crear más contenedores nos empezaremos a dar cuenta que conectarnos a ellos empieza a ser tedioso, los puertos empiezan a volverse incontrolables y asignar un número de puerto
a cada contenedor resulta tedioso y complicado. Además, podemos tener problemas de seguridad al estar creando contenedores que están expuestos y publicados siempre.

Para ello, Docker provee de una utilidad llamada Docker Network, la cual puede crear redes virtuales en los cuales se pueden interconectar contenedores.

## DOCKER NETWORK

Una red de docker es un medio donde los contenedores de docker pueden hablarse entre sí, con el host o con cualquier otra máquina que esté en la misma red del host. También puede negar la utilización de una red y tener un contenedor completamente isolado del mundo. En fin, Docker network nos será util para interconectar contenedores.

Para iniciar, podemos revisar las redes que actualmente están ejecutandose, esto con el comando

```bash
$ docker network ls
```

Esto nos dará una salida muy parecida a la siguiente:
:

|  NETWORK ID  |  NAME  | DRIVER | SCOPE |
| :----------: | :----: | :----: | :---: |
| e11d221cc035 | bridge | bridge | local |
| 7967c4c19ae6 |  host  |  host  | local |
| cd636f23b049 |  none  |  null  | local |

Esta salida es la que tenemos por defecto cuando acabamos de instalar Docker, vemos que tenemos tres redes por defecto.

Existen tres tipos de red de Docker

### BRIDGE

Un bridge es un tipo de interfaz que se comporta similar a un switch, básicamente crea un puente entre los contenedores que están conectados.

### HOST

Si se utiliza un tipo de red host, el contenedor no estará aislado del host de Docker (el contenedor compartirá el mismo namespace del network que el host). El contenedor no recibirá una IP propia. Si conecto un contenedor a la red host, el contenedor será accesible usando la misma IP que tu máquina.

### NONE

Si se utiliza un tipo de red none, el contenedor no estará en ninguna red y no podrá ser accesible a través de ningun medio de comunicación por red. Son útiles para realizar trabajos por lotes.

## Ejemplo Práctico de Networks

Para este ejemplo, utilizaremos dos contenedores de NodeJS, uno se encargará de recibir todas las peticiones del exterior (generalmente del backend o de otros servicios que la consuman) y el otro se encargará de recibir los datos y guardarlos en una base de datos MongoDB.

Lo primero que realizaremos son las APIS.

Para acceder a todo el código de este ejemplo puedes acceder al apartado de tutoriales (link: ![Tutoriales](../Tutoriales)).

### API SERVER - SLAVE

La api server slave se encargará de leer el módulo que realizamos en la clase #3 (link: ![Clase #3](../Clase%203/README.md)).

### Iniciamos realizando el Dockerfile

```Dockerfile
FROM node:14

# Asignar el workdir de la api

WORKDIR /usr/src/app

# Copiar el package-json

COPY package\*.json ./

# Correr 'npm install' para instalar todas las dependencias que necesitemos

RUN npm install

# Aca pueden existir muchos mas comandos "run"

# Copiar todos los archivos al workdir

COPY . .

# Exponer el puerto 80 al mundo

EXPOSE 80

# Copiar el volumen de datos de proc a /elements/procs

RUN mkdir -p /elements/procs

# Correr NodeJS

CMD [ "node", "server.js" ]
```

En este dockerfile vemos que utilizaremos un contenedor que tendra Docker dentro; copiaremos todo nuestro codigo y como parte mas importante, crearemos una carpeta denominada /elements/procs donde montaremos posteriormente un volumen que tenga la informacion de nuestros procesos.

Procedemos a escribir nuestro servidor, dividiremos nuestras carpetas de tal forma que nos quede un diseño modular. Iniciamos con el clasico comando

```bash
$ npm init
```

Ingresamos nuestra configuracion en la terminal, y procedemos a crear los archivos necesarios.

Necesitamos un archivo que podamos utilizar para leer el kernel, por ello creamos el archivo ![Kernel.js](../Tutoriales/server-slave/kernel.js)

```Javascript
const fs = require('fs'); // Este modulo viene cargado directamente en nodejs, sirve para trabajar con archivos

// Aca es donde se lee el modulo kernel que cargamos!
const getTimestamp = () => (fs.readFileSync('/elements/procs/timestamps', 'utf8')).toString(); // Este metodo va a leer la carpeta /proc/timestamps y convierte sus datos a un string.

// Este metodo sirve para devolver la informacion que hay en el modulo
// En caso la lectura no pueda ser efectuada, devolvemos un error!
// Esto es util ya que el server entocnces no se caera cada vez que requiramos la lectura y no tengamos bien el modulo
const safeGetTimestamp = () => {
// Intentamos hacer la lectura del archivo /proc/timestamps
try {
// Si todo es correcto, lo devolveremos
return getTimestamp();
}
// Deconstruimos el objeto error en el catch, y obtenemos unicamente su valor
catch ({ message }) {
// En dado caso haya un error, devolveremos el error.
return `No se pudo leer el modulo. ${message}`;
}
}

// Exportamos el metodo que queremos utilizar, en este caso le renombramos a getTimestamp
module.exports = { getTimestamp: safeGetTimestamp };

Con este archivo podemos leer de manera conveniente los datos proporcionados por el modulo kernel en el archivo /elements/procs/timestamps.

Ahora que tenemos listo esto, podemos proceder a escribir nuestra API, la escribiremos en el archivo ![server.js](../Tutoriales/server-slave/server.js)

// Requerir DOTENV que carga la configuracion que tenemos en el archivo .env en el directorio principal
// Aca se pueden definir todas las variables de entorno
require('dotenv').config(); //npm i dotenv

// Modulos instalados
const express = require('express'); // npm i express
const axios = require('axios'); // npm i axios

// Modulos que escribimos nosotros
const { getHtmlList } = require('./templates'); // Modulo cargado en templates.js, getHtmlList se utiliza para generar una lista en HTML
const { getTimestamp } = require('./kernel'); // Modulo que controla los kernels, getTimestamp se utiliza para obtener la informacion que provee el modulo

// EMPEZAMOS LA API

const OTHER_API_URL = process.env.API_URL; // Leer la URL de la api del archivo .env

const app = new express(); // Crear una base de datos express

// IMPORTANTE! Le decimos a express que necesitamos trabajar con intercambio de datos JSON
app.use(express.json({ extended: true }))

// Con esta ruta haremos una peticion al server 2
app.post('/', async (req, res) => { // es importante notar que este es un metodo async, ya que utilizamos await dentro de el
// Intentamos realizar el post al otro servidor con AXIOS
try {
const { data } = await axios.post(OTHER_API_URL, { timestamp: getTimestamp() }); // realizar una peticion HTTP POST a la otra API

        return res.status(201).send(data); //retornar los datos que nos devuelva el servidor
    }
    catch (error) {
        return res.status(500).send({ msg: error.message }); // existio un error, devolver 500
    }

});

// Con esta ruta traeremos todos los datos del server 2
// Luego devolveremos un HTML para mostrarlo todo en una lista
app.get('/', async (req, res) => { // es importante notar que este es un metodo async, ya que utilizamos await dentro de el
console.log("Server1: Peticion de lista de timestamps");
// Intentamos realizar el get al otro servidor
try {
const result = await axios.get(OTHER_API_URL); // realizamos una peticion GET a la otra API
console.log("Server1: La peticion al server 2 fue exitosa");
const data = result.data;

        const html = getHtmlList(data); // Obtenemos la lista con un formato de lista de HTML

        console.log("Server1: Devolviendo HTML");
        return res.send(html); // Devolvemos el HTML para que sea renderizado por el navegador
    }
    catch (error) {
        console.log(`Server1: Error en la peticion, error: ${error.message}`);
        return res.status(500).send({ msg: error.message }); // Existio un error, devuelve el mensaje del error
    }

});

// Si existe un puerto en la configuracion, la cargamos; de lo contrario se inicia en el puerto 4000
const PORT = process.env.port || 4000;

// Iniciar la API en el puerto que definimos, mostrar en consola que ya esta funcionando.
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });
```

Por el momento, utilizamos el archivo ![templates.js](../Tutoriales/server-slave/templates.js) no pondremos mucha atención a este archivo ya que posteriormente lo sacaremos de la API y utilizaremos un frontend de React.

Por último, instalamos los paquetes necesarios para ejecutar este código utilizando el comando

```bash
$ npm i axios express dotenv
```

Y adjuntamos un archivo llamado .env que contendra la informacion del URL de la segunda API y el puerto en el que queremos que se ejecute la API.

```conf
API_URL=http://localhost:4001
PORT=4000
```

Ahora ya estamos listos para ejecutar nuestra API.

Ejecutamos el comando

```bash
$ node server.js
```

Para iniciar la ejecucion de la API y comprobar que no existan errores.

### API SERVER - MASTER

Para la API server necesitamos conectarnos a MongoDB, en este tutorial utilizaremos una conexion a un clúster en MongoAtlas, posteriormente conectaremos una instancia de MongoDB ejecutandose en Docker.

Por el momento, iniciaremos ejecutando el comando de inicio de npm en otra carpeta, la cual contendra nuestro server master.

```bash
$ npm init
```

Ingresamos todas nuestras configuraciones del paquete, y procedemos a escribir nuestro Dockerfile.

El dockerfile utilizado para esta API es muy parecido al de la otra API, sin embargo removemos la necesidad de montar el directorio /elements/procs y tambien cambiamos el puerto que expondremos.

```Dockerfile
# Obtener la imagen que necesitamos
# en este caso, node v.14.x.x

FROM node:14

# Asignar el workdir de la api
WORKDIR /usr/src/app

# Copiar el package-json
COPY package\*.json ./

# Correr 'npm install' para instalar todas las dependencias que necesitemos
RUN npm install

# Aca pueden existir muchos mas comandos "run"
# Copiar todos los archivos al workdir
COPY . .

# Exponer el puerto 4001 al mundo
EXPOSE 4001

# Correr NodeJS
CMD [ "node", "server.js" ]
```

Después, iniciamos a escribir nuestros módulos. El primer archivo que necesitamos necesita realizar todas las operaciones que realizaremos en MongoDB, en este caso le llamaremos mongo.js ![mongo.js](../Tutoriales/server-master/mongo.js)

```javascript
// Este modulo lo instalamos por aparte
// Este nos sirve para conectarnos a MongoDB, es como un driver pero con muchas mas utilidades
const mongoose = require('mongoose'); // npm i mongoose

// Recordar que este dato viene del archivo .env en el directorio donde se encuentra este archivo
const MONGO_URL = process.env.MONGO_URL; // Leer el URL de MongoDB desde el ambiente
const MONGO_CONFIG = { useNewUrlParser: true, useUnifiedTopology: true }; // Configuracion de mongo config, necesaria para conectarse de forma segura

// Realizar la conexion al URL con mongoose
mongoose
.connect(MONGO_URL, MONGO_CONFIG)
.then(() => {
// Esta funcion se ejecutara cuando la conexion haya sido exitosa
console.log("Server2: La base de datos fue correctamente conectada.");
})
.catch((error) => {
// Esta funcion se ejecutara solamente cuando haya un error de conexion
console.log("Server2: Error de conexion en la base de datos");

        // Salir del programa, ya que no nos sirve tener la API funcionando si esta mal la conexion
        process.exit(1);
    });

// Realizar el modelo con el que se guardaran en la base de datos los datos.
const TimeStamp = mongoose.model( // Timestamp es el modelo que se utilizara
'Timestamp', // Este es el nombre del modelo, saldra en donde visualicemos MongoDB
// Los datos que se guardaran en la base de datos
{
timestamp: String //Este es el timestamp que queremos guardar
//Aca vienen todos los demas campos que querramos guardar
}
);

// Crear datos en la base de datos
// Notar que la funcion es async porque adentro de ella usamos await
const create = async (timestamp) => { // El timestamp es el valor que vamos a guardar en la base de datos.

    const newTimestamp = new TimeStamp({ timestamp }); // Crear una nueva instancia del modelo, con el dato guardado.

    // Tratar de guardar en la base de datos
    try {
        console.log("Server2: Crear un nuevo timestamp");
        await newTimestamp.save(); // Guardar en la base de datos el tiempo que acabamos de crear

        console.log("Server2: Timestamp guardado correctamente");
        return { msg: 'Ok', data: newTimestamp.toJSON(), code: 201 }; // Retornar un objeto con los datos que acabamos de crear
    }
    // Si existio un error en el guardado de los datos, mandar un error
    catch ({ message }) {
        console.log(`Server2: Error producido guardando informacion en MongoDB, error ${message}`);
        return { msg: message, data: null, code: 500 }; // Retornar un objeto con un mensaje de error
    }

};

// Obtener todos los datos de la base de datos
// Notar que la funcion es async porque adentro de ella usamos await
const getAll = async () => {
// Tratar de opbtener todos los registros en la base de datos
try {
console.log("Server2: Obtener todos los timestamps");
const all_data = await TimeStamp.find({}); // Obtener todos los datos de la base de datos, por ello pasamos el objeto "{}" para que no tenga ningun filtro

        console.log("Server2: Datos obtenidos correctamente");
        return { data: all_data, code: 201 }; // Retornar un objeto con los datos que acabamos de obtener, en forma de array
    }
    // Si existio un error en la obtencion de datos, mandar un error
    catch ({ message }) {
        console.log(`Server2: Error producido guardando informacion en MongoDB, error ${message}`);
        return { data: [], code: 500 }; // Retornar un array vacio
    }

};

// Exportar las funciones que acabamos de realizar
module.exports = { create, getAll };

En este modulo realizamos todas las conexiones y configuraciones necesarias para que funcione nuestra base de datos MongoDB, nos conectamos a la BD y exportamos dos funciones, una para escribir y otra para leer todos los documentos.

Ahora que ya tenemos configurado esto, podemos iniciar a programar nuestra API.

El codigo de la API del server master es muy parecida a la API del server slave, unicamente cambia en la forma en la que se llaman a las otras funciones y ademas el tipo de retorno que se espera. Ademas, aca no tenemos necesidad de leer el modulo. Escribimos la api en el archivo server.js ![server.js](../Tutoriales/server-master/server.js)

// Requerir DOTENV que carga la configuracion que tenemos en el archivo .env en el directorio principal
// Aca se pueden definir todas las variables de entorno
require('dotenv').config(); //npm i dotenv

// Estos modulos los instalamos por aparte
const express = require('express'); // npm i express

// Estos modulos son creados por nosotros
const { create, getAll } = require('./mongo'); // Obtenemos la funcion create y getAll que estan siendo exportadas

// INICIAMOS CON LA API
const app = new express(); // Creamos una instancia de express para manejar nuestra API

// IMPORTANTE! Le decimos a express que necesitamos trabajar con intercambio de datos JSON
app.use(express.json({ extended: true }))

// Este metodo HTTP nos servira para crear un registro en la base de datos de mongo
app.post('/', async (req, res) => {
// Primero, validaremos que la llamada venga correctamente
if (!req.body || !req.body.timestamp) {
return res.status(400).send({ msg: 'No se enviaron bien los datos' }); // No se hizo una buena peticion, devolvemos 400 BAD REQUEST
}
const { timestamp } = req.body;
console.log("Server2: Peticion de creacion de timestamp");

    // Deconstruir las propiedades del objeto que nos retorna, en este caso: code, msg y data. (El objeto se ve como: { code: 201, msg: 'Creado!', data: '22:03:01'})
    // Notemos el await porque estamos llamando a un metodo async
    const { code, msg, data } = await create(timestamp);

    // Retornar el codigo, y un objeto con el mensaje y datos que creamos
    return res.status(code).send({ msg, data });

});

// Este metodo HTTP nos servira para obtener todos los datos de la base de datos de mongo
app.get('/', async (req, res) => {
console.log("Server2: Peticion de obtencion de todos los timestamp");

    // Deconstruir las propiedades del objeto que nos retorna, en este caso: code, data (El objeto se ve como: { code: 200, data: ['22:03:01', '22:03:03'. '22:03:05']})
    // Notemos el await porque estamos llamando a un metodo async
    const { code, data } = await getAll();

    // Retornar el codigo, y un array con todos los datos
    return res.status(code).send(data);

});

// Si existe un puerto en la configuracion, la cargamos; de lo contrario se inicia en el puerto 4001
const PORT = process.env.port || 4001;

// Iniciar la API en el puerto que definimos, mostrar en consola que ya esta funcionando.
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });
```

Por último, agregamos un archivo llamado .env en el directorio raiz de la API para proporcionar el URL de conexion a la base de datos y el puerto donde se ejecutara la API.

```conf
MONGO_URL=#URLClusterMongoATLAS
PORT=4001
```

```bash
# Ahora ya estamos listos para ejecutar nuestra api, unicamente nos hace falta instalar nuestras dependencias
$ npm i mongoose express dotenv

# Por último, corroboramos que todo este correcto utilizando el comando
$ node server.js
```

### Conexion

Hasta el momento con nuestras dos APIs funcionando, la api server slave corriendo en el puerto 4000 y la api server master corriendo en el puerto 4001, podemos probar que todo este funcionando correctamente realizando un POST a http://localhost:4000, no debemos enviar nada ya que la API se encargara de leer el modulo kernel y realizar un post a la otra api para que lo guarde en MongoDB.

Luego, realizando un GET a http://localhost:4000 deberiamos tener una lista HTML con todos los timestamps almacenados en la BD de MongoDB.

### Containers

Ya que nos funciona nuestra API localmente y sin utilizar Docker, utilizaremos Docker para distribuirla y empaquetarla. Para ello, realizaremos una imagen de Docker por cada Dockerfile que creamos, en este caso, una para cada API.

**Antes de crear la imagen para el contenedor slave, debemos cambiar el nombre del host en el archivo .env que creamos anteriormente. Este archivo debe contener otro tipo de informacion, escribimos entonces en el archivo .env en el directorio raiz de la API:**

```conf
API_URL=http://master:4001/
PORT=4000
```

**Notemos que utilizamos el host "master", la red de Docker se encargara de buscar un contenedor en la red con ese nombre y cambiar "master" por la IP que utilicemos.**

```bash
# Guardamos los cambios, y en el directorio de API SERVER SLAVE ejecutamos el siguiente comando:
$ docker build . -t node:slave

# Esto nos creará una imagen que posteriormente utilizaremos para crear contenedores de tipo slave.
# Luego, nos dirigimos al directorio de API SERVER MASTER, ejecutamos el siguiente comando
$ docker build . -t node:master
```

Esto nos creará una imagen que posteriormente utilizaremos para crear contenedores de tipo master.

Ahora, posicionados en cualquier directorio, crearemos nuestra primera red de Docker.

### Docker Networks

Conectaremos los contenedores en una red de docker llamada networkapi, por el momento contendrá las dos APIs que acabamos de realizar.

```bash
# Ejecutamos el siguiente comando:
$ docker network create networkapi

# La salida de esperada de este comando es un ID que utilizaremos para referenciar nuestra Network.
# Podemos revisar el contenido de esta network con el comando

$ docker network inspect networkapi
```

La salida de este comando se ve mas o menos así (depende su version y los ids cambiaran):

```json
[
  {
    "Name": "networkapi",
    "Id": "432c46140bf2de758da2ca466c2ca7182ad3c8c3d307bf20abec23842cfd65d6",
    "Created": "2021-02-24T03:58:16.6466156Z",
    "Scope": "local",
    "Driver": "bridge",
    "EnableIPv6": false,
    "IPAM": {
      "Driver": "default",
      "Options": {},
      "Config": [
        {
          "Subnet": "172.18.0.0/16",
          "Gateway": "172.18.0.1"
        }
      ]
    },
    "Internal": false,
    "Attachable": false,
    "Ingress": false,
    "ConfigFrom": {
      "Network": ""
    },
    "ConfigOnly": false,
    "Containers": {},
    "Options": {},
    "Labels": {}
  }
]
```

Como podemos observar aun no existe ninguna configuracion en "Containers", en este apartado de este archivo JSON es donde se agregaran todos los contenedores que necesitamos que sean parte de la red. Otro punto importante es el tipo de red, en este caso llamado "Driver" esta asignado al valor "bridge" indicando que es un tipo de red de puente.

Podemos corroborar que nuestra red este funcionando con el comando

```bash
$ docker network ls
```

Que nos sacara una salida parecida a esta:

|  NETWORK ID  |    NAME    | DRIVER | SCOPE |
| :----------: | :--------: | :----: | :---: |
| e11d221cc035 |   bridge   | bridge | local |
| 7967c4c19ae6 |    host    |  host  | local |
| 432c46140bf2 | networkapi | bridge | local |
| cd636f23b049 |    none    |  null  | local |

Ahora podemos iniciar los contenedores de nuestras APIs y realizar nuestras pruebas

### Creando los containers

Para crear los containers de cada uno de nuestras imagenes, realizamos los siguientes comandos:

1. Crear contenedor slave

```bash
$ docker run -dit --name=slave -p 80:4000 -v /proc/:/elements/procs/ node:slave
```

Con este comando creamos un contenedor que esta corriendo de forma interactiva y detached (opcion -dit), le llamamos _slave_, lo publicamos en el puerto 80 del host (es decir el default para peticiones http, y mapeado al puerto 4000 del contenedor) con la opcion -p, creamos un volumen y montamos los archivos contenidos en /proc/ del host a /elements/procs del contenedor con el comando -v y por ultimo definimos el nombre de la imagen que queremos crear (node:slave como lo definimos con los Dockerfiles).

2. Crear contenedor master

El comando a ejecutar es muy parecido, unicamente que no necesitamos publicarlo ni tampoco crearle un volumen.

```bash
$ docker run -dit --name=master node:master
```

Este comando es mucho mas sencillo, no necesitamos publicar ningun puerto (aunque recordemos que el contenedor tiene expuesto el puerto 4001), y unicamente le definimos un nombre, la opcion de correr de forma interactiva y detached, y por ultimo la imagen con la que se creara el contenedor.

### Probando los contenedores

Podemos realizar pruebas a este contenedor utilizando el comando curl

Para probar la funcionalidad del primer contenedor podemos realizar una peticion al puerto 80 del host.

```bash
$ curl http://localhost:80
```

Esperamos que podamos conectarnos, aunque por el momento nos devolvera un mensaje de error (aun no podemos comunicarnos entre contenedores porque intenta obtener http://master:4001).

Por el momento la red principal de docker (donde aun se encuentran estos contenedores porque no los hemos agregado a la red de docker) no puede mapear la direccion http://master:4001.

```bash
# Para probar nuestro contenedor master, podemos acceder a el, utilizando el siguiente comando:
$ docker exec -it master bash
```

Con este comando accederemos al bash tty del contenedor, con el cual podremos realizar algunas acciones basicas.

Realicemos entonces una peticion GET para ir a traer todos los timestamps a la base de datos de MongoDB, este comando si deberia de ser funcional.

Adentro del contenedor de docker, realizamos el siguiente comando:

```bash
$ curl http://localhost:4001/
```

Que nos deberia devolver un array vacio ya que aun no hay datos.

#### La belleza de Docker Logs

Podemos revisar el estado de nuestras apis utilizando el comando docker logs, el cual nos deja ver lo que sea que hayamos escrito en el "console.log" de nuestras APIS.

```bash
$ docker logs slave
# Nos mostrara el mensaje "API lista en -> http://localhost:4000"

$ docker logs master
# Nos mostrara el mensaje "API lista en -> http://localhost:4001"
```

Ademas nos mostraran mas logs dependiendo de las peticiones que hayamos realizado a cada una de ellas; podemos corroborar los estados de los contenedores de esta manera.

### Conectando los contenedores a la base de datos

Ahora, procedamos a agregar los contenedores a la red.

```bash
# Para agregar un contenedor a una red, utilizamos el comando docker network connect de la siguiente manera:
$ docker network connect networkapi slave

# Con este comando agregamos a la red networkapi el contenedor slave. Ahora, finalizamos agregando el contenedor master a la misma red.
$ docker network connect networkapi master

# Comprobamos que estos contenedores hayan sido agregados con el comando:
$ docker network inspect networkapi
```

Y tendremos que obtener una salida asi:

```json
[
  {
    "Name": "networkapi",
    "Id": "432c46140bf2de758da2ca466c2ca7182ad3c8c3d307bf20abec23842cfd65d6",
    "Created": "2021-02-24T03:58:16.6466156Z",
    "Scope": "local",
    "Driver": "bridge",
    "EnableIPv6": false,
    "IPAM": {
      "Driver": "default",
      "Options": {},
      "Config": [
        {
          "Subnet": "172.18.0.0/16",
          "Gateway": "172.18.0.1"
        }
      ]
    },
    "Internal": false,
    "Attachable": false,
    "Ingress": false,
    "ConfigFrom": {
      "Network": ""
    },
    "ConfigOnly": false,
    "Containers": {
      "637aa2b2ce877209fa2ccbd66fc5bec3864f2676adf09749cfdceaba145d7849": {
        "Name": "master",
        "EndpointID": "fb00fb61213bf713e9814106acffc3929d2cbe3d1bf0eb0cf13d45302b8834f1",
        "MacAddress": "02:42:ac:12:00:03",
        "IPv4Address": "172.18.0.3/16",
        "IPv6Address": ""
      },
      "6d9c90bbb1763cade9b98b8f5185abcdad3d678b5f6608bd4c790efe5e426f87": {
        "Name": "slave",
        "EndpointID": "7a6dcfb0e6a29df9732bd8fab653f47d141cd4cf4c6e3073e7cd153e67330ea5",
        "MacAddress": "02:42:ac:12:00:02",
        "IPv4Address": "172.18.0.2/16",
        "IPv6Address": ""
      }
    },
    "Options": {},
    "Labels": {}
  }
]
```

Ahora si, nuestro controlador de peticiones de docker mapeara http://master:4001 al URl http://172.18.0.3:4001, y este URL es totalmente accesible desde el contenedor slave.

### Comprobando

Para comprobar que nuestro servicio funciona, podemos utilizar diferentes herramientas. Una de las mas rapidas de implementar será CURL, con la cual podemos realizar una peticion POST y GET.

#### Probando el guardado de timestamps

Realizamos una peticion POST a localhost, desde el Host donde estamos trabajando:

```bash
$ curl -X POST http://localhost/
```

Esto nos creara un nuevo record en labase de datos, conectandose primero a la API slave.

#### Probando la obtencion de timestamps

Realizamos una peticion GET a localhost, desde el Host donde estamos trabajando:

```bash
$ curl http://localhost/
```

Esto nos devolverá una lista HTML con todos nuestros timestamps ingresados.
