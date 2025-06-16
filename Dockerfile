FROM node:24.0

COPY . .

RUN npm i

RUN chmod -R 755 node_modules

CMD ["npm", "run", "start:prod"]
