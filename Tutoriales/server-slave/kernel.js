
const fs = require('fs'); // Este modulo viene cargado directamente en nodejs, sirve para trabajar con archivos

// Aca es donde se lee el modulo kernel que cargamos!
const getTimestamp = () => (fs.readFileSync('/elements/procs/timestamps', 'utf8')).toString(); // Este metodo va a leer la carpeta /proc/timestamps y convierte sus datos a un string.

// Este metodo sirve para devolver la informacion que hay en el modulo
// En caso la lectura no pueda ser efectuada, devolvemos un error!
// Esto es util ya que el server entocnces no se caera cada vez que requiramos la lectura y no tengamos bien el modulo
const safeGetTimestamp = () => {
    // Intentamos hacer la lectura del archivo /proc/timestamps
    try {
        // Si todo es correcto, lo devolveremos
        return getTimestamp();
    }
    // Deconstruimos el objeto error en el catch, y obtenemos unicamente su valor
    catch ({ message }) {
        // En dado caso haya un error, devolveremos el error.
        return `No se pudo leer el modulo. ${message}`;
    }
}

// Exportamos el metodo que queremos utilizar, en este caso le renombramos a getTimestamp
module.exports = { getTimestamp: safeGetTimestamp };