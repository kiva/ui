import {
	getCLS,
	getFCP,
	getFID,
	getLCP,
	getTTFB,
} from 'web-vitals';

const trackingCategory = 'web vitals';
const trackingAction = 'report';

export default function collectWebVitals(trackEvent) {
	const handleReport = ({ name, id, delta }) => {
		// The name of the metric in acronym form ('CLS', 'FCP', 'FID', 'LCP', 'TTFB').
		const label = name;

		// A unique ID representing this particular metric that's specific to the
		// current page load. This ID can be used by an analytics tool to dedupe
		// multiple values sent for the same metric, or to group multiple deltas
		// together and calculate a total.
		const property = id;

		// The delta between the current value and the last-reported value.
		// On the first report, `delta` and `value` will always be the same.
		// Snowplow requires that se_value is an integer, so the value is rounded.
		// For CLS the value is first multiplied by 1000 for greater precision.
		const value = Math.round(name === 'CLS' ? delta * 1000 : delta);

		// Send metric value as an event
		trackEvent(trackingCategory, trackingAction, label, property, value);
	};
	getCLS(handleReport);
	getFCP(handleReport);
	getFID(handleReport);
	getLCP(handleReport);
	getTTFB(handleReport);
}
