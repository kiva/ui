import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
	title: 'Kv/KvLoadingPlaceholder',
	component: KvLoadingPlaceholder,
	decorators: [withKnobs],
};

export const Default = () => ({
	components: { KvLoadingPlaceholder },
	props: {
		borderRadius: {
			type: String,
			default: () => text('Border radius', 'none')
		},
		height: {
			type: String,
			default: () => text('Height', '2rem')
		},
		width: {
			type: String,
			default: () => text('Width', '5rem')
		},
	},
	template: '<kv-loading-placeholder :style="{ borderRadius: borderRadius, height: height, width: width }" />'
});
