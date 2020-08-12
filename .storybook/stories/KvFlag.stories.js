import KvFlag from '@/components/Kv/KvFlag';

export default {
	title: 'Kv/KvFlag',
	component: KvFlag,
 };

export const Default = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<kv-flag country="us" />
		</div>
	`,
});

export const Multiple = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<kv-flag country="us" />
			<kv-flag country="au" />
			<kv-flag country="cn" />
		</div>
	`,
});
