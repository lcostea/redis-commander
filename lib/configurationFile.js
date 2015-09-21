'use strict';
var fs = require('fs');

exports.save = function (configPath, config, callback) {
    
    if(configPath){    
        fs.writeFile(configPath, JSON.stringify(config), function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }
};