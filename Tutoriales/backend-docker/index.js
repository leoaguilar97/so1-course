const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hola, alumnos de SO1 1S2021');
});

app.listen(port, () => {
    console.log(`App escuchando al puerto http://localhost:${port}`);
});