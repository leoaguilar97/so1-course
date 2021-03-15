# GRPC

## ¿Qué es un RPC?

Un RPC (por sus siglas, Remote Procedure Call) es un mecanismo de intercomunicación
donde un cliente llama de manera directa al código de un servidor.

## Protocol buffers

Los protocol buffers son una manera de serializar data estructurada de una manera neutral; que es independiente de la plataforma y del lenguaje. Una contraposición de esto es XML, pero más rápido, simple y pequeño.

En el protocol buffer se define cómo deseamos que la data esté estructurada, y a partir de ello generar código fuente que acceda a esa información estructurada a partir de una variedad de streams de datos, pudiendo utilizar
una gran variedad de lenguajes de programación.

Se soporta Java, Python, Objective-C, C++ de manera oficial, y varios lenguajes con implementaciones no oficiales.
Con Proto3, se puede utilizar Dart, Go, Ruby y C#; y muchos otros lenguajes serán añadidos posteriormente.

Transportan información binaria, entonces se tiene menos tiempo realizando parseo de datos, a contraposición con JSON.

Además permite definir los mensajes (data, request, response), nombres de servicios y endpoints de RPC.

Entonces, Utilizar protocol buffers significa que la comunicación será de forma más rápida y eficiente.

## HTTP-2

Http2 hará tus aplicaciones mas rápidas, simples y robustas. ¿Una rara combinación de atributos? Si, pero lo permite a través de mejorar varias de las características de HTTP1.1 que previamente se realizaban en la capa de transporte. Además, abre a un nuevo mundo de oportunidades y de optimizaciones para nuestras aplicaciones.

Una de las principales metas de HTTP-2 es reducir la latencia al habilitar la multiplexación de peticiones y respuestas, minimizando la cantidad de peticioners y también maximizando la cantidad de datos enviados a través de la compresión de los headers de HTTP.

Otra característica muy importante es que soporta los push de los servers; muchas otras cosas fueron realizadas en tope de este nuevo protocolo, un nuevo flujo de control de los datos, manejo de errores nativo, upgrades de mejoras, etc.

Es un protocolo revolucionario, y se espera que tome todo el tráfico de internet en las próximas décadas; será el backbone de la comunicación en los próximos años. Realiza una comunicación de dos vías, envía información binaria y compresa, a través de un canal seguro utilizando SSL.

## Microservicios

Ahora imaginemonos una arquitectura SOA orientada a microservicios, que tenga los microservicios de usuarios, compras, entregas, promociones; todas estas deben estar interconectadas, bloqueándose una a la otra y recibiendo toda la carga que está siendo realizada por los usuarios.

Para crear este tipo de arquitectura debemos de ponernos a pensar en demasiadas cosas, qué datos manejaremos, qué endpoints tendremos, qué errores manejaremos, la latencia que esperamos tener, ¿qué tanto obtendremos de una llamada? ¿qué tantas llamadas realizaremos entonces?

Empieza a volverse un tema muy complicado, es más, después de poco tiempo empieza a ser inmanejable y árduo de realizar.

Y ni hablar de empezar a dar paso a configuraciones más avanzadas como conexiones a bases de datos, patrones de errores, load balancers, autenticación, logging, monitoreo, etc..

Entonces nos preguntamos ¿habrá una mejor alternativa a esto?

## GRPC

Sus siglas significan grpc remote process call, es un framework de RPC que maneja un performance inigualable. Además, es parte de Cloud Native Computing Foundation, como Docker y Kubernetes.

Utiliza el patrón request response, donde permite definir peticiones y respuestas (Remote Procedure Calls) al código fuente de los servidores. Esto es lo único que hay que programar, después de eso maneja todo lo demás por nosotros.

Es eficiente, y rápido; según benchmarks es de 10 a 25 veces más rápido que su contraparte, REST.

Es moderno, utiliza el protocolo http/2, independiente del lenguaje, y por ello tiene muy poca latencia.

Pór último es seguro, por defecto utiliza un canal de comunicación SSL, y provee APIs para encriptar la información que se está enviando.

Algunos otros beneficios con los que cuenta son:

- SSL configurado automáticamente
- Maneja millones de peticiones por segundos
- Multiambiente
- Proto genera mucho del código que utilizaremos

### Escalabilidad

Los servidores son asíncronos por defecto, por lo que pueden manejar múltiples llamadas al mismo recurso.
Es eficiente ya que maneja millones de peticiones en paralelo. Los clientes además pueden decidir si son asíncronos
o síncronos. Y por último, se pueden implementar client-side load balancers.

### Tipos de API

- Unary: Es una arquitectura clásica de petición y respuesta.
- Server streaming: el server manda varias respuestas.
- Client streaming: el cliente manda varias peticiones, unicamente se da una respuesta.
- Bidirectional streaming: Tanto el cliente como el servidor envian varias peticiones.


# Utilizando gRCP

Para utilizar gRCP con Go realizamos los siguientes pasos:

1. Creamos las carpetas necesarias para nuestro proyecto

La estructura del proyecto debería ser así:

| gRCP
| ---- Cliente
| -------- greet.pb
| ------------ greet.proto
| -------- client.go
| -------- Dockerfile
| -------- form.html
| ---- Server
| -------- greet.pb
| ------------ greet.proto
| -------- server.go
| -------- Dockerfile
| ---- docker-compose.yml

2. Agregamos el código necesario de cada protofile

```Proto
// Este codigo va en los archivos greet.proto

// Definimos la version de protofiles que utilizaremos
syntax = "proto3";
// definimos el paquete en el que queremos que se cree nuestro protofile
package greet;
option go_package="greetpb";

// Iniciamos con la forma en la que se verá el mensaje inicial
//      1           2
// [first_name, last_name]
message Greeting {
    // Tendremos un string donde enviaremos el nombre de la persona, en la posición 1 del mensaje
    string first_name = 1;
    // Tendremos un string donde enviaremos el msg, en la posición 2 del mensaje
    string message = 2;
}

// Empaquetamos el mensaje que enviaremos
//      1               Greeting
// [GreetRequest{ first_name, message }]
message GreetRequest {
    // Tendremos un objeto Greeting que enviaremos
    Greeting greeting = 1;
}

// Ahora definimos la respuesta que esperamos del servidor cuando hagamos la peticion
//     1 
// [ result ]
message GreetResponse {
    // Tendremos un string donde enviaremos el resultado de la llamada, en la posición 1 del mensaje
    string result = 1;
}

// Ahora definimos el servicio que registraremos para utilizar gRPC
service GreetService{
    // Un servicio RPC que se llama Greet
    // Envía un mensaje de tipo GreetRequest (definido arriba)
    // Y espera como respuesta un GreetResponse (definido arriba)
    rpc Greet(GreetRequest) returns (GreetResponse) {};
}
```

3. Generamos el código Go de nuestro servicio gRPC

En la consola, posicionados en los folders greet.pb escribimos el siguiente comando:

```Bash
# Este comando nos servirá para generar código Go a partir de nuestro archivo proto
$ protoc greet.proto --go_out=plugins=grpc:.

# Consideraciones:

# Debemos tener instalado protoc, para ello descargamos el zip de la siguiente página: 
#   https://github.com/protocolbuffers/protobuf/releases 
# Desempaquetarlo en una dirección y agregarlo al PATH (si utilizan Windows)
```

Después, instalamos las dependencias que se necesitan para nuestro código:

```Bash
$ go get github.com/golang/protobuf/proto
$ go get google.golang.org/grpc
$ go get google.golang.org/protobuf/reflect/protoreflect@v1.25.0
```

4. Ahora definimos nuestros archivos Dockercompose

Para el cliente: 
```Dockerfile
FROM golang
WORKDIR /
COPY . .
RUN go mod download
EXPOSE 5000
CMD ["go", "run", "client.go"]
```

Para el servidor:
```Dockerfile
FROM golang
WORKDIR /
COPY . .
ENV HOST=0.0.0.0:50051
RUN go mod download
EXPOSE 50051
CMD ["go", "run", "server.go"]
```

Ahora definiremos un archivo docker-compose

```Yml
version: "3.9"
services:
  grpcserver:
    build: ./Server
    ports:
      - "50052:50051"
    networks:
      - grpctuiter

  grpcclient:
    build: ./Client
    environment:
      - CLIENT_HOST=:5000
      - SERVER_HOST=grpcserver:50051
      - NAME=instancia1
    ports:
      - "5001:5000"
    networks:
      - grpctuiter

networks:
  grpctuiter:
    driver: "bridge"
```

Con esto configuramos todas las variables de entorno y entornos de Go necesarios.


5. Iniciamos con la programación del servidor

En una terminal posicionada en gRPC/Server escribimos el siguiente comando:

```Bash
$ go mod init servergrpc
```

Ahora necesitamos escribir el código del servidor en el archivo gRPC/Server/server.go

```Go
// Paquete principal, acá iniciará la ejecución
package main

// Importar dependencias, notar que estamos en un módulo llamado grpctuiter
import (
	"context"
	"fmt"

	"os"

	"google.golang.org/grpc"
	"log"
	"net"
	"tuiterserver/greet.pb"
)

// Iniciar una estructura que posteriormente gRPC utilizará para realizar un server
type server struct{}

// Función que será llamada desde el cliente
// Debemos pasarle un contexto donde se ejecutara la funcion
// Y utilizar las clases que fueron generadas por nuestro proto file
// Retornara una respuesta como la definimos en nuestro protofile o un error
func (*server) Greet(ctx context.Context, req *greetpb.GreetRequest) (*greetpb.GreetResponse, error) {
	fmt.Printf(">> SERVER: Función Greet llamada con éxito. Datos: %v\n", req)

	// Todos los datos podemos obtenerlos desde req
	// Tendra la misma estructura que definimos en el protofile
	// Para ello utilizamos en este caso el GetGreeting
	firstName := req.GetGreeting().GetFirstName()
	message := req.GetGreeting().GetMessage()

	result := firstName + " dice " + message

	fmt.Printf(">> SERVER: %s\n", result)
	// Creamos un nuevo objeto GreetResponse definido en el protofile
	res := &greetpb.GreetResponse{
		Result: result,
	}

	return res, nil
}

// Funcion principal
func main() {

	// Leer el host de las variables del ambiente
	host := os.Getenv("HOST")
	fmt.Println(">> SERVER: Iniciando en ", host)

	// Primero abrir un puerto para poder escuchar
	// Lo abrimos en este puerto arbitrario
	lis, err := net.Listen("tcp", host)
	if err != nil {
		log.Fatalf(">> SERVER: Error inicializando el servidor: %v", err)
	}

	fmt.Println(">> SERVER: Empezando server gRPC")

	// Ahora si podemos iniciar un server de gRPC
	s := grpc.NewServer()

	// Registrar el servicio utilizando el codigo que nos genero el protofile
	greetpb.RegisterGreetServiceServer(s, &server{})

	fmt.Println(">> SERVER: Escuchando servicio...")
	// Iniciar a servir el servidor, si hay un error salirse
	if err := s.Serve(lis); err != nil {
		log.Fatalf(">> SERVER: Error inicializando el listener: %v", err)
	}
}

```

Con esto crearemos un server que escuche en el puerto que definamos en la variable de entorno server_host, que definimos en el archivo docker-compose.

Para comprobar que todo esté funcionando, realizamos el siguiente comando:

```Bash
$ go run ./server.go
```

El servidor iniciará a escuchar conexiones de nuevos clientes.

6. Agregamos el cliente

Nos posicionamos en una terminal en el folder gRPC/Client y escribimos el siguiente comando:

```Bash
$ go mod init clientgrpc
```

Ahora necesitamos escribir el código del servidor en el archivo gRPC/Client/client.go

```Go
// Paquete principal, acá iniciará la ejecución
package main

// Importar dependencias, notar que estamos en un módulo llamado tuiterclient
import (
	"context"

	"os"

	"fmt"
	"log"

	"net/http"

	"tuiterclient/greet.pb"

	"google.golang.org/grpc"
)

type server struct{}

// Funcion que realiza una llamada unaria
func sendMessage(first_name string, message string) {
	server_host := os.Getenv("SERVER_HOST")

	fmt.Println(">> CLIENT: Iniciando cliente")
	fmt.Println(">> CLIENT: Iniciando conexion con el servidor gRPC ", server_host)

	// Crear una conexion con el servidor (que esta corriendo en el puerto 50051)
	// grpc.WithInsecure nos permite realizar una conexion sin tener que utilizar SSL
	cc, err := grpc.Dial(server_host, grpc.WithInsecure())
	if err != nil {
		log.Fatalf(">> CLIENT: Error inicializando la conexion con el server %v", err)
	}

	// Defer realiza una axion al final de la ejecucion (en este caso, desconectar la conexion)
	defer cc.Close()

	// Iniciar un servicio NewGreetServiceClient obtenido del codigo que genero el protofile
	// Esto crea un cliente con el cual podemos escuchar
	// Le enviamos como parametro el Dial de gRPC
	c := greetpb.NewGreetServiceClient(cc)

	fmt.Println(">> CLIENT: Iniciando llamada a Unary RPC")

	// Crear una llamada de GreetRequest
	// Este codigo lo obtenemos desde el archivo que generamos con protofile
	req := &greetpb.GreetRequest{
		// Enviar un Greeting
		// Esta estructura la obtenemos desde el archivo que generamos con protofile
		Greeting: &greetpb.Greeting{
			FirstName: first_name,
			Message:   message,
		},
	}

	fmt.Println(">> CLIENT: Enviando datos al server")
	// Iniciar un greet, en background con la peticion que estamos realizando
	res, err := c.Greet(context.Background(), req)
	if err != nil {
		log.Fatalf(">> CLIENT: Error realizando la peticion %v", err)
	}

	fmt.Println(">> CLIENT: El servidor nos respondio con el siguiente mensaje: ", res.Result)
}

// Creamos un server sencillo que unicamente acepte peticiones GET y POST a '/'
func http_server(w http.ResponseWriter, r *http.Request) {
	instance_name := os.Getenv("NAME")
	fmt.Println(">> CLIENT: Manejando peticion HTTP CLIENTE: ", instance_name)
	// Comprobamos que el path sea exactamente '/' sin parámetros
	if r.URL.Path != "/" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	// Comprobamos el tipo de peticion HTTP
	switch r.Method {
	// Devolver una página sencilla con una forma html para enviar un mensaje
	case "GET":
		fmt.Println(">> CLIENT: Devolviendo form.html")
		// Leer y devolver el archivo form.html contenido en la carpeta del proyecto
		http.ServeFile(w, r, "form.html")

	// Publicar un mensaje a Google PubSub
	case "POST":
		fmt.Println(">> CLIENT: Iniciando envio de mensajes")
		// Si existe un error con la forma enviada entonces no seguir
		if err := r.ParseForm(); err != nil {
			fmt.Fprintf(w, "ParseForm() err: %v", err)
			return
		}

		// Obtener el nombre enviado desde la forma
		name := r.FormValue("name")
		// Obtener el mensaje enviado desde la forma
		msg := r.FormValue("msg") + "desde " + instance_name

		// Publicar el mensaje, convertimos el objeto JSON a String
		sendMessage(name, msg)

		// Enviamos informacion de vuelta, indicando que fue generada la peticion
		fmt.Fprintf(w, "¡Mensaje Publicado!\n")
		fmt.Fprintf(w, "Name = %s\n", name)
		fmt.Fprintf(w, "Message = %s\n", msg)

	// Cualquier otro metodo no sera soportado
	default:
		fmt.Fprintf(w, "Metodo %s no soportado \n", r.Method)
		return
	}
}

// Funcion principal
func main() {
	instance_name := os.Getenv("NAME")
	client_host := os.Getenv("CLIENT_HOST")

	fmt.Println(">> -------- CLIENTE ", instance_name, " --------")

	fmt.Println(">> CLIENT: Iniciando servidor http en ", client_host)

	// Asignar la funcion que controlara las llamadas http
	http.HandleFunc("/", http_server)

	// Levantar el server, si existe un error levantandolo hay que apagarlo
	if err := http.ListenAndServe(client_host, nil); err != nil {
		log.Fatal(err)
	}
}
```

Además, para servir el cliente de manera gráfica, utilizaremos un form realizado en HTML, para ello agregamos el HTMl en el siguiente archivo: gRPC/Client/form.html

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

7. Realizamos el docker-compose

```bash
$ docker-compose up -d --build
```

Ahora, accedemos desde el navegador a la URL que definimos en client_host, y comprobamos que todo esté funcionando correctamente. :)

# Referencias

https://www.udemy.com/course/grpc-golang/

https://github.com/SebastianSNZ/GRPCExample/blob/master/Server/main.go

https://husobee.github.io/golang/rest/grpc/2016/05/28/golang-rest-v-grpc.html

https://devcenter.heroku.com/articles/procfile 























