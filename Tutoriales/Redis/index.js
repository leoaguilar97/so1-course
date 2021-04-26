/*
    Universidad de San Carlos de Guatemala
    Ingeniería en Ciencias y Sistemas
    Sistemas Operativos 1
    Clase 11: Kubernetes Controllers y REDIS
    Ejemplo de conexión y utilización de REDIS y Redis PubSub

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
    host: 'localhost',
    port: 6379,
    auth_pass: ""
});
// Para conectarse con los valores por defecto no hace falta enviar este objeto
// Por lo tanto podríamos haberlo hecho así:

// const client = redis.createClien();

// Si existe un error conectándose a Redis, mostrarlo en consola
client.on('error', (err) => { console.error(err); });

// Publisher para ser utilizado con el servicio PubSub
const pub = redis.createClient();
// Subscriber para ser utilizado con el servicio PubSUb
const sub = redis.createClient();

// Obtener todas las llaves que hay hasta el momento
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

// Obtener el valor de una llave específica de REDIS
/*
    Para obtener el valor de "llave1" por ejemplo,
    hacemos un GET a /key/llave1

    Si el valor no existe retornará un 404 NOT FOUND
    Si el valor existe retornará un 200 OK y el valor
    y si existió un error 500 Internal Server Error
*/
app.get('/key/:key', (req, res) => {

    // Obtener la llave que queremos de los parámetros
    const { key } = req.params;

    // Utilizamos el comando GET para obtener el valor de la llave
    client.get(key, function (err, value) {
        // Si existió un error mostrarlo en consola y enviar 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        // Si REDIS retornó un valor vacío significa que la llave no fue encontrada
        // por lo tanto enviar el estado 404 NOT FOUND
        if (!value) {
            return res.sendStatus(404);
        }

        // Parsear el valor devuelto a JSON
        const obj = JSON.parse(value);

        // Enviar el valor encontrado en formato JSON
        return res.send(obj);
    });
});

// Agregar un nuevo valor a REDIS
/*
    Recordemos que REDIS es un sistema Clave-Valor.

    Para agregar un nuevo valor enviamos en el body:

    {
        "key": "llave1",
        "data": "valor1"
    }

    en este caso, en REDIS existirá una nueva llave llamada llave1 con un valor "valor1".
*/
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

/* Agregar a una lista un valor
 en este caso la lista llegará con el nombre "db" y el valor con el nombre "data"
 Por ejemplo, para almacenar un valor en una lista llamada "lista1", enviar en el body: 
    {
        "db": "lista1",
        "data": "elemento1"
    }
*/
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

// Esta variable servirá para guardar todos los mensajes que se publiquen y que NO ESTÉN LEÍDOS
let messages = [];

// Este evento se disparará cada vez que el sub encuentre que existe un mensaje
sub.on("message", (channel, message) => {
    // Agregar a la lista de mensajes el mensaje que se acaba de leer
    messages.push(`${channel} > ${message}`);
});

// Suscribir al sub al canal de mensajes
sub.subscribe("canal");

// Enviar un nuevo mensaje
//  Este se lee desde el valor "message" en el body
app.post('/messages', (req, res) => {
    // publicar el mensaje en nuestro canal,
    // se obtiene desde el body
    pub.publish("canal", req.body.message, (err, result) => {
        // si existio un error publicando el mensaje
        // mostrar un error y enviar un estado 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        // Si todo estuvo en orden, enviar la cantidad de mensajes que hay actualmente para ser leídos
        return res.send({ count: messages.length });
    });
});

// Obtener todos los mensajes que han sido enviados hasta el momento
app.get('/messages', (req, res) => {
    // Guardar los mensajes anteriores temporalmente
    const old_messages = messages;
    // Limpiar los mensajes que se habian guardado hasta ese punto
    messages = [];

    // Enviar de vuelta los mensajes nuevos
    return res.send({ messages: old_messages });
});

// Si existe un puerto en la configuracion, la cargamos; de lo contrario se inicia en el puerto 4001
const PORT = process.env.port || 4001;

// Iniciar la API en el puerto que definimos, mostrar en consola que ya esta funcionando.
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });



