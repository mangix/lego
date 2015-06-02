/**
 * global settings
 * */

var options = {
    "view engine": "jade",
    "views": "views",                                //view root path
    "debug": process.NODE_ENV == "development"       //是否开启debug模式
};


exports.set = function (key, value) {
    options[key] = value;
};

exports.get = function (key) {
    return options[key];
};

