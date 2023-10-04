FROM node:14
WORKDIR /app
COPY . .
RUN npm install
RUN ng build --prod
RUN npm start
