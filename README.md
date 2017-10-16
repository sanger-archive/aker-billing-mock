# Aker - billing facade mock
A mock service between Aker and Agresso. Written in JavaScript using [express](https://expressjs.com/).

Usage:

To start a HTTP server in a specific network address and port:

node app.js -h <host> -p <port>

To start a HTTPS server, we need to provide the paths to the private key and certificate:

node app.js -k <keyfile> -c <certificate> -h <host> -p <port>

# Getting up and running
* Clone the repo
* Confirm that you have node and npm installed
* Install the required node packages using `npm install` within the cloned repo
* Start the server using `node app.js`
* For hot-reloading (automatically restart the app if source change), use
[nodemon](https://github.com/remy/nodemon/) and run `nodemon app.js`

# Todo
* Add custom port and host to start app (might not be required)

# Helpful docs
* https://expressjs.com/en/guide/routing.html

# Misc.
## Node packages used
* [nodemon](https://github.com/remy/nodemon/) - `npm install --global nodemon`
* [express](https://expressjs.com/)
