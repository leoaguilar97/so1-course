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
app.post('/', async (req, res) => { // es importante notar que este es un metodo async, ya  que utilizamos await dentro de el
    // Deconstruimos los valores de name y msg
    console.log(req.body);
    const { name, msg } = req.body;
    // Intentamos realizar el post al otro servidor con AXIOS
    try {
        // realizar una peticion HTTP POST a la otra API
        // enviamos el timestamp, un nombre, y un mensaje
        const { data } = await axios.post(OTHER_API_URL, { timestamp: getTimestamp(), name, msg });

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