var express = require('express');
var router = express.Router();
var Lego = require("node-lego");


/* GET home page. */
router.get('/', function (req, res) {
    new Lego().start({
        userId: 1
    }).pipe()

});

module.exports = router;
