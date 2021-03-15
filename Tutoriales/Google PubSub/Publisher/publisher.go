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
