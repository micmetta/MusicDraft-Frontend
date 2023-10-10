#FROM node:14
#WORKDIR /app
#COPY . .
#RUN npm install
#COPY ./dist /app/dist
#EXPOSE 4200
#CMD ["npm", "start"]


# - NON ABBIAMO CONTENERIZZATO IL FRONTEND..
## Stage 1: Build l'app Angular
#FROM node:14 as build
#WORKDIR /app
#COPY package.json package-lock.json ./
#RUN npm install
#COPY . .
#RUN npm run build
