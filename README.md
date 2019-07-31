### A UDD Management Web Application for monitoring, uploading and downloading files with Auth Services enabled

#### Getting started

First of all start the AuthServices application to run the user authentication endpoints.
So, first of all navigate to the AuthServices directory and run the following command:

```
$ node index.js
```
This will expose the AuthServices endpoints to have the tokenised authorization using the JWTs ( Json Web Tokens).

Next, We need to serve the WebApp. So, navigate to the WebApp directory and run the following command:

```
$ ng serve
```
This will host the WebApp on the default port '4200' until a specific port is specified.

#### FileServer App 
It basically provides REST endpoints for Uploading, Downloading and showing the uploaded files:
1. GET https://<IP-ADRESS>:PORT/api/v1/fileserver?manufacturerId=32&deviceType=43&deviceRevision=1&protocol="HART"&fileType=json
2. POST https://<IP-ADDRESS>:PORT/api/v1/fileserver
    BodyFileUpload = 32_43_1_HART.json
    Response : 201 Created
3. GET https://<IP-ADDRESS:PORT/lists