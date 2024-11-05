FROM node:20.18-alpine
#FROM node:alpine

WORKDIR /app
COPY package.json .
#RUN npm install --omit=dev --force # --loglevel verbose
RUN npm install --omit=dev ## force
COPY . . 

CMD ["npm", "start"]