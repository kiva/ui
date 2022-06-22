const ddTrace = require('dd-trace');
const argv = require('./argv');
const config = require('../../config/selectConfig')(argv.config);
// Initialize tracing
if (config.server.enableDDTrace) {
	// REF: https://docs.datadoghq.com/tracing/runtime_metrics/nodejs/
	ddTrace.init({ runtimeMetrics: true });
	module.exports = ddTrace;
} else {
	module.exports = {
		trace: (name, opts, fn) => {
			if (typeof opts === 'function') {
				return opts();
			}
			return fn();
		},
		wrap: (name, opts, fn) => {
			if (typeof opts === 'function') {
				return opts;
			}
			return fn;
		},
	};
}
