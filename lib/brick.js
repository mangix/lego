var debug = require("debug")("brick");
var util = require("util");
var log = require("./logger");
var settings = require("./setting");
var cons = require("consolidate");

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
 * call the finish function with status(Brick.SUCCESS,Brick.FAIL) and data
 *
 * */
Brick.prototype.bizHandle = function (params, finish) {
    finish(Brick.SUCCESS);
};

/**
 * this is the real handler with timeout control
 * it will be called this function in Lego.pipe
 *
 * */
Brick.prototype.handle = function (params, finish, timeout) {
    var view = this.constructor.View;

    this.bizHandle(params, function (status, data) {
        clearTimeout(timer);
        if (status == Brick.SUCCESS && view) {
            //render view
            cons[settings.get("view engine")](view, data, function (err, html) {
                if (err) {
                    //TODO log

                    finish(status, data, "");
                } else {
                    finish(status, data, html);
                }
            });
        } else {
            finish(status, data);
        }
    });

    var timer;
    if (timeout) {
        timer = setTimeout(function () {
            finish(Brick.TIMEOUT);
            //reset the callback , cause the bizHandler is actually executing
            //to prevent callback again
            finish = function () {
            };
        }, timeout);
    }
};


/**
 * Create a Sub Class of Brick
 * @api public
 *
 * @param name {String}     , name of the brick
 * @param handle {Function} , handler function
 * @param viewPath {String} , file of the view
 * */
Brick.create = function (name, handle, viewPath) {
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
    SubBrick.prototype.constructor = SubBrick;

    SubBrick.Name = name;
    SubBrick.View = viewPath ? settings.viewPath(viewPath) : null;

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