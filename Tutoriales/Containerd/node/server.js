// Estos modulos los instalamos por aparte
const express = require('express'); // npm i express

// INICIAMOS CON LA API
const app = new express(); // Creamos una instancia de express para manejar nuestra API

// IMPORTANTE! Le decimos a express que necesitamos trabajar con intercambio de datos JSON
app.use(express.json({ extended: true }))

// Listado de status HTTP a devolver
const status = [200, 201, 400, 404, 403, 500];

// Unico método para devolver un estado HTTP random
app.get('/', (_req, res) => {
    const current_status_index = Math.floor((Math.random() * 10)) % status.length;
    const current_status = status[current_status_index];
    console.log("> Petición realizada, devolviendo HTTP " + current_status);
    return res.sendStatus(current_status);
});

// Si existe un puerto en la configuracion, la cargamos; de lo contrario se inicia en el puerto 4001
const PORT = process.env.port || 3000;

// Iniciar la API en el puerto que definimos, mostrar en consola que ya esta funcionando.
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });

const MAX_SECONDS_ALIVE = 25 * 1000;

let seconds_alive = 0;
const intervalId = setInterval(() => {
    console.log(`Finalizando API en ${MAX_SECONDS_ALIVE / 1000 - ++seconds_alive} segundos.`);
}, 1000);

setTimeout(() => {
    clearInterval(intervalId);
    process.exit(0);
}, MAX_SECONDS_ALIVE);
