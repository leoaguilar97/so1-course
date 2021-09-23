# Utilizamos flask para hacer un server HTTP
from flask import Flask

# Importamos OS para obtener una variable del ambiente si es posible
import os

# Inicializamos la app de flask
app = Flask(__name__)

# Creamos una ruta a la que se accederá con una petición HTTP GET
@app.route("/")
def hello():
    return "¡Hola SO1!"

# Metodo principal en el que inicializamos el server
if __name__ == "__main__":
    # obtenemos el puerto del ambiente o lo definimos por defecto en el 5000
    port = int(os.environ.get("PORT", 5000))
    # iniciamos el servidor
    app.run(debug=True,host='0.0.0.0',port=port)