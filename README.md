# Aker - Billing façade mock
A mock service between Aker and Agresso. Written in JavaScript using
[express](https://expressjs.com/).

## Getting up and running
* Clone the repo
* Confirm that you have node and npm installed
* Install the required node packages using `npm install` within the cloned repo
* Start the server using `node app.js`
* For hot-reloading (automatically restart the app if source change), use
[nodemon](https://github.com/remy/nodemon/) and run `nodemon app.js`

## Usage

To start a HTTP server in a specific network address and port:

`node app.js -h <host> -p <port>`

To start a HTTPS server, we need to provide the paths to the private key and certificate:

`node app.js -k <keyfile> -c <certificate> -h <host> -p <port>`

## Misc.
### Node packages used
* [nodemon](https://github.com/remy/nodemon/) - `npm install --global nodemon`
* [express](https://expressjs.com/)

### Helpful docs
* https://expressjs.com/en/guide/routing.html

### Docker
* To build the image, run: `docker build -t aker-billing-facade-mock .`
* To run the image: `docker run -ti -p 8080:8080 aker-billing-facade-mock`
