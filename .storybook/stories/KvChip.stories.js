import KvChip from '#src/components/Kv/KvChip';

export default {
	title: 'Kv/KvChip',
	component: KvChip,
	args: {
		title: 'Chip Title',
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvChip
	},
	methods: {
		handleClickChip() {
			console.log('click chip');
		}
	},
	template: `
		<kv-chip
			:title="title"
			@click-chip="handleClickChip"
		/>
	`,
});

