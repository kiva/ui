import KvTipMessage from '@/components/Kv/KvTipMessage';
import StoryRouter from 'storybook-vue-router';

export default {
	title: 'Kv/KvTipMessage',
	component: KvTipMessage,
	decorators: [StoryRouter()],
	args: {
		message: `We couldn't complete your purchase. Another lender may have fully funded the loan or it may have expired. <a href='/lend'>Find another loan here</a>.<br/>`,
		type: 'error',
		persist: true
	},
	argTypes: {
		type: {
			control: {
			  type: 'select',
			  options: ['error', 'info', 'confirmation'],
			},
		},
	}
};

export const Default = (args, { argTypes }) => ({
	components: {
		KvTipMessage,
	},
	props: Object.keys(argTypes),
	watch: {
		message() {
			this.$refs.tip.show(this.message, this.type, this.persist);
		},
		type() {
			this.$refs.tip.show(this.message, this.type, this.persist);
		},
		persist() {
			this.$refs.tip.show(this.message, this.type, this.persist);
		}
	},
	mounted() {
		this.$refs.tip.show(this.message, this.type, this.persist);
	},
	template: `
		<kv-tip-message ref="tip" />
	`
});




