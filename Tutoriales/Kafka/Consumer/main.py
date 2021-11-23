
# Consumer Kafka
# Autor: Leonel Aguilar

# python3 -m pip install kafka-python
from kafka import KafkaConsumer

# python3 -m pip install prettytable
from prettytable import PrettyTable

# Json para parsear la información
import json

print("Conectandose")

# Definimos un nuevo consumidor al tópico "topic1"
consumer = KafkaConsumer('sopes1')

# Tabla con los datos a mostrar
table = PrettyTable()
title = table.field_names = ["nombre", "genero"]

# Esto se quedará en el ciclo hasta que cerremos el programa
for msg in consumer:
    # obtenemos el valor del mensaje
    value = msg.value.decode('utf-8')
    #print(f"> Recibido: {value}")
    
    # Si contiene el string "json:" al inicio, lo convertiremos a json
    if "json:" in value:
        # hacemos un substring para quitar esa parte de "json:" y parseamos a JSON
        o = json.loads(value[5:])
        # agregamos a la tabla los valores que acabamos de parsear
        table.add_row([o['nombre'], o['genero']])
        print(table)
    else:
        # fue un mensaje normal enviado
        print(f"> Recibido: {value}")




