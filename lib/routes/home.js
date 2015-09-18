'use strict';
var redisCommanderConfig = require('../configuration');

module.exports = function (app) {
  app.get('/', getHome);
  app.post('/login', postLogin);
  app.get('/config', getConfig);
  app.post('/config', postConfig);
  app.post('/logout/:connectionId', postLogout);
};

function getConfig (req, res) {
    return res.send(req.app.configuration);
}

function postConfig (req, res) {
  var config = req.body;
  if (!config) {
    console.log('no config sent');
    res.send(500);
  } else {
    res.send(200);
    req.app.saveConfig(config, function (err) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.send(200);
      }
    });
  }
}

function postLogin(req, res, next) {
    req.app.login(req.body.label, req.body.hostname, req.body.port, req.body.password, req.body.dbIndex, function (err) {
        if (err) {
            req.flash('error', 'Invalid login: ' + err);
        }
        var newConnection = {};
        newConnection['label'] = req.body.label;
        newConnection['host'] = req.body.hostname;
        newConnection['port'] = req.body.port;
        newConnection['password'] = req.body.password;
        newConnection['dbIndex'] = req.body.dbIndex;
        if (!req.app.configuration['default_connections']) {
            req.app.configuration['default_connections'] = [];
        }
        if (!containsConnection(req.app.configuration.default_connections, newConnection)) {
            req.app.configuration['default_connections'].push(newConnection);
        }
        req.app.saveConfig(req.app.configuration, function (err) {
            if (err) {
                return next(err);
            }
            if (!res._headerSent) {
                return res.redirect('/');
            }
        });
    });
}

function postLogout(req, res, next) {
    var connectionId = req.params.connectionId;
    var connectionIds = connectionId.split(":");
    var host = connectionIds[0];
    var port = connectionIds[1];
    var db = connectionIds[2];
    req.app.logout(host, port, db, function (err) {
        if (err) {
            return next(err);
        }
        
        if (!req.app.configuration.default_connections) {
            req.app.configuration.default_connections = [];
        }
        removeConnectionFromDefaults(req.app.configuration.default_connections, connectionIds, function (err, newDefaults) {
            if (err) {
                console.log(err);
                if (!res._headerSent) {
                    return res.send('OK');
                }
            }
            req.app.configuration.default_connections = newDefaults;
            req.app.saveConfig(config, function (err) {
                if (err) {
                    return next(err);
                }
                if (!res._headerSent) {
                    return res.send('OK');
                }
            });
        });
    });
}

function removeConnectionFromDefaults (connections, connectionIds, callback) {
  var notRemoved = true;
  var hostname = connectionIds[0];
  var port = connectionIds[1];
  var db = connectionIds[2];
  connections.forEach(function (connection, index) {
        
        if (notRemoved && connection.host == hostname && connection.port == port && connection.dbIndex == db) {
            notRemoved = false;
            connections.splice(index, 1);
        }
  });
    if (notRemoved) {
        return callback("Could not remove " + hostname + ":" + port + ":" + db + " from default connections.");
    } else {
        return callback(null, connections);
    }
}

function getHome (req, res) {
  res.render('home/home.ejs', {
        title: 'Home',
        layout: req.app.layoutFilename
    });
}

function containsConnection (connectionList, object) {
  var contains = false;
  connectionList.forEach(function (element) {
        if (element.host == object.host && element.port == object.port && element.password == object.password && element.dbIndex == object.dbIndex) {
            contains = true;
        }
    });
  return contains;
}
