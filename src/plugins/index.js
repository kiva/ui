import asyncDataMixin from './async-data-mixin';
import numeralFilter from './numeral-filter';

export default {
	install: Vue => {
		Vue.mixin(asyncDataMixin);
		Vue.filter('numeral', numeralFilter);
	}
};
