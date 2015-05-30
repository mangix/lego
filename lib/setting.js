/**
 * global settings
 * */
var path = require("path");

var options = {
    "view engine": "jade",
    "view": "./views"
};


exports.set = function (key, value) {
    options[key] = value;
};

exports.get = function (key) {
    return options[key];
};

exports.viewPath = function (filePath) {
    return path.join(this.get("view"), filePath);

};