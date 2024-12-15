# Usa la imagen base de Node.js
FROM node:20-alpine

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Inicia la aplicación
CMD ["node", "server.js"]
