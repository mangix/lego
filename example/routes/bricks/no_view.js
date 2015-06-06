var Brick = require("node-lego").Brick;

module.exports = Brick.create("BrickWithoutView", function (params, finish) {
    var user = params.User;

    if (user) {
        finish(Brick.SUCCESS, {
            welcome: 'hi ' + user.userName
        });
    } else {
        finish(Brick.FAIL);
    }
});