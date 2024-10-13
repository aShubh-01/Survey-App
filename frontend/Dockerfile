FROM node:20-alpine

WORKDIR /app

COPY package* .
RUN npm install

COPY . .

EXPOSE 5173

ENTRYPOINT ["npm", "run", "dev"]