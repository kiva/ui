import promBundle from 'express-prom-bundle';

export default function createMetricsMiddleware() {
	return promBundle({
		includeMethod: true,
		includeStatusCode: true,
		includeUp: true,
		promClient: {
			collectDefaultMetrics: {}
		}
	});
}
