var winston = require("winston");
var debug = require("debug")("brick");
var util = require("util");

/**
 * A brick is a `Single` Module that provides data
 * lego combines bricks to build a response
 *
 * */

var Brick = function () {
    debug("new Brick");
};

/**
 * this is an abstract function
 *
 * override in Sub Class to handle biz logic
 *
 * call the callback function with status(Brick.SUCCESS,Brick.FAIL) and data
 *
 * */
Brick.prototype.handle = function (params, callback) {
};

/**
 * Create a Sub Class of Brick
 * @api public
 *
 * @param name
 * @param handle{Function}
 * */
exports.create = function (name, handle) {
    debug("Brick.create called , handle:" + handle);

    if (typeof  handle !== "function") {
        var errorMsg = 'Brick.Create Error, param handle must be a function';
        winston.error(errorMsg);
        throw  new Error(errorMsg);
    }

    //inherits Brick
    var SubBrick = function () {
        Brick.call(this);
    };

    SubBrick.name = name;

    util.inherits(Brick, SubBrick);

    //Override handle function
    SubBrick.prototype.handle = handle;

    return  SubBrick;
};


/**
 * Brick handle Status
 * */

Brick.SUCCESS = 1;
Brick.FAIL = 2;

module.exports = Brick;