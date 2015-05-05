var async = require("async");
var winston = require("winston");
var debug = require("debug")("lego");
var Brick = require("./brick");
var _ = require("underscore");

var Lego = function () {
    //each time pipe calls , add an item
    this._chain = [];
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

    this._chain.push(function (finish) {
        if (!args.length) {
            winston.warn("Lego.combo none bricks provide");
        } else {
            //parallel call
            var tasks = {};

            args.forEach(function (ModuleBrick) {
                var brick = new ModuleBrick(self);
                tasks[ModuleBrick.name] = function (cb) {
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
                finish(null, _.extend(self.params, results));
            });
        }
    });

    return this;
};


Lego.prototype.done = function (cb) {
    var self = this;
    if (this._chain.length) {
        async.waterfall(this._chain, function (err, result) {
            //clear chain
            self._chain = [];
            cb(result);
        });
    } else {
        cb(self.params);
    }
    return this;
};

module.exports = Lego;
exports.Brick = Brick;