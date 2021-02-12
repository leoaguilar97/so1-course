const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();

const app = new express();
const fs = require('fs');

const htmlPlaceholder = `<html>
<head>
<title>SO1 - API DOCKER MODULE</title>
</head>
<body>
<div>
$_body_$
</div>
</body>
</html>
`;

const htmlGetOne = `
 <h1>Hora del server</h1>
 <h2 style="color: blue">$_timestamp_$</h2>
`;

const htmlGetAll = `
<h1>Horas guardadas en MongoDB</h1>
<ol>
$_items_$
</ol>
`;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const TimeStamp = mongoose.model('Timestamp', { timestamp: String });
const getTimestamp = () => (fs.readFileSync('/elements/procs/timestamps', 'utf8')).toString();
const getHtml = (innerBody) => htmlPlaceholder.replace('$_body_$', innerBody);

app.get('/one', (req, res) => {
    res.send(getTimestamp());
});

app.get('/save', async (req, res) => {
    const timestamp = getTimestamp();

    const newTimestamp = new TimeStamp({ timestamp });
    try {
        await newTimestamp.save();
        res.send('Timestamp agregado correctamente: ' + timestamp);
    }
    catch (error) {
        res.send(error.message).statusCode(500);
    }
});

app.get('/', async (req, res) => {
    try {
        const all = await TimeStamp.find({});

        const list_items = all.reduce((prev, curr) => `${prev}<li style='font-size: 18px'>Timestamp: <strong style='color: green; font-weight: bold'>${curr.timestamp}</strong></li>`, "");
        const innerBody = htmlGetAll.replace('$_items_$', list_items);

        res.send(getHtml(innerBody));
    }
    catch (error) {
        res.send(error.message).statusCode(500);
    }
});

app.get('/current', (req, res) => {
    const innerBody = htmlGetOne.replace('$_timestamp_$', getTimestamp());
    res.send(getHtml(innerBody));
});

const PORT = process.env.port || 80
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });
