'use strict';

var pathToConfigFile = '../bin/redis-commander.json';

try
{
    var redisCommanderConfig = require(pathToConfigFile);
    redisCommanderConfig.pathToConfigFile = pathToConfigFile;    
}
catch (exception)
{
    console.log(exception);
}


if (!redisCommanderConfig){
        console.log("No config found or was invalid.\nUsing default configuration.");
		
        redisCommanderConfig = _defaultConfig;
    }

  if (!redisCommanderConfig.default_connections) {
        redisCommanderConfig.default_connections = [];
  }
  
  
 
module.exports = redisCommanderConfig;

var _defaultConfig = {
            "sidebarWidth": 250,
            "locked": false,
            "CLIHeight": 50,
            "CLIOpen": false,
            "maxKeysToQuery": 1000,
            "default_connections": []
        };






