var Brick = require("node-lego").Brick;

module.exports = Brick.create("TimeoutBrick", function (params, finish) {
    setTimeout(function () {
        finish(Brick.SUCCESS, {
            echo: "Yes! I'm not timeout"
        });
    }, 500);

}, "/timeout.jade");