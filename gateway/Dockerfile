# Archivo: gateway/Dockerfile
FROM node:18

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# El gateway corre internamente en el 3000
EXPOSE 3000

CMD ["npm", "start"]