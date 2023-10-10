#### STAGE 1: Build ###
#FROM node:14 AS build
#WORKDIR /app
#COPY package.json ./
#RUN npm install
#COPY . .
#RUN npm build
#CMD ["node", "update-proxy-config.js"]

## stage 1 (funziona Pietro)
#FROM node:14
#WORKDIR /app
#COPY . .
#RUN npm install
#COPY ./dist /app/dist
#EXPOSE 4200
#CMD ["npm", "start"]


## stage 1
#FROM node:14 as build
#WORKDIR /app
#COPY package.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#
## stage 2
## Esegui il comando principale del tuo contenitore
##CMD ["node", "update-proxy-config.js"]
#
## Stage 2: Serve
#FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/nginx.conf
#COPY --from=build /app/dist/frontend /usr/share/nginx/html
#EXPOSE 80
##CMD ["node", "update-proxy-config.js"]
##CMD ["nginx", "-g", "daemon off;"]
##CMD ["npm", "run", "start"]
#
##FROM nginx:alpine
##COPY --from=node /app/dist/frontend /usr/share/ngix/html
###CMD ["npm", "start"]


# NON ABBIAMO DOCKERIZZATO IL FRONTEND.. (c'erano problemi durante la dockerizzazione..)
#FROM node:14 as builder
#WORKDIR /app
#COPY package.json package-lock.json ./
#RUN npm install
#COPY . .
#RUN npm build
#
#
#FROM nginx:1.17.1-alpine
#COPY nginx.conf /etc/nginx/nginx.conf
##COPY /dist/frontend /usr/share/nginx/html
#COPY --from=builder /dist/frontend /usr/share/nginx/html
#CMD ["npm", "start"]
