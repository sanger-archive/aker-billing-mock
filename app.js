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
  return productName.length > 10
}

/**
 * Verifies a account code
 * @param {string} accountCode - The account code to verify
 * @return {boolean} - Whether the account code is verified or not
 */
function verifyAccountCode(accountCode) {
  return accountCode.length > 10
}

// Main app
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Aker - Billing façade mock\n')
})

// Verify product name
app.get('/products/:product/verify', (req, res) => {
  const { product } = req.params
  res.status(200).json({ productName: product, verified: verifyProductName(product) })
})

// Verify account code
app.get('/accounts/:accountCode/verify', (req, res) => {
  const { accountCode } = req.params
  res.status(200).json({ accountCode, verified: verifyAccountCode(accountCode) })
})

// Get unit price from product and account code
app.get('/products/:product/accounts/:accountCode/unit_price', (req, res) => {
  const { product } = req.params
  const { accountCode } = req.params
  const verified = verifyProductName(product) && verifyAccountCode(accountCode)
  const unitPrice = verified ? determineUnitPrice(product, accountCode) : 0
  if (verified) {
    res.status(200).json({
      accountCode,
      productName: product,
      unitPrice,
      verified,
    })
  } else {
    res.status(200).json({
      accountCode,
      productName: product,
      verified,
    })
  }
})

// Verify the catalog of products
app.post('/catalog/verify', (req, res) => {
  const catalog = req.body.products
  const catalogToReturn = {}
  let catalogVerified = true
  catalog.map((item) => {
    const verifiedProductName = verifyProductName(item)
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
