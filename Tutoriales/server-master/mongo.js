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
    'Timestamp',  // Este es el nombre del modelo, saldra en donde visualicemos MongoDB
    // Los datos que se guardaran en la base de datos
    {
        timestamp: String, //Este es el timestamp que queremos guardar,
        name: String, //Este es el nombre de quien envia el mensaje,
        msg: String //Este es el mensaje
        /*
            Aca vienen todos los demas campos que querramos guardar
        */
    }
);

// Crear datos en la base de datos 
// Notar que la funcion es async porque adentro de ella usamos await
const create = async (timestamp, name, msg) => { // El timestamp es el valor que vamos a guardar en la base de datos.

    const newTimestamp = new TimeStamp({ timestamp, name, msg }); // Crear una nueva instancia del modelo, con el dato guardado.

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