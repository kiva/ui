import KvActivityRow from '#src/components/Kv/KvActivityRow.vue';

export default {
    title: 'Kv/KvActivityRow',
    component: KvActivityRow,
};

const activity = {
    lenderName: 'Stephanie',
    lenderImage: 'https://www.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg',
    text: 'Stephanie lent $25',
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvActivityRow },
		template: `<kv-activity-row
			:activity="activity" />`,
	})
	template.args = args;
	return template;
};

export const Default = story({ activity });
