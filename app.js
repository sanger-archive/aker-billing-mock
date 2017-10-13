'use strict'

const express = require('express')
const { Console } = require('console')
const bodyParser = require('body-parser')

const console = new Console(process.stdout, process.stderr)

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

// App
const app = express()

/**
 * Determines the unit price of a product and account code
 * @param {string} product - The product to use
 * @param {string} accountCode - The account code to use
 * @return {string} - The unit price
 */
function determineUnitPrice(product, accountCode) {
  return product.length + accountCode.length
}

/**
 * Verifies a product name
 * @param {string} productName - The product name to verify
 * @return {boolean} - Whether the product name is verified or not
 */
function verifyProductName(productName) {
  return productName.length > 10 ? true : false
}

/**
 * Verifies a account code
 * @param {string} accountCode - The account code to verify
 * @return {boolean} - Whether the account code is verified or not
 */
function verifyAccountCode(accountCode) {
  return accountCode.length > 10 ? true : false
}

// Main app
var helmet = require('helmet')

app.use(bodyParser.json())
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello world here now\n')
})

// Verify product name
app.get('/products/:product/verify', (req, res) => {
  let product = req.params.product
  res.status(200).json({ productName: product, verified: verifyProductName(product) })
})

// Verify account code
app.get('/accounts/:accountCode/verify', (req, res) => {
  let accountCode = req.params.accountCode
  res.status(200).json({ accountCode: accountCode, verified: verifyAccountCode(accountCode) })
})

// Get unit price from product and account code
app.get('/products/:product/accounts/:accountCode/unit_price', (req, res) => {
  let product = req.params.product
  let accountCode = req.params.accountCode
  let verified = verifyProductName(product) && verifyAccountCode(accountCode) ? true : false
  let unitPrice = verified ? determineUnitPrice(product, accountCode) : 0
  if (verified) {
    res.status(200).json({ accountCode: accountCode, productName: product, unitPrice: unitPrice, verified: verified })
  } else {
    res.status(200).json({ accountCode: accountCode, productName: product, verified: verified })
  }
})

// Verify the catalog of products
app.post('/catalog/verify', (req, res) => {
  let catalog = req.body.products
  let catalogToReturn = {}
  let catalogVerified = true
  catalog.map((item) => {
    let verifiedProductName = verifyProductName(item)
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

})


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
