// npm i kafkajs
const { Kafka } = require('kafkajs');

// npm i faker
const faker = require('faker');

// Creamos un nuevo cliente de Kafka, Kafka siempre corre enm el puerto 9092
const kafka = new Kafka({
    clientId: 'kafka-client', //le definimos un ID arbitrario a nuestro cliente
    brokers: ['127.0.0.1:9092']
});

// Creamos un nuevo productor
const producer = kafka.producer()

// Esta funcion nos devuelve los datos de una persona
const crearPersona = () => ({
    genero: faker.music.genre(),
    nombre: faker.name.firstName()
});

// Funcion para enviar un mensaje
const enviarMensaje = async () => {
    // Realizamos esto para conectarnos desde nuestro producer
    await producer.connect();

    // Creamos una nueva informacion de la persona
    const nueva_persona = crearPersona();

    console.log('Enviando datos de persona: ');
    console.table(nueva_persona);

    // Enviamos la información al tópico "topic1"
    await producer.send({
        topic: process.env.TOPIC || 'sopes1',
        // acá mandamos una lista de mensajes, en este caso únicamente enviaremos uno
        messages: [{ value: `json:${JSON.stringify(nueva_persona)}` }]
    })

    console.log('Datos enviados exitosamente...');
};

// Definimos que llamaremos a la función cada 5 segundos
setInterval(() => {
    try {
        enviarMensaje();
    }
    catch (e) {
        console.error(e);
    }
}, 5000);