# Importamos la utileria de JSON para leer nuestro archivo
import json

# Importamos la utileria random para obtener numeros random en un rango
from random import random, randrange
from sys import getsizeof
from locust import HttpUser, task, between

# Esta variable controlara si queremos que salgan todas las salidas, o unicamente las mas importantes
debug = True

# Esta funcion utilizaremos para las salidas que no queremos que salgan siempre
# excepto cuando estamos debuggeando
def printDebug(msg):
    # Si la variable debug es True, queremos imprimir el mensaje
    if debug:
        print(msg)

# Esta clase nos ayudara a manejar todas las acciones de lectura de los datos del archivo
class Reader():

    # Constructor de la clase
    def __init__(self):
        # En esta variable almacenaremos nuestros datos
        self.array = []
        
    # Obtener un valor random del array
    # NOTA: ESTO QUITA EL VALOR DEL ARRAY.
    def pickRandom(self):
        # Obtenemos el numero de elementos del array
        length = len(self.array)
        
        # Si aun hay valores en el array
        if (length > 0):
            # Obtenemos un valor random desde 0 al largo del array - 1
            # Si el largo de nuestro arreglo es uno, entonces debemos de agarrar el ultimo indice posible, o sea 0.
            # De lo contrario, utilizaremos un valor al azar
            # Esta comparacion se hace debudo al error empty range for randrange() (0, 0, 0),
            # Al llegar a 1 en el largo, el rango de random se convierte en 0, 0; y hace fallar al programa
            random_index = randrange(0, length - 1) if length > 1 else 0

            # Devolvemos el valor que se encuentra en nuestro indice random
            # Quitamos el valor del array
            return self.array.pop(random_index)

        # Si ya no hay mas datos que leer del archivo
        else:
            # Imprimimos que ya no hay datos en el archivo
            print (">> Reader: No hay más valores para leer en el archivo.")
            # Retornamos nada
            return None
    
    # Cargar el archivo de datos json
    def load(self):
        # Mostramos en consola que estamos a punto de cargar los datos
        print (">> Reader: Iniciando con la carga de datos")
        # Ya que leeremos un archivo, es mejor realizar este proceso con un Try Except
        try:
            # Asignamos el valor del archivo traffic.json a la variable data_file
            with open("traffic.json", 'r') as data_file:
                # Con el valor que leemos de data_file vamos a cargar el array con los datos
                self.array = json.loads(data_file.read())
            # Mostramos en consola que hemos finalizado
            
            print (f'>> Reader: Datos cargados correctamente, {len(self.array)} datos -> {getsizeof(self.array)} bytes.')
        except Exception as e:
            # Imprimimos que no pudimos procesar la carga de datos
            print (f'>> Reader: No se cargaron los datos {e}')

# Esta clase es utilizada para crear una prueba de locust como tal
# Deriva de HTTP-User, simulando un usuario utilizando nuestra APP.
# En esta clase definimos todo lo que necesitamos hacer con locust.
class MessageTraffic(HttpUser):
    # Tiempo de espera entre peticiones
    # En este caso, esperara un tiempo de 0.1 segundos a 0.9 segundos (inclusivo) 
    #  entre cada llamada HTTP
    wait_time = between(0.1, 0.9)

    # Este metodo se ejecutara cada vez que empecemos una prueba
    # Este metodo se ejecutara POR USUARIO (o sea, si definimos 3 usuarios, se ejecutara 3 veces y tendremos 3 archivos)
    def on_start(self):
        print (">> MessageTraffic: Iniciando el envio de tráfico")
        # Iniciaremos nuestra clase reader
        self.reader = Reader()
        # Cargaremos nuestro archivo de datos traffic.json
        self.reader.load()

    # Este es una de las tareas que se ejecutara cada vez que pase el tiempo wait_time
    # Realiza un POST a la dirección del host que especificamos en la página de locust
    # En este caso ejecutaremos una petición POST a nuestro host, enviándole uno de los mensajes que leimos
    @task
    def PostMessage(self):
        # Obtener uno de los valores que enviaremos
        random_data = self.reader.pickRandom()
        
        # Si nuestro lector de datos nos devuelve None, es momento de parar
        if (random_data is not None):
            # utilizamos la funcion json.dumps para convertir un objeto JSON de python
            # a uno que podemos enviar por la web (básicamente lo convertimos a String)
            data_to_send = json.dumps(random_data)
            # Imprimimos los datos que enviaremos
            printDebug (data_to_send)

            # Enviar los datos que acabamos de obtener
            self.client.post("/", json=random_data)

        # En este segmento paramos la ejecución del proceso de creación de tráfico
        else:
            print(">> MessageTraffic: Envio de tráfico finalizado, no hay más datos que enviar.")
            # Parar ejecucion del usuario
            self.stop(True) # Se envía True como parámetro para el valor "force", este fuerza a locust a parar el proceso inmediatamente.

    # Este es una de las tareas que se ejecutara cada vez que pase el tiempo wait_time
    # Realiza un GET a la dirección del host que especificamos en la página de locust
    @task
    def GetMessages(self):      
        # Realizar una peticion para recibir los datos que hemos guardado
        self.client.get("/")  

        