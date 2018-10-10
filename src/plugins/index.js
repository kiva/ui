import changeCaseFilter from './change-case-filter';
import apolloMixin from './apollo-mixin';
import numeralFilter from './numeral-filter';
import kvAnayltics from './kv-analytics-plugin';
import tipMessage from './tip-message-mixin';

export default {
	install: Vue => {
		Vue.mixin(apolloMixin);
		Vue.filter('changeCase', changeCaseFilter);
		Vue.filter('numeral', numeralFilter);
		kvAnayltics(Vue);
		Vue.mixin(tipMessage);
	}
};
