var async = require("async");
var debug = require("debug")("lego");
var Brick = require("./brick");
var _ = require("underscore");
var domain = require("domain");

var log = require("./logger");
var transProperty = require("./trans");

var Lego = function (options) {
    //each time pipe calls , add an item
    this._chain = [];

    //start params
    this.params = {};

    //options
    this.options = _.extend({
        timeout: 0       //timeout for each brick, default 0 , no timeout control
    }, options || {});

    this.propertyQueue = [];

};

Lego.prototype.start = function (params) {
    this.params = params || {};
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
        log("error", "Lego.combo none bricks provide");
        throw new Error("function Lego.pipe : Bricks must provide");
    }

    //TODO filter args not Brick


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


            /**
             * 和params合并
             * */
            _.extend(self.params, results);

            //trans property
            self.propertyQueue.forEach(function (trans) {
                if (trans.brick && trans.brick.Name && trans.brick.Name in results) {
                    transProperty(results[trans.brick.Name], self.params, trans.property, trans.toProperty);
                }
            });


            //传给下一个pipe
            finish(null, self.params);
        });
    });

    return this;
};


Lego.prototype.done = function (cb) {
    if (!cb) {
        //只warning一下
        log("warn", "Lego.done need a callback function");
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

/**
 * 在一次pipe的全部Brick处理完以后，提供此函数，可以把部分数据提到data的顶层，
 * 方便后续pipe的模块依赖顶层的数据，而不是Brick返回的内部数据
 *
 * @param brick {Brick|String}
 * @param property{String}
 * @param toProperty{String}
 * */
Lego.prototype.top = function (brick, property, toProperty) {
    if (_.isString(brick)) {
        //Name of brick , try find by name
        brick = Brick.find(brick);
    }

    if (!brick || !(brick.prototype instanceof(Brick))) {
        log("error", "Lego.top param brick must be a Brick");
        return this;
    }


    if (!_.isString(property) || !_.isString(toProperty)) {
        log("error", "Lego.top param property,toProperty must be String");
        return this;
    }

    //add to Queue
    this.propertyQueue.push({
        brick: brick,
        property: property,
        toProperty: toProperty
    });

    return this;
};


module.exports = Lego;

Lego.Brick = Brick;
Lego.switchLog = function (enable) {
    log.enable = enable;
};