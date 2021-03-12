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
		log.Fatalf(">> CLIEN: Error realizando la peticion %v", err)
	}

	fmt.Println(">> CLIENT: El servidor nos respondio con el siguiente mensaje: ", res.Result)
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

	port := os.Getenv("PORT")

	// Asignar la funcion que controlara las llamadas http
	http.HandleFunc("/", http_server)

	// Levantar el server, si existe un error levantandolo hay que apagarlo
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
