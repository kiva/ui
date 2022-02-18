import changeCaseFilter from './change-case-filter';
import apolloMixin from './apollo-plugin';
import numeralFilter from './numeral-filter';
import loanUseFilter from './loan-use-filter';
import tipMessage from './tip-message-plugin';
import observeVisibility from './observe-visibility-plugin';

export default {
	install: Vue => {
		apolloMixin(Vue);
		Vue.filter('changeCase', changeCaseFilter);
		Vue.filter('numeral', numeralFilter);
		Vue.filter('loanUse', loanUseFilter);
		tipMessage(Vue);
		observeVisibility(Vue);
	}
};
