import apolloMixin from './apollo-mixin';
import kebabCaseFilter from './kebab-case-filter';
import numeralFilter from './numeral-filter';
import kvAnayltics from './kv-analytics-plugin';
import tipMessage from './tip-message-plugin';

export default {
	install: Vue => {
		Vue.mixin(apolloMixin);
		Vue.filter('kebabCase', kebabCaseFilter);
		Vue.filter('numeral', numeralFilter);
		kvAnayltics(Vue);
		// tipMessage(Vue);
		Vue.mixin(tipMessage);
	}
};
