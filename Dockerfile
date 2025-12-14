# Usamos Node:18
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json
COPY ./src/package*.json ./

# Instalamos librerias
RUN npm install

# Copiamos todo el código fuente de la carpeta src
COPY ./src/ .

# Puerto de la aplicación
EXPOSE 3000

# Comando para iniciar
CMD ["node", "index.js"]