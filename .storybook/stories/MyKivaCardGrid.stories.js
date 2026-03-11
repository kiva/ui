import { defineComponent } from 'vue';
import MyKivaCardGrid from '#src/components/MyKiva/MyKivaCardGrid.vue';

export default {
	title: 'MyKiva/MyKivaCardGrid',
	component: MyKivaCardGrid,
};

const SampleCard = defineComponent({
	name: 'SampleCard',
	props: {
		title: { type: String, default: 'Card Title' },
		color: { type: String, default: '#e0e0e0' },
	},
	template: `
		<div
			:style="{
				background: color,
				borderRadius: '8px',
				padding: '24px',
				minHeight: '200px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: '18px',
				fontWeight: 'bold',
			}"
		>
			{{ title }}
		</div>
	`,
});

const buildItems = count => {
	const colors = ['#D4E6F1', '#D5F5E3', '#FADBD8', '#F9E79F', '#E8DAEF', '#D6EAF8'];
	return Array.from({ length: count }, (_, i) => ({
		key: `card-${i}`,
		component: SampleCard,
		props: {
			title: `Card ${i + 1}`,
			color: colors[i % colors.length],
		},
	}));
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyKivaCardGrid },
		setup() { return { args }; },
		template: `
			<div style="max-width: 1200px;">
				<my-kiva-card-grid v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const ThreeCards = story({ items: buildItems(3) });
export const SixCards = story({ items: buildItems(6) });
export const SingleCard = story({ items: buildItems(1) });
export const TwoColumnGrid = story({
	items: buildItems(4),
	gridColsClass: 'md:tw-grid-cols-2',
});
