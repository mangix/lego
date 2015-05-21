var Brick = require("../../lib/brick");

module.exports = Brick.create("body", function (params, finish) {
    var date = params.date;

    if (!date) {
        finish(Brick.FAIL);
    } else {
        finish(Brick.SUCCESS, {
            year: date.getFullYear(),
            month:date.getMonth()+1,
            date:date.getDate()
        });
    }

});