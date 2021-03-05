
// Importar la libreria de Google PubSub
// Para instalar, utilizamos npm install --save @google-cloud/pubsub
// Generalmente esto lo hacemos en un fronted!
const { PubSub } = require('@google-cloud/pubsub');

// Acá escribimos la suscripción que creamos en Google Pub/Sub
const SUB_NAME = 'projects/sopes1-auxiliatura/subscriptions/twitterLite-sub';

// Cantidad de segundos que estara prendido nuestro listener
// Solo para efectos practicos, realmente esto debería estar escuchando en todo momento!
const TIMEOUT = 180;

// Crear un nuevo cliente de pubsub
const client = new PubSub();

// En este array guardaremos nuestros datos
const messages = [];

// Esta funcion se utilizara para leer un mensaje
// Se activara cuando se dispare el evento "message" del subscriber
const messageReader = message => {

    console.log('¡Mensaje recibido!');
    console.log(`${message.id} - ${message.data}`);
    console.table(message.attributes);

    messages.push(message);

    // Con esto marcamos el acknowledgement de que recibimos el mensaje
    // Si no marcamos esto, los mensajes se nos seguirán enviando aunque ya los hayamos leído!
    message.ack();
};

// Empezamos nuestro manejador de notificaciones
const notificationListener = () => {

    // Creamos un subscriptor
    // Pasamos el nombre de nuestro subscriptor (que encontramos en Google Cloud)
    const sub = client.subscription(SUB_NAME);

    // Guardar la cantidad de mensajes que fueron enviados
    const previous_count = messages.length;

    // 

    // Conectar el evento "message" al lector de mensajes
    sub.on('message', messageReader);

    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`Se recibieron ${messageCount} mensajes.`);
    }, TIMEOUT * 1000);
};

notificationListener();