const express = require('express');
const app = new express();
const fs = require('fs');

const htmlPlaceholder = `<html>
<head>
<title>SO1 - API DOCKER MODULE</title>
</head>
<body>
<div>
 <h1>SO1</h1>
 <h3>La hora del server es: </h3>
 <h5 style="color: blue">$_timestamp_$</h5>
</div>
</body>
</html>
`;

const getTimestamp = () => (fs.readFileSync('/elements/procs/timestamps', 'utf8')).toString();

app.get('/', (req, res) => {
    const html = htmlPlaceholder.replace('$_timestamp_$', getTimestamp());
    res.send(html);
});

app.get('/test', (req, res) => {
    res.send("SO1 - Laboratorio");
});

app.get('/timestamp', (req, res) => {
    res.send(getTimestamp());
});

app.get('/saveTimestamp', (req, res) => {
    const timestamp = getTimestamp();

    /* 
    logica para guardar datos
    */
});

app.listen(process.env.port || 80);
