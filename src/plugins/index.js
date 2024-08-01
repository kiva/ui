import changeCaseFilter from './change-case-filter';
import apolloMixin from './apollo-plugin';
import numeralFilter from './numeral-filter';
import tipMessage from './tip-message-plugin';
import observeVisibility from './observe-visibility-plugin';

export default {
	install: app => {
		apolloMixin(app);
		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$filters = {
			changeCase: changeCaseFilter,
			numeral: numeralFilter,
		};
		tipMessage(app);
		observeVisibility(app);
	}
};
