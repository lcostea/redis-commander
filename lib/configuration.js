'use strict';

var pathToConfigFile = '../bin/redis-commander.json';

try
{
    var redisCommanderConfig = require(pathToConfigFile);    
}
catch (exception)
{
    console.log(exception);
}


if (!redisCommanderConfig){
        console.log("No config found or was invalid.\nUsing default configuration.");
		
        redisCommanderConfig = {
            "sidebarWidth": 250,
            "locked": false,
            "CLIHeight": 50,
            "CLIOpen": false,
            "default_connections": []
        };
    }

  if (!redisCommanderConfig.default_connections) {
        redisCommanderConfig.default_connections = [];
  }
  
module.exports = redisCommanderConfig;


exports.pathToConfigFile = pathToConfigFile; 

var _defaultConfig = {
	
}






