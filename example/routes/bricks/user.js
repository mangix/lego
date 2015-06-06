var Brick = require("node-lego").Brick;

//Brick Without view
module.exports = Brick.create("User", function (params, finish) {
    var userId = params.userId;

    getUserFromDB(userId, function (err, user) {
        if (err) {
            finish(Brick.FAIL);
        } else {
            finish(Brick.SUCCESS, user);
        }
    });

});


var getUserFromDB = function (userId, cb) {

    setTimeout(function () {
        cb(null, {
            userId: userId,
            userName: "mangix",
            email: ""
        });
    }, 100);
};