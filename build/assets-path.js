var path = require('path');
var config = require('../config');

module.exports = function (_path) {
	return path.posix.join(config.build.assetsSubDirectory, _path)
};
