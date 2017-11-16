'use strict'

const fs = require('fs');

const http = require('http');
const https = require('https');

const express = require('express')
const { Console } = require('console')
const bodyParser = require('body-parser')

const console = new Console(process.stdout, process.stderr)

var argv = require('minimist')(process.argv.slice(2));

// Constants
const PORT = argv['p'] || 3601 ;
const HOST = argv['h'] || '0.0.0.0';

// App
const app = express()

/**
 * Determines the unit price of a product and account code
 * @param {string} product - The product to use
 * @param {string} accountCode - The account code to use
 * @return {string} - The unit price
 */
function determineUnitPrice(product, accountCode) {
  return (product.length + accountCode.length).toString()
}

/**
 * Verifies a product name
 * @param {string} productName - The product name to verify
 * @return {boolean} - Whether the product name is verified or not
 */
function verifyProductName(productName) {
  return !productName.toLowerCase().startsWith('x')
}

/**
 * Verifies a account code
 * @param {string} accountCode - The account code to verify
 * @return {boolean} - Whether the account code is verified or not
 */
function verifyAccountCode(accountCode) {
  return (accountCode[0]=='S')
}

// Main app
var helmet = require('helmet')

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello world here now\n')
})


// Get unit price from product and account code
app.post('/accounts/:accountCode/unit_price', (req, res) => {
  let products = req.body
  res.status(200).json(products.map((product) => {
    let accountCode = req.params.accountCode
    let verified = verifyProductName(product) && verifyAccountCode(accountCode)
    let unitPrice = verified ? determineUnitPrice(product, accountCode) : 0
    if (verified) {
      return ({ accountCode: accountCode, productName: product, unitPrice: unitPrice, verified: verified })
    } else {
      return({ accountCode: accountCode, productName: product, verified: verified })
    }
  }))
})

const actionHandlerSingleVerify = (field, verifiedField, verifyMethod) => {
  return (req, res) => {
    let product = req.params[field]
    let json = {}
    json[verifiedField] = product
    json['verified'] = verifyMethod(product)
    res.status(200).json(json)
  }
}

const actionHandlerMultipleVerify = (field, singleVerify) => {
  return (req, res) => {
    let catalog = req.body[field]
    let catalogToReturn = {}
    let catalogVerified = true
    catalog.map((item) => {
      let verifiedProductName = singleVerify(item)
      if (!verifiedProductName) {
        catalogVerified = false
      }
      catalogToReturn[item] = verifiedProductName

      return true
    })
    if (catalogVerified) {
      res.status(200).json(catalogToReturn)
    } else {
      res.status(400).json(catalogToReturn)
    }
  }
}


// Verify product name
app.get('/products/:product/verify', actionHandlerSingleVerify('product', 'productName', verifyProductName))

// Verify account code
app.get('/accounts/:accountCode/verify', actionHandlerSingleVerify('accountCode', 'accountCode', verifyAccountCode))

// Verify the catalog of products
app.post('/catalogue/verify', actionHandlerMultipleVerify('products', verifyProductName))

// Verify a list of cost codes
app.post('/accounts/verify', actionHandlerMultipleVerify('accounts', verifyAccountCode))

// Receive events
app.post('/events', (req, res) => {
  let eventName = req.body.eventName;
  let workOrderId = req.body.workOrderId;
  console.log('Received event <'+eventName+'> for work order '+workOrderId);
  res.status(200).end();;
});

var server;

const SSL= (argv['k'] || argv['c']);

if (SSL) {
  const privateKey  = fs.readFileSync(argv['k'], 'utf8');
  const certificate = fs.readFileSync(argv['c'], 'utf8');
  const credentials = {key: privateKey, cert: certificate};
  
  server = https.createServer(credentials, app)
} else {
  server = http.createServer(app)
}

server.listen(PORT, HOST)

console.log(`Running on http://${HOST}:${PORT}`)
