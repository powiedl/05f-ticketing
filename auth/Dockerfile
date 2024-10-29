FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install || true # workaround for https://github.com/npm/npm/issues/9863
COPY . . 

CMD ["npm", "start"]