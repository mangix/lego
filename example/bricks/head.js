var Brick = require("../../lib/brick");

module.exports = Brick.create("head", function (params, finish) {
    var date = params.date;

    if (!date) {
        finish(Brick.FAIL);
    } else {
        finish(Brick.SUCCESS, {
            title: "Today is " + date
        });
    }

});