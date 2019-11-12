import KvToggle from './KvToggle';

export default {
	title: 'Kv | KvToggle',
	component: KvToggle
};

export const isChecked = () => ({
	components: {
		KvToggle
	},
	data: () => ({
		checked: true,
	}),
	template: '<kv-toggle v-bind="checked">{{checked}} Label here</kv-toggle>'
});
