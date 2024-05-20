import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
/* instrumentation.js */

const otlpDisabled = process.env?.OTEL_SDK_DISABLED || false;
const otlpEndpoint = process.env?.OTEL_EXPORTER_OTLP_ENDPOINT || null;

if (!otlpDisabled) {
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
