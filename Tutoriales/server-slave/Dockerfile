# Obtener la imagen que necesitamos
# en este caso, node v.14.x.x
FROM node:14

# Asignar el workdir de la api
WORKDIR /usr/src/app

# Copiar el package-json
COPY package*.json ./

# Correr 'npm install' para instalar todas las dependencias que necesitemos
RUN npm install
# Aca pueden existir muchos mas comandos "run"

# Copiar todos los archivos al workdir
COPY . .

# Exponer el puerto 80 al mundo
EXPOSE 80

# Copiar el volumen de datos de proc a /elements/procs
RUN mkdir -p /elements/procs

# Correr NodeJS
CMD [ "node", "server.js" ]
