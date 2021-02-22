export default function checkInjections(vm = {}, injections = []) {
	const hasEveryInjection = injections.every(injection => !!vm.$options?.inject?.[injection]);
	if (!hasEveryInjection) {
		const injectionString = injections.map(i => `'${i}'`).join(', ');
		throw new Error(`Missing required injections! Add "inject: [${injectionString}]" to this component definition`);
	}
}
