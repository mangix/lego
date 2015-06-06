var express = require('express');
var router = express.Router();
var Lego = require("node-lego");
var User = require("./bricks/user");
var NoView = require("./bricks/no_view");
var Timeout = require("./bricks/timeout");

/* GET home page. */
router.get('/', function (req, res) {
    new Lego({
        timeout: 200
    })
        .start({
            userId: 1
        })
        .pipe(User)
        .pipe(NoView, Timeout).done(function (data) {
            console.log("This is the final data ", data);
            res.render("index", data);

        });

});

module.exports = router;
