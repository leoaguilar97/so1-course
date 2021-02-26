// Requerir DOTENV que carga la configuracion que tenemos en el archivo .env en el directorio principal
// Aca se pueden definir todas las variables de entorno
require('dotenv').config();  //npm i dotenv

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

    // Obtenemos el timestamp, el nombre y el mensaje.
    const { timestamp, name, msg } = req.body;
    console.log("Server2: Peticion de creacion de timestamp");

    // Deconstruir las propiedades del objeto que nos retorna, en este caso: code, msg y data. (El objeto se ve como: { code: 201, msg: 'Creado!', data: '22:03:01'})
    // Notemos el await porque estamos llamando a un metodo async
    // Enviamos el timestamp, el nombre y el mensaje
    const { code, msg: message, data } = await create(timestamp, name, msg);

    // Retornar el codigo, y un objeto con el mensaje y datos que creamos
    return res.status(code).send({ message, data });
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
