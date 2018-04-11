import asyncDataMixin from './async-data-mixin';
import kebabCaseFilter from './kebab-case-filter';
import numeralFilter from './numeral-filter';

export default {
	install: Vue => {
		Vue.mixin(asyncDataMixin);
		Vue.filter('kebabCase', kebabCaseFilter);
		Vue.filter('numeral', numeralFilter);
	}
};
