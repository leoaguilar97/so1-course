# GOOGLE PUB SUB

## ¿Qué es Publisher / Subscriber? 

Este patrón yace en la capacidad de los subscriptores en conocer el estado del sujeto registrándose para ello  a un publicador para recibir notificaciones cuando algún evento en este último suceda. Un objeto llame a los métodos de otro objeto directamente, ellos se subscriben a un evento en particular de ese otro objeto, recibiendo los mensajes de notificación cuando dicho evento ocurra.

El sistema publish/subscribe es un paradigma de mensajes asíncronos donde los que envían (Publisher) mensajes no están programados para enviar sus mensajes a receptores específicos (Subscribers), sino que se envían a algún tipo de servidor. Los mensajes publicados se caracterizan por clases, sin tener constancia de los subscribidores que pueda haber. Los subscribidores expresan interés en una o más clases, y solo reciben mensajes de ese mismo interés, sin tener constancia de qué publicadores hay. Esta relación independiente entre publicadores y subscribidores puede permitir una mayor escalabilidad.

Hay dos maneras de filtrar los mensajes: por tópicos o por el contenido de estos.

Cuando hablamos de filtrado por tópicos, decimos que los mensajes son publicados por “temas” o canales. Los subscribidores en un sistema de filtrado por tópicos recibirán todos los mensajes publicados, de aquellos tópicos o temas en los cuales se hayan subscrito, y todos los subscribidores de un tópico o tema recibirán los mismos mensajes. Son los publicadores, los responsables de definir los diferentes tipos de temas o tópicos a los cuales se subscribirán los subscribidores

## ¿Qué es Google PubSub?

Pub/Sub es un servicio de mensajería asíncrona que separa los servicios que producen eventos de servicios que procesan eventos.

Puedes usar Pub/Sub, como middleware orientado a la mensajería o transferencia y entrega de eventos para las canalizaciones de estadísticas de transmisión.

Pub/Sub ofrece almacenamiento de mensajes duradero y entrega de mensajes en tiempo real con alta disponibilidad y rendimiento coherente a gran escala. Los servidores de Pub/Sub se ejecutan en todas las regiones de Google Cloud, en todo el mundo.

## Pasos para utilizar Google PubSub

Para utilizar Google PubSub se debe inicialmente crear una cuenta en Google Cloud Platform, iniciar un proyecto, se necesita acceso a fondos.

1. Ir al servicio Google PubSUb https://console.cloud.google.com/cloudpubsub 
2. Configurar un nuevo topic (dar un nombre y, para este ejemplo, dejar todo lo demás como default)
3. En la configuración del tópico, crear un nuevo subscriber (dar un nombre, y para este ejemplo dejar todo lo demás como default)
4. Guardar todos los cambios
5. Acceder a la configuración de IAM
6. Crear un nuevo Service Accout
7. Dar un nombre
8. Dar permisos de Publisher y Subscriber
9. Descargar la llave JSON, llamarla key.json y guardarla en un lugar conocido
10. Agregar la llave a una variable de entorno llamada GOOGLE_APPLICATION_CREDENTIALS entorno (Por ejemplo, en Windows: $env:GOOGLE_APPLICATION_CREDENTIALS='path_a_la_llave/key.json')

Ya que configuramos todo lo necesario para crear nuestro publisher subscriber, escribiremos el código de nuestro Subscriber utilizando NodeJS, y Publisher utilizando Go.

### Creando el Subscriber

Iniciamos con el comando para crear un nuevo módulo de nodejs

```Bash
# Iniciamos el módulo
$ npm init subscriber

# Agregamos todas las dependencias
$ npm install --save @google-cloud/pubsub
$ npm install --save axios
```

Guardamos una copia de la lalve que generamos en el entorno. **Agregamos el archivo de la llave al .gitignore**

Ahora agregamos un nuevo archivo llamado index.js donde escribiremos el siguiente código:

```Javascript

// Importar la libreria de Google PubSub
// Para instalar, utilizamos npm install --save @google-cloud/pubsub
// Generalmente esto lo hacemos en un fronted!
const { PubSub } = require('@google-cloud/pubsub');

// Importar axios para realizar una peticion http
// Para instalar utilizamos npm install --save axios
const axios = require('axios');

// Acá escribimos la suscripción que creamos en Google Pub/Sub
const SUB_NAME = 'projects/sopes1-auxiliatura/subscriptions/twitterLite-sub';

// Cantidad de segundos que estara prendido nuestro listener
// Solo para efectos practicos, realmente esto debería estar escuchando en todo momento!
const TIMEOUT = process.env.TIMEOUT || 180;

// Crear un nuevo cliente de pubsub
const client = new PubSub();

// En este array guardaremos nuestros datos
const messages = [];

// Esta funcion se utilizara para leer un mensaje
// Se activara cuando se dispare el evento "message" del subscriber
const messageReader = async message => {

    console.log('¡Mensaje recibido!');
    console.log(`${message.id} - ${message.data}`);
    console.table(message.attributes);

    messages.push({ msg: String(message.data), id: message.id, ...message.attributes });

    // Con esto marcamos el acknowledgement de que recibimos el mensaje
    // Si no marcamos esto, los mensajes se nos seguirán enviando aunque ya los hayamos leído!
    message.ack();

    try {
        console.log(`Agregando mensaje al servidor...`);
        const jsonMessage = JSON.parse(message.data) || {};
        const request_body = { name: jsonMessage.Name || jsonMessage.name || "Anonimo", msg: jsonMessage.Msg || jsonMessage.msg || "Empty" };
        await axios.post(process.env.API_URL, request_body);
    }
    catch (e) {
        console.log(`Error al realizar POST ${e.message}`);
    }
};

// Empezamos nuestro manejador de notificaciones
const notificationListener = () => {

    // Creamos un subscriptor
    // Pasamos el nombre de nuestro subscriptor (que encontramos en Google Cloud)
    const sub = client.subscription(SUB_NAME);

    // Conectar el evento "message" al lector de mensajes
    sub.on('message', messageReader);

    console.log("Estoy a la espera de los mensajes...");

    setTimeout(() => {
        sub.removeListener('message', messageReader);

        if (messages.length > 0) {
            console.log(`${messages.length} mensajes recibidos: `);
            console.log("---------");
            console.table(messages);
        }
        else {
            console.log("No hubo ningún mensaje en este tiempo. :(")
        }

    }, TIMEOUT * 1000);
};

console.log(`Iniciando Subscriber, deteniendolo en ${TIMEOUT} segundos...`);

// Empezar a escuchar los mensajes
notificationListener();
```

Iniciamos el subscriber con el siguiente comando:

```bash
$ node index.js
```
Ahora vamos al dashboard de los tópicos en la consola de GCP.

Enviamos mensajes y deberíamos de obtenerlos en la consola que está ejecutando el archivo nodejs.

Por último, creamos un archivo Dockerfile

```Dockerfile
FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
ENV TIMEOUT=3600
ENV API_URL=http://slave:4000
CMD [ "node", "index.js" ]
```

### Creando el publisher

Para programar el publisher utilizaremos Go. Inicializamos el módulo utilizando el siguiente comando:

```Bash
$ go mod init publisher
```

Ahora agregamos las dependencias que necesitamos:

```Bash
$ go get cloud.google.com/go/pubsub
$ go get github.com/joho/godotenv
```

Ahora agregamos el siguiente código en un archivo publisher.go

```Go
package main

import (
	//Modulos built-in
	"context"
	"fmt"
	"os"
	"log"
	// Para oir a peticiones GET Y POST
    "net/http"
	// Enviar datos en json
	"encoding/json"

	// Leer variables de entorno
	"github.com/joho/godotenv"
	// Libreria de Google PubSub
	"cloud.google.com/go/pubsub"
)

// Con esta funcion obtendremos variables de entorno
// Desde el archivo de configuracion
func goDotEnvVariable(key string) string {

	// Leer el archivo .env ubicado en la carpeta actual
	err := godotenv.Load(".env")
	
	// Si existio error leyendo el archivo
	if err != nil {
	  log.Fatalf("Error cargando las variables de entorno")
	}
	
	// Enviar la variable de entorno que se necesita leer
	return os.Getenv(key)
}

// Esta funcion es utilizada para publicar un mensaje
// Como parametro se manda el mensaje que publicaremos a PubSub
func publish(msg string) error {
	// Definimos el ProjectID del proyecto
	// Este dato lo sacamos de Google Cloud
	projectID := goDotEnvVariable("PROJECT_ID")

	// Definimos el TopicId del proyecto
	// Este dato lo sacamos de Google Cloud
	topicID := goDotEnvVariable("TOPIC_ID")

	// Definimos el contexto en el que ejecutaremos PubSub
	ctx := context.Background()
	// Creamos un nuevo cliente
	client, err := pubsub.NewClient(ctx, projectID)
	// Si un error ocurrio creando el nuevo cliente, entonces imprimimos un error y salimos
	if err != nil {
		fmt.Println("error")
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}
	
	// Obtenemos el topico al que queremos enviar el mensaje
	t := client.Topic(topicID)

	// Publicamos los datos del mensaje
	result := t.Publish(ctx, &pubsub.Message { Data: []byte(msg), })
	
	// Bloquear el contexto hasta que se tenga una respuesta de parte de GooglePubSub
	id, err := result.Get(ctx)
	
	// Si hubo un error creando el mensaje, entonces mostrar que existio un error
	if err != nil {
		fmt.Println("error")
		fmt.Println(err)
		return fmt.Errorf("Error: %v", err)
	}

	// El mensaje fue publicado correctamente
	fmt.Println("Published a message; msg ID: %v\n", id)
	return nil
}

// Esta estructura almacenara la forma en la que se enviaran los datos al servidor
type Message struct {
	// Nombre de la persona que envia el mensaje
	Name string 
	// Cuerpo del mensaje
	Msg  string
}

// Creamos un server sencillo que unicamente acepte peticiones GET y POST a '/'
func http_server(w http.ResponseWriter, r *http.Request) {
	// Comprobamos que el path sea exactamente '/' sin parámetros
    if r.URL.Path != "/" {
        http.Error(w, "404 not found.", http.StatusNotFound)
        return
    }
	
	// Comprobamos el tipo de peticion HTTP
    switch r.Method {
		// Devolver una página sencilla con una forma html para enviar un mensaje
		case "GET":     
			// Leer y devolver el archivo form.html contenido en la carpeta del proyecto
			http.ServeFile(w, r, "form.html")

		// Publicar un mensaje a Google PubSub
		case "POST":
			// Si existe un error con la forma enviada entonces no seguir
			if err := r.ParseForm(); err != nil {
				fmt.Fprintf(w, "ParseForm() err: %v", err)
				return
			}

			// Obtener el nombre enviado desde la forma
			name := r.FormValue("name")
			// Obtener el mensaje enviado desde la forma
			msg := r.FormValue("msg")

			// Crear un objeto JSON con los datos enviados desde la forma
			message, err := json.Marshal(Message{ Name: name, Msg: msg })
			// Existio un error generando el objeto JSON
			if err != nil {
				fmt.Fprintf(w, "ParseForm() err: %v", err)
				return
			}

			// Publicar el mensaje, convertimos el objeto JSON a String
			publish(string(message))

			// Enviamos informacion de vuelta, indicando que fue generada la peticion
			fmt.Fprintf(w, "¡Mensaje Publicado!\n")
			fmt.Fprintf(w, "Name = %s\n", name)
			fmt.Fprintf(w, "Message = %s\n", message)
			fmt.Fprintln(w, string(message))
		
		// Cualquier otro metodo no sera soportado
		default:
			fmt.Fprintf(w, "Metodo %s no soportado \n", r.Method)
			return
    }
}

// Funcion de entrada del programa
func main() {

	fmt.Println("Server Google PubSub iniciado")

	// Asignar la funcion que controlara las llamadas http
	http.HandleFunc("/", http_server)

	// Obtener el puerto al cual conectarse desde una variable de ambiente
	http_port := ":" + goDotEnvVariable("PORT")
	
	// Levantar el server, si existe un error levantandolo hay que apagarlo
    if err := http.ListenAndServe(http_port, nil); err != nil {
        log.Fatal(err)
    }
}
```

Por último, agregamos un archivo html para poder comprobar el funcionamiento de nuestro publisher:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Ejemplo Sistemas Operativos 1</title>
    <link
      href="http://fonts.cdnfonts.com/css/lemonade-stand"
      rel="stylesheet"
    />
    <style>
      body {
        background: url(https://i.pinimg.com/originals/47/0a/19/470a19a36904fe200610cc1f41eb00d9.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        font-family: "Lemonade Stand", sans-serif;
      }
      h1 {
        font-family: "Lemonade Stand", sans-serif;
        font-size: 150px;
        color: white;
        font-weight: bold;
        margin-left: 5%;
      }
    </style>
  </head>
  <body class="">
    <style>
      .ui-input-text {
        border: none !important;
        border-color: transparent !important;
        background-color: rgba(0, 0, 0, 0);
        width: 100%;
        margin: 10px 0px 10px 0px;
        height: 50px;
        max-width: 100%;
        min-width: 100%;
        font-family: "Lemonade Stand", sans-serif;
        font-size: 35px;
        color: white;
      }
      input:focus,
      select:focus,
      textarea:focus,
      button:focus {
        outline: none;
      }
      .transparenty {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 50px 100px 50px 100px;
        margin: 100px 100px 100px 100px;
      }
      .myButton {
        box-shadow: inset 0px 1px 0px 0px #54a3f7;
        background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
        background-color: #007dc1;
        border-radius: 3px;
        border: 1px solid #124d77;
        float: right;
        cursor: pointer;
        color: #ffffff;
        font-family: Arial;
        font-size: 13px;
        padding: 6px 24px;
        text-decoration: none;
        text-shadow: 0px 1px 0px #154682;
      }
      .myButton:hover {
        background: linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
        background-color: #0061a7;
      }
      .myButton:active {
        position: relative;
        top: 1px;
      }
    </style>
    <h1>TUITER :)</h1>
    <div class="transparenty">
      <form method="POST" action="/" name="formulary" target="_blank">
        <input
          name="name"
          class="ui-input-text"
          type="text"
          value=""
          required
          placeholder="Whats your name?"
        />
        <textarea
          name="msg"
          class="ui-input-text"
          type="text"
          value=""
          required
          multiple
          placeholder="Tell anything to the world..."
          style="min-height: 100px"
        ></textarea>
        <input type="submit" class="myButton" value="SEND" />
      </form>

      <script>
        document.formulary.submit();
        document.formulary.reset();
      </script>
    </div>
  </body>
</html>
```

Agregamos la llave key.json al folder donde estemos trabajando, y por último, agregamos un archivo Dockerfile

```Dockerfile
FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
RUN go mod download
EXPOSE 5001
CMD ["go", "run", "publisher.go"]
```

# Docker compose

Docker Compose es una herramienta que permite simplificar el uso de Docker. A partir de archivos YAML es mas sencillo crear contendores, conectarlos, habilitar puertos, volumenes, etc. Aquí resumimos algunos tips.

Con Compose puedes crear diferentes contenedores y al mismo tiempo, en cada contenedor, diferentes servicios, unirlos a un volúmen común, iniciarlos y apagarlos, etc. Es un componente fundamental para poder construir aplicaciones y microservicios.

En vez de utilizar Docker via una serie inmemorizable de comandos bash y scripts, Docker Compose te permite mediante archivos YAML para poder instruir al Docker Engine a realizar tareas, programaticamente. Y esta es la clave, la facilidad para dar una serie de instrucciones, y luego repetirlas en diferentes ambientes.

## Crear un archivo docker-compose.yml

Creamos un archivo docker-compose.yml que utilizaremos para levantar todos nuestros servicios, incluídos los de la clase 5, donde creamos un servdor master y un servidor slave y los conectamos a través de una red Docker.

Este archivo debe llamarse docker-compose.yml

```Yml
version: "3.9"
services:
  publisher:
    image: golang:pub
    ports:
      - "5001:5001"
    networks:
      - tuiter

  subscriber:
    build: ./Subscriber
    depends_on:
      - publisher
    restart: always
    networks:
      - tuiter

  master:
    image: node:master
    ports:
      - "4001:4001"
    networks:
      - tuiter

  slave:
    image: node:slave
    ports:
      - "80:4000"
    networks:
      - tuiter

networks:
  tuiter:
    driver: "bridge"
```

Por último, creamos nuestro proyecto de docker-compose.

```Bash
$ docker-compose up -d --build
```

Y comprobamos toda nuestra configuración

# Referencias

https://cloud.google.com/pubsub/docs/overview?hl=es-419#:~:text=Pub%2FSub%20es%20un%20servicio,canalizaciones%20de%20estad%C3%ADsticas%20de%20transmisi%C3%B3n. 

https://dockertips.com/utilizando-docker-compose#:~:text=Docker%20Compose%20es%20una%20herramienta%20que%20permite%20simplificar%20el%20uso%20de%20Docker.&text=En%20vez%20de%20utilizar%20Docker,Engine%20a%20realizar%20tareas%2C%20programaticamente.

https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern

https://ably.com/topic/pub-sub



















