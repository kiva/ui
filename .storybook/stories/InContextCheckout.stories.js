import InContextCheckout from '@/components/Checkout/InContext/InContextCheckout';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'Checkout/InContext/InContextCheckout',
	component: InContextCheckout,
};

const story = (args = {}) => {
	const template = (templateArgs, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { InContextCheckout },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args: templateArgs }; },
		template: `
			<div style="max-width: 600px;" class="tw-p-6">
				<in-context-checkout />
			</div>
		`,
	})
	template.args = args;
	return template;
};

export const Default = story();
