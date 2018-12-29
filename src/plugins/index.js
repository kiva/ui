import changeCaseFilter from './change-case-filter';
import apolloMixin from './apollo-plugin';
import numeralFilter from './numeral-filter';
import kvAnayltics from './kv-analytics-plugin';
import tipMessage from './tip-message-plugin';

export default {
	install: Vue => {
		apolloMixin(Vue);
		Vue.filter('changeCase', changeCaseFilter);
		Vue.filter('numeral', numeralFilter);
		kvAnayltics(Vue);
		tipMessage(Vue);
	}
};
