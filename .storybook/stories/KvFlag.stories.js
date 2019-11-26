import KvFlag from '@/components/Kv/KvFlag';

export default { title: 'Kv | KvFlag' };

export const Default = () => ({
	components: { KvFlag },
	template: `
		<div>
			<kv-flag country="GB" />
			<kv-flag country="US" />
			<kv-flag country="NL" />
		</div>
	`,
});
