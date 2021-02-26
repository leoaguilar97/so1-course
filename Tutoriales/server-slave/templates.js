/*
ESTE ARCHIVO PUEDES IGNORARLO TRANQUILAMENTE

Es unicamente para configuracion de las primeras fases del tutorial, y sera reemplazado por un frontend completo.

- Leo
*/

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

const htmlListItem = `<li style='font-size: 18px'>Timestamp: <strong style='color: green; font-weight: bold'>$_li_$</strong></li>`;

const createListItem = (timestamp) => htmlListItem.replace('$_li_$', timestamp);
const getHtml = (innerBody) => htmlPlaceholder.replace('$_body_$', innerBody);

const getTimestampList = (timestamp_list) =>
    timestamp_list.reduce((prev, curr) => `${prev} ${createListItem(`${curr.timestamp} - ${curr.name}: ${curr.msg}`)}`, "");

const getHtmlList = (timestamp_array) => getHtml(getTimestampList(timestamp_array));

module.exports = { getHtmlList };