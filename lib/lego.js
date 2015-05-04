//global registered bricks
var bricks = {};

exports.register = function (name, brick) {
    if (name in bricks) {
        return false;
    }
    bricks[name] = brick;
    return true;
};