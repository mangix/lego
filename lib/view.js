var fs = require("fs");
var logger = require("./logger");


exports.build = function (path) {
    try {
        return  fs.readFileSync(path).toString();
    } catch (e) {
        logger("error", "Parse view ", path, " failed,", e);
        return null
    }
};
