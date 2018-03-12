const bodyParser = require('body-parser')
const { Console } = require('console')
const express = require('express')
const fs = require('fs')
const helmet = require('helmet')
const http = require('http')
const https = require('https')

const console = new Console(process.stdout, process.stderr)

const argv = require('minimist')(process.argv.slice(2))

// Constants
const PORT = argv.p || 3601
const HOST = argv.h || '0.0.0.0'
const SSL = (argv.k || argv.c)
let server

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

function determineModulePrice(module, accountCode) {
  return (module.length + accountCode.length).toString()
}


/**
 * Verifies a process module - currently only IDs starting with an even number are valid
 * @param {int} moduleId - The module ID to verify
 * @return {boolean} - Whether the module id is verified or not
 */
function verifyModuleId(moduleId) {
  const moduleIdPattern = /^[02468]{1}\d*$/
  return (moduleIdPattern.test(moduleId.trim()))
}

/**
 * Verifies a process module - currently only names starting with 'x' are invalid
 * @param {string} moduleName - The module name to verify
 * @return {boolean} - Whether the module name is verified or not
 */
function verifyModuleName(moduleName) {
  const moduleNamePattern = /^(?!x).*$/
  return (moduleNamePattern.test(moduleName.trim()))
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
 * Verifies an account code
 * @param {string} accountCode - The account code to verify
 * @return {boolean} - Whether the account code is verified or not
 */
function verifyAccountCode(accountCode) {
  const accountCodePattern = /^s\d{4}$/i
  return (accountCodePattern.test(accountCode.trim()))
}

/**
 * Verifies a sub- cost code (account code)
 * @param {string} subAccountCode - The sub- account code to verify
 * @return {boolean} - Whether the account code is verified or not
 */
function verifySubAccountCode(subAccountCode) {
  const subAccountCodePattern = /^s\d{4}-(\d)?[02468]$/i
  return (subAccountCodePattern.test(subAccountCode.trim()))
}

// Main app
app.use(bodyParser.json())
// Help secure Express apps with various HTTP headers
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Aker - Billing façade mock\n')
})

// Get unit price from product and subproject account code
app.post('/accounts/:accountCode/unit_price', (req, res) => {
  console.log(req.body)
  const products = req.body

  res.status(200).json(products.map((product) => {
    const { accountCode } = req.params
    const verified = verifyProductName(product) && verifySubAccountCode(accountCode)
    const unitPrice = verified ? determineUnitPrice(product, accountCode) : 0

    if (verified) {
      return {
        accountCode, productName: product, unitPrice, verified,
      }
    }

    return { accountCode, productName: product, verified }
  }))
})

const actionHandlerSingleVerify = (field, verifiedField, verifyMethod) => {
  return (req, res) => {
    const fieldToVerify = req.params[field]
    const json = {}
    json[verifiedField] = fieldToVerify
    json.verified = verifyMethod(fieldToVerify)
    res.status(200).json(json)
  }
}

const actionHandlerMultipleVerify = (field, singleVerify) => {
  return (req, res) => {
    const catalog = req.body[field]
    const catalogToReturn = {}
    let catalogVerified = true
    catalog.map((item) => {
      const verifiedProductName = singleVerify(item)
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

const get_price_for_module = () => {
  return (req, res) => {
    const module = req.body['module']
    const cost_code = req.body['cost_code']

    let errors = []
    if (!verifyModuleName(module)) {
      errors.push('Module name not valid')
    }
    if (!((verifySubAccountCode(cost_code) || verifyAccountCode(cost_code)))) {
      errors.push('Project not valid') 
    }

    if (errors.length === 0) {
      res.status(200).json({ module, cost_code, price: determineModulePrice(module, cost_code) })
    } else {
      res.status(400).json({ errors })
    }
  }
}


// Verify module ID
app.get(
  '/modules/:module/verifyId',
  actionHandlerSingleVerify('module', 'moduleId', verifyModuleId)
)

// Verify module name
app.get(
  '/modules/:module/verifyName',
  actionHandlerSingleVerify('module', 'moduleName', verifyModuleName)
)

// Verify account code
app.get(
  '/accounts/:accountCode/verify',
  actionHandlerSingleVerify('accountCode', 'accountCode', verifyAccountCode)
)

// Verify sub- cost code (account code)
app.get(
  '/subaccountcodes/:subAccountCode/verify',
  actionHandlerSingleVerify('subAccountCode', 'subAccountCode', verifySubAccountCode)
)

// Verify product name
app.get(
  '/products/:product/verify',
  actionHandlerSingleVerify('product', 'productName', verifyProductName)
)

// Verify a list of modules
app.post('/modules/verify', actionHandlerMultipleVerify('modules', verifyModuleId))

// Verify a list of cost codes
app.post('/accounts/verify', actionHandlerMultipleVerify('accounts', verifyAccountCode))

// Returns a price for a product and module with a cost code
app.post('/price_for_module', get_price_for_module())

// Receive events
app.post('/events', (req, res) => {
  const { eventName } = req.body
  const { workOrderId } = req.body

  console.log(`Received event <${eventName}> for work order ${workOrderId}`)

  res.status(200).end()
})

// Get a list of sub- cost codes (account codes) for a cost code (account code)
app.get('/accounts/:accountCode/subaccountcodes', (req, res) => {
  const { accountCode } = req.params
  const numOfSubs = Math.ceil(Math.random() * 10)
  const subCostCodes = []
  for (let i = 0; i < numOfSubs; i += 1) {
    subCostCodes.push(`${accountCode}-${i}`)
  }
  res.status(200).json({ subCostCodes })
})

if (SSL) {
  const privateKey = fs.readFileSync(argv.k, 'utf8')
  const certificate = fs.readFileSync(argv.c, 'utf8')
  const credentials = { key: privateKey, cert: certificate }

  server = https.createServer(credentials, app)
} else {
  server = http.createServer(app)
}

server.listen(PORT, HOST)

console.log(`Running on ${SSL ? 'https' : 'http'}://${HOST}:${PORT}`)

module.exports = server;
