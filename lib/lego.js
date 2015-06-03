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
        timeout: 0        //timeout for each brick, default 0 , no timeout control
    }, options || {});

    //properties to be transformed
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

    args = args.filter(function (brick) {
        if (!(brick.prototype instanceof  Brick)) {
            log("error", "Lego.pipe param ", brick, " is not a Brick");
            return false;
        }
        return true;
    });

    if (!args.length) {
        log("error", "Lego.combo none bricks provide");
        throw new Error("function Lego.pipe : Bricks must provide");
    }


    this._chain.push(this._makePiper(args));

    return this;
};


Lego.prototype.done = function (cb) {
    if (!cb) {
        //只warning一下
        log("warn", "Lego.done need a callback function");
    }
    var finish = function () {
        cb && cb.call(this, this.params);
    }.bind(this);

    if (this._chain.length) {
        async.waterfall(this._chain, finish);
        //TODO clear chain , done之后可以继续start pipe done
        this._chain = [];
    } else {
        finish();
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

/**
 * make a piper to put in the chain
 * */
Lego.prototype._makePiper = function (bricks) {
    var params = this.params;
    var propertyQueue = this.propertyQueue;

    return function () {
        //parallel call
        var tasks = {};
        var self = this;

        //async waterfall, 回调函数是最后一个参数
        var finish = arguments[arguments.length - 1];

        //pass tasks as `this` to _domainBrick
        bricks.forEach(function (ModuleBrick) {
            //以Brick的名字命名
            tasks[ModuleBrick.Name] = self._domainBrick(new ModuleBrick());
        });

        async.parallel(tasks, function (err, results) {
            /**
             * results 会变成 {
             *      BrickName1: xxx,
             *      BrickName1View:html,
             *      BrickName2: xxx,
             *      BrickName2View:html
             * }
             * 所以当2个名字一样的Brick在同一个Lego中使用的时候会出现覆盖的情况
             *
             * */

            /**
             * 和params合并
             * */
            Object.keys(results).forEach(function (brickName) {
                var data = results[brickName];
                if (data) {
                    params[brickName] = data.data;
                    params[brickName + "View"] = data.html;
                } else {
                    params[brickName] = null;
                }
            });

            //trans property
            propertyQueue.forEach(function (trans) {
                if (trans.brick && trans.brick.Name && trans.brick.Name in results) {
                    transProperty(results[trans.brick.Name] ? results[trans.brick.Name].data : null, params, trans.property, trans.toProperty);
                }
            });

            //pass to next pipe
            finish(null);
        });
    }.bind(this);
};

/**
 * call brick handler in domain
 * */
Lego.prototype._domainBrick = function (brick) {
    var params = this.params;
    var timeout = this.options.timeout;

    return function (cb) {
        //async.parallel cb
        brick.handle(params, function (status, data, html) {
            debug("brick handle finish , status=" + status + ",data=" + JSON.stringify(data || {}) + ",html=" + html);
            if (status == Brick.SUCCESS) {
                cb(null, {
                    data: data,
                    html: html
                });
            } else {
                cb(null, null);
            }
        }, timeout);
    }


};

module.exports = Lego;

Lego.Brick = Brick;
Lego.setting = require("./setting");
Lego.switchLog = function (enable) {
    log.enable = enable;
};