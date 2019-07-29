FROM node:10.16.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#proxy configuration
RUN npm config set proxy http://194.145.60.1:9400
RUN npm config set https-proxy http://194.145.60.1:9400 


#RUN npm install
# If you are building your code for production
RUN npm install --production

# Bundle app source
COPY . .

CMD node index.js
EXPOSE 5005
