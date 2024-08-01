import KvChip from '#src/components/Kv/KvChip';

const args = {
	title: 'Chip Title',
};

export default {
	title: 'Kv/KvChip',
	component: KvChip,
	args,
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
	setup() { return args; },
	template: `
		<kv-chip
			:title="title"
			@click-chip="handleClickChip"
		/>
	`,
});

