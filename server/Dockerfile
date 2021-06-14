# Reference: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:14

# create app directory
WORKDIR /app/focusa

# also persist the values in db and cert
# Reference: https://linuxhint.com/dockerfile_volumes/
VOLUME /app/focusa/db
VOLUME /app/focusa/certs
VOLUME /app/focusa/files

# install app dependencies
COPY package*.json ./

RUN npm i

# Bundle app source
COPY . .

# expose graphql, auth and files respectively...
EXPOSE 1896
EXPOSE 1897
EXPOSE 1901
CMD ["node", "server.js"]