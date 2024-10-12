FROM node:20-alpine

WORKDIR /app

COPY package* .
RUN npm install

COPY database ./database
RUN cd ./database && npx prisma generate

COPY . .

EXPOSE 3001

ENTRYPOINT ["npm", "run", "dev"]