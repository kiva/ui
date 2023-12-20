/* instrumentation.js */
// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const {	OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const {	getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const {	PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || null;

if (otlpEndpoint) {
	const sdk = new NodeSDK({
		traceExporter: new OTLPTraceExporter({
			url: otlpEndpoint,
			headers: {},
		}),
		metricReader: new PeriodicExportingMetricReader({
			exporter: new OTLPMetricExporter({
				url: otlpEndpoint,
				headers: {},
				concurrencyLimit: 1,
			}),
		}),
		instrumentations: [getNodeAutoInstrumentations()],
	});

	sdk.start();
}
