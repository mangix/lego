/**
 * transProperty
 * @param from
 * @param to
 * @param fromProperty {String} "a.b.c"
 * @param toProperty {String}   "a.b.c"
 * */
var _ = require("underscore");

module.exports = function (from, to, fromProperty, toProperty) {
    function query(obj, propStr) {
        var target = obj || null;
        var props = propStr.split(".");
        var propName;
        while (target && (propName = props.shift())) {
            if (propName in target) {
                target = target[propName];
            } else {
                target = null;
            }
        }
        return target;
    }

    function build(obj, propStr, data) {
        var target = obj || {};
        var props = propStr.split(".");
        var propName;
        var i = 0 , l = props.length;
        while (i++ < l - 1 && (propName = props.shift())) {
            if (!(propName in target) || !_.isObject(target[propName])) {
                target[propName] = {};
            }
            target = target[propName];
        }
        target[props[props.length - 1]] = data;
    }

    build(to, toProperty, query(from, fromProperty));
};