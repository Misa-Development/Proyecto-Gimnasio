# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de tu aplicación
COPY . .

# Añade wait-for-it
RUN curl -o /app/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Expone el puerto en el que tu aplicación estará corriendo
EXPOSE 3000

# Define el comando para ejecutar tu aplicación
CMD ["/app/wait-for-it.sh", "mongo:27017", "--", "node", "app.js"]
