import BadgeModal from '#src/components/MyKiva/BadgeModal.vue';
import { badgeNoProgress } from '../mock-data/badge-tiered-data-mock';

export default {
	title: 'MyKiva/Badge Modal',
	component: BadgeModal,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeModal },
		setup() { return args; },
		template: `
			<badge-modal
				:show="true"
				:badge="badge"
				:title="title"
				:description="description"
				:badge-image-url="badgeImageUrl"
			/>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	badge: badgeNoProgress,
	title: "Women's equality",
	description: 'Removing financial barriers is key to achieving global gender equity. Help women overcome financial barriers, build their economic independence, and pursue their dreams.',
	badgeImageUrl: 'https://images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/04ddc29a4cda74e10357a3716e8ec187/Women_Level_1.svg',
});
