# Aker - Billing facade mock
A mock service between Aker and Agresso. Written in JavaScript using
[express](https://expressjs.com/).

# Getting up and running
* Clone the repo
* Confirm that you have `node` and `npm` installed
* Install the required node packages using `npm install` within the cloned repo
* Start the server using `node app.js`
* For hot-reloading (automatically restart the app if source changes), use
[nodemon](https://github.com/remy/nodemon/) and run `nodemon app.js`

# Todo
* Add custom port and host to start app (might not be required)

# Helpful docs
* https://expressjs.com/en/guide/routing.html

# Misc.
## Node packages used
* [nodemon](https://github.com/remy/nodemon/) - `npm install --global nodemon`
* [express](https://expressjs.com/)

## Docker
* To build the image, run: `docker build -t aker-billing-facade-mock .`
* To run the image: `docker run -ti -p 8080:8080 aker-billing-facade-mock`
