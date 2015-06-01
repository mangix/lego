/**
 * global settings
 * */

var options = {
    "view engine": "jade",
    "views": "views"    //view root path
};


exports.set = function (key, value) {
    options[key] = value;
};

exports.get = function (key) {
    return options[key];
};

