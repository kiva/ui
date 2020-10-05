import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import { withKnobs, number } from '@storybook/addon-knobs';

export default {
	title: 'Kv/KvLoadingParagraph',
	component: KvLoadingParagraph,
	decorators: [withKnobs],
};

export const Default = () => ({
	components: { KvLoadingParagraph },
	props: {
		lines: {
			type: Number,
			default: () => number('Number of lines', 4)
		},
	},
	template: '<kv-loading-paragraph :numLines="lines" />'
});
