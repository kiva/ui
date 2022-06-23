import MainCategoryTile from '@/components/Categories/MainCategoryTile';

export default {
	title: 'Main Category Tile',
	component: MainCategoryTile,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MainCategoryTile },
		template: '<main-category-tile :tileSize="tileSize" />',
	})
	template.args = args;
	return template;
};

export const Default = story({ tileSize: 'small' });

export const Large = story({ tileSize: 'large' });

export const Medium = story({ tileSize: 'medium' });

export const Small = story({ tileSize: 'small' });

