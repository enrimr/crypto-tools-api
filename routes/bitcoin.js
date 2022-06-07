var express = require('express')
var router = express.Router()

var bitcoinMessage = require('bitcoinjs-message')

/* GET users listing. */
router.get('/sign', function(req, res, next) {
  res.send('respond with a resource sign')
});

/* GET users listing. */
router.get('/verify', function(req, res, next) {
    const message = req.query.message
    const address = req.query.address
    const signature = req.query.signature
    if (message === undefined) {
        let error = new Error();
        error.message = "Message parameter is missing"
        error.name = "MISSING_ARGUMENT"
        error.code = 1000101
        throw error
    }
    if (address === undefined) {
        let error = new Error();
        error.message = "Address parameter is missing"
        error.name = "MISSING_ARGUMENT"
        error.code = 1000102
        throw error
    }
    if (signature === undefined) {
        let error = new Error();
        error.message = "Signature parameter is missing"
        error.name = "MISSING_ARGUMENT"
        error.code = 1000103
        throw error
    }
    console.log(message)
    console.log(address)
    console.log(signature)
    const isVerified = bitcoinMessage.verify(message, address, signature)
    res.send({'status': isVerified})
    
  });

module.exports = router
