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

