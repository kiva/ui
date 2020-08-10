import KvProgressBar from '@/components/Kv/KvProgressBar';
import { number } from '@storybook/addon-knobs';

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
			type: Number,
			default() { return number('value', 20) }
		},
		max: {
			type: Number,
			default() { return number('max', 100) }
		}
	},
	template: `
		<div>
			<kv-progress-bar :value="value" :max="max" />
		</div>
	`
});




