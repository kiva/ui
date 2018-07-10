export default function checkApolloInject(vm) {
	if (!vm.$options.inject || !vm.$options.inject.apollo) {
		throw new Error('No apollo client provided! Add "inject: [\'apollo\']" to this component definition.');
	}
}
