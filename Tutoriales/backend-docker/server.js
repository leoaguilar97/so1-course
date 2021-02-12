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
 <h1>SO1</h1>
 <h3>La hora del server es: </h3>
 <h5 style="color: blue">$_timestamp_$</h5>
</div>
</body>
</html>
`;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const TimeStamp = mongoose.model('Timestamp', { timestamp: String });
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

app.get('/saveTimestamp', async (req, res) => {
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

app.get('/getAll', async (req, res) => {
    try {
        const all = await TimeStamp.find({});
        res.send(all);
    }
    catch (error) {
        res.send(error.message).statusCode(500);
    }
});

const PORT = process.env.port || 80
app.listen(PORT, () => { console.log(`API lista en -> http://localhost:${PORT}`) });
