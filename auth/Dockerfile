#FROM node:22.11-alpine
FROM node:alpine

WORKDIR /app
COPY package.json .
#RUN npm install  --force # --loglevel verbose
RUN npm install  --force --omit=dev
COPY . . 

CMD ["npm", "start"]