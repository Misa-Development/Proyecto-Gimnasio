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

# Expone el puerto en el que tu aplicación estará corriendo
EXPOSE 3000

# Define el comando para ejecutar tu aplicación
CMD ["node", "app.js"]
