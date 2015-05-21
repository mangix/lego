var async = require("async");
var winston = require("winston");
var debug = require("debug")("lego");
var Brick = require("./brick");
var _ = require("underscore");
var domain = require("domain");

var Lego = function (options) {
    //each time pipe calls , add an item
    this._chain = [];

    //start params
    this.params = {};

    //options
    this.options = _.extend({
        timeout: 0       //timeout for each brick, default 0 , no timeout control
    }, options || {});
};

Lego.prototype.start = function (params) {
    this.params = params;
    return this;
};

/**
 *
 * parallel handle bricks
 *
 * */
Lego.prototype.pipe = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var self = this;

    if (!args.length) {
        winston.error("Lego.combo none bricks provide");
        throw new Error("function Lego.pipe : Bricks must provide");
    }

    this._chain.push(function (finish) {
        //parallel call
        var tasks = {};

        args.forEach(function (ModuleBrick) {
            var brick = new ModuleBrick(self);

            //以Brick的名字命名
            tasks[ModuleBrick.Name] = function (cb) {
                brick.handle(self.params, function (status, data) {
                    debug("brick handle finish , status=" + status + ",data=" + JSON.stringify(data || {}));
                    if (status == Brick.SUCCESS) {
                        cb(null, data);
                    } else {
                        cb(null, null);
                    }
                });
            }
        });

        async.parallel(tasks, function (err, results) {
            /**
             * results 会变成 {
             *      BrickName1: xxx,
             *      BrickName2: xxx
             * }
             * 所以当2个名字一样的Brick在同一个Lego中使用的时候会出现覆盖的情况
             *
             * */

                //和params合并， 传给下一个pipe
            finish(null, _.extend(self.params, results));
        });
    });

    return this;
};


Lego.prototype.done = function (cb) {
    if (!cb) {
        //只warning一下
        winston.warn("Lego.done need a callback function");
    }
    var self = this;
    if (this._chain.length) {
        async.waterfall(this._chain, function (err, result) {
            //clear chain
            self._chain = [];
            cb && cb.call(self, result);
        });
    } else {
        cb && cb.call(self, self.params);
    }
    return this;
};

module.exports = Lego;
Lego.Brick = Brick;