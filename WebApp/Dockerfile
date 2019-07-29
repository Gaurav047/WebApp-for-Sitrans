FROM node:10.16.0-alpine as node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#proxy configuration
RUN npm config set proxy http://194.145.60.1:9400 
RUN npm config set https-proxy http://194.145.60.1:9400


RUN npm install
# If you are building your code for production
#RUN npm install --production

# Bundle app source
COPY . .

ENV PATH ./node_modules/.bin:$PATH

RUN ng build  

# Stage 2
FROM nginx:1.17.0

RUN rm -rf /usr/share/nginx/html/*
COPY --from=node /usr/src/app/Build /usr/share/nginx/html
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]



