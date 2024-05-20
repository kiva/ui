import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { trace, SpanKind } from '@opentelemetry/api';
import { AlwaysOnSampler, SamplingDecision, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { ConsoleSpanExporter, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

// Not functionally required but gives some insight what happens behind the scenes
// const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Basic export switch to enable console or OTLP
const Exporter = (process.env.OPENTELEMETRY_EXPORTER_TYPE || '').toLowerCase().startsWith('c')
	? ConsoleSpanExporter : OTLPTraceExporter;

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
	return spanKind !== SpanKind.SERVER;
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

		return trace.getTracer(serviceName);
	}
	return false;
}

export { setupTracing };
export default {
	setupTracing
};
