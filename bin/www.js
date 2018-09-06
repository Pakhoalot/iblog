#!/usr/bin/env node
var app = require('../app');
const logger = require('../utility/logger');

app.set('port', process.env.PORT || 3002);

var server = app.listen(app.get('port'), function() {
  logger.info('Express server listening on port ' + server.address().port);
});
