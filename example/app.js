var http = require("http");
var Lego = require("../lib/lego");
var head = require("./bricks/head");
var body = require("./bricks/body");

http.createServer(function (req, res) {

    new Lego().start({
        date: new Date()
    }).pipe(head, body).done(function (data) {
        res.end(JSON.stringify(data));
    });

}).listen(3000);