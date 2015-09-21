var sf = require('sf');

var foldingCharacter = ":";

exports.getAll = function(prefix, maxLimit, redisConnection, next, cb){
	
	redisConnection.keys(prefix, function (err, allRedisKeys) {
      if (err) {
        console.error('redis.keys', err);
        return next(err);
      }
      console.log(sf('found {0} keys for "{1}"', allRedisKeys.length, prefix));
      
      if (allRedisKeys.length > maxLimit) {
        allRedisKeys = allRedisKeys.slice(0, maxLimit);
      }

      
      cb(allRedisKeys);

    });

}