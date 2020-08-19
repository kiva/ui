import KvProgressBar from '@/components/Kv/KvProgressBar';
import { text } from '@storybook/addon-knobs';

export default {
	title: 'Kv/KvProgressBar',
	component: KvProgressBar,
};

export const Default = () => ({
	components: {
		KvProgressBar,
	},
	props: {
		value: {
			type: String,
			default() { return text('value', '20') }
		},
		max: {
			type: String,
			default() { return text('max', '100') }
		}
	},
	template: `
		<div>
			<kv-progress-bar :value="value" :max="max" />
		</div>
	`
});




