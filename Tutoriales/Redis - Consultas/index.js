/*
    Universidad de San Carlos de Guatemala
    Ingeniería en Ciencias y Sistemas
    Sistemas Operativos 1
    Clase 13: REDIS
    Ejemplo de conexión y utilización de REDIS

    Autor: Leonel Aguilar
*/

const express = require("express"); // npm i express
const redis = require("redis"); // npm i redis

// Iniciamos con la api
const app = new express(); // Creamos una instancia de express para manejar nuestra API

// Le decimos a express que necesitamos trabajar con intercambio de datos JSON
app.use(express.json({ extended: true }))

// Conectarse con redis, para este ejemplo se especifican todos los campos
// el valor actual de estos campos es el que trae por defecto el cliente de redis
const client = redis.createClient({
    host: '34.125.51.125',
    port: 6379,
    auth_pass: ""
});

// Si existe un error conectándose a Redis, mostrarlo en consola
client.on('error', (err) => { console.error(err); });

app.post('/', (req, res) => {

    // Obtenemos el valor de la llave y el valor que agregaremos
    const { key, data } = req.body;
    // Convertimos el valor del dato a un string
    // !IMPORTANTE: Redis no trabaja con objetos por eso lo convertimos a string
    const json = JSON.stringify(data);

    // Utilizamos el comando SET <llave> <valor> para almacenar el valor nuevo en la BD
    client.set(key, json, (err, result) => {
        // Si existe algún error, mostrarlo en consola y enviar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Enviar el resultado de nuestra inserción
        return res.send(result);
    });
});

// Obtener una lista de datos 
// enviar como parámetro el nombre de alguna lista
app.get('/get/:list', (req, res) => {
    // obtener el nombre de la lista de los parámetros
    const { list } = req.params;

    // obtener el inicio desde donde se leerá la lista
    // si no fue enviado, utilizar 0
    const init = req.query.init || 0;
    // obtener el fin hasta donde se leerá la lista
    // si no fue enviado, utilizar -1 (o sea, leer hasta el final)
    const last = req.query.final || -1;

    // utilizar lrange para leer los datos de la lista
    client.lrange(list, init, last, (err, result) => {
        // si existió un error (que la lista no exista o que no sea de tipo lista
        // mostrar el error y retornar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Convertir a JSON los valores internos de la lista
        const jsonresult = result.map(r => JSON.parse(r));

        // Retornar el JSON de los valores
        return res.send(jsonresult);
    });
});

app.get('/', (req, res) => {
    // Utilizar el comando keys * para obtener todas las llaves almacenadas en REDIS
    client.keys('*', (err, keys) => {
        // Si existió un error mostrarlo en consola y enviar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Enviar un array con las llaves que fueron encontradas
        return res.send(keys);
    });
});

app.post('/add', (req, res) => {
    // Obtener la lista y el valor que agregaremos
    const { db, data } = req.body;
    // convertir el valor que enviaremos a string
    const json = JSON.stringify(data);

    // Utilizamos RPush para almacenar datos al FINAL de la lista
    // si necesitaramos agregarlo al inicio utilizaríamos LPush
    client.rpush(db, json, (err, result) => {
        // Si existió un error agregando a la lista
        // escribir el error y enviar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Retornar el resultado como un JSON
        return res.send({ result });
    });
});

app.post('/', (req, res) => {
    // Obtenemos el valor de la llave y el valor que agregaremos
    const { key, data } = req.body;
    // Convertimos el valor del dato a un string
    // !IMPORTANTE: Redis no trabaja con objetos por eso lo convertimos a string
    const json = JSON.stringify(data);

    // Utilizamos el comando SET <llave> <valor> para almacenar el valor nuevo en la BD
    client.set(key, json, (err, result) => {
        // Si existe algún error, mostrarlo en consola y enviar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Enviar el resultado de nuestra inserción
        return res.send(result);
    });
});

// Si existe un puerto en la configuracion, la cargamos; de lo contrario se inicia en el puerto 4001
const PORT = process.env.port || 4001;

// Iniciar la API en el puerto que definimos, mostrar en consola que ya esta funcionando.
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });