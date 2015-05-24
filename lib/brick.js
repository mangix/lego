var debug = require("debug")("brick");
var util = require("util");
var log = require("./logger");

//global Name-Brick map
var globals = {};

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
Brick.prototype.bizHandle = function (params, callback) {
    callback(Brick.SUCCESS);
};

/**
 * this is the real handler with timeout control
 * it will be called this function in Lego.pipe
 *
 * */
Brick.prototype.handle = function (params, callback, timeout) {

    this.bizHandle(params, function () {
        clearTimeout(timer);
        callback.apply(this, arguments);
    });

    var timer;
    if (timeout) {
        timer = setTimeout(function () {
            callback(Brick.TIMEOUT);
            //reset the callback , cause the bizHandler is actually executing
            //to prevent callback again
            callback = function () {
            };
        }, timeout);
    }
};


/**
 * Create a Sub Class of Brick
 * @api public
 *
 * @param name
 * @param handle{Function}
 * */
Brick.create = function (name, handle) {
    debug("Brick.create called ,name:" + name + ", handle:" + handle);

    if (typeof  handle !== "function") {
        //handle必须是函数，不然抛异常
        var errorMsg = 'Brick.Create Error, param handle must be a function';
        log('error', errorMsg);
        throw  new Error(errorMsg);
    }

    if (name in globals) {
        //警告一下，只要不在同一个Lego，就不存在冲突
        log('warn', "Brick " + name + " already defined!");
    }

    //inherits Brick
    var SubBrick = function () {
        Brick.call(this);
    };

    util.inherits(SubBrick, Brick);

    //Override bizHandle function
    SubBrick.prototype.bizHandle = handle;

    SubBrick.Name = name;

    globals[name] = SubBrick;
    return  SubBrick;
};


/**
 * Find by name
 * */
Brick.find = function (name) {
    return globals[name];
};


/**
 * Brick handle Status
 * */

Brick.SUCCESS = 1;
Brick.FAIL = 2;
Brick.TIMEOUT = 3;

module.exports = Brick;