import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import mockedReceiptData from '../mock-data/receipt-data-mock';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'MyKiva/Thanks',
	component: ThanksBadges,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ThanksBadges },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: '<ThanksBadges v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const Guest = story({ receipt: mockedReceiptData });

export const User = story({ isGuest: false, receipt: mockedReceiptData });
