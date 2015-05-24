var winston = require("winston");

var logger = function () {
    if (logger.enable) {
        winston.log.apply(winston.log, arguments);
    }
};

logger.enable = true;

module.exports = logger;

