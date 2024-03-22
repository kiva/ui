const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const opentelemetry = require('@opentelemetry/api');

// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const { AlwaysOnSampler, SamplingDecision, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { GraphQLInstrumentation } = require('@opentelemetry/instrumentation-graphql');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { ConsoleSpanExporter, NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Basic export switch to enable console or OTLP
const Exporter = (process?.env?.OPENTELEMETRY_EXPORTER_TYPE ?? 'export')?.toLowerCase().startsWith('c')
	? ConsoleSpanExporter : OTLPTraceExporter;
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const otlpDisabled = process.env?.OTEL_SDK_DISABLED === 'true' || false;
const otlpEndpoint = process.env?.OTEL_EXPORTER_OTLP_ENDPOINT || null;

// Filter Utility
function filterSampler(filterFn, parent) {
	return {
		shouldSample(ctx, tid, spanName, spanKind, attr, links) {
			if (!filterFn(spanName, spanKind, attr)) {
				return { decision: SamplingDecision.NOT_RECORD };
			}
			return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
		},
		toString() {
			return `FilterSampler(${parent.toString()})`;
		}
	};
}

// Basic filter function, currently excludes internal express spans
// attributes are helpful if we want to inspect and omit requests such as health checks or timesync
// eslint-disable-next-line no-unused-vars
function ignoreTheseSpans(spanName, spanKind, attributes) {
	return spanKind !== opentelemetry.SpanKind.SERVER;
}

function setupTracing() {
	const serviceName = process.env?.OTEL_SERVICE_NAME || 'ui';
	if (!otlpDisabled) {
		console.log(JSON.stringify({
			meta: {},
			level: 'log',
			message: 'OTLP Exporter Activated'
		}));
		const provider = new NodeTracerProvider({
			resource: new Resource({
				[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
				[SemanticResourceAttributes.SERVICE_NAMESPACE]: process.env?.OTEL_SERVICE_NAMESPACE || 'kiva',
			}),
			sampler: filterSampler(ignoreTheseSpans, new AlwaysOnSampler()),
		});
		registerInstrumentations({
			tracerProvider: provider,
			instrumentations: [
				new GraphQLInstrumentation(),
				// Express instrumentation expects HTTP layer to be instrumented
				HttpInstrumentation,
				ExpressInstrumentation,
				WinstonInstrumentation,
			],
		});

		const exporter = new Exporter({
			serviceName,
			url: otlpEndpoint,
			headers: {},
		});

		provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

		// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
		provider.register();

		return opentelemetry.trace.getTracer(serviceName);
	}
	return false;
}

module.exports = {
	setupTracing
};
