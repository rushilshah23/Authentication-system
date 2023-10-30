FROM node:18.15.0-alpine
COPY package.json /app/
COPY build /app/
WORKDIR /app
RUN npm install

CMD ["node","app.js"]
