FROM node:14
WORKDIR /app
COPY . .
RUN npm install
COPY ./dist /app/dist
EXPOSE 4200
CMD ["npm", "start"]
