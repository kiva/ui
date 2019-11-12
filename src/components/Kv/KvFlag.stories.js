import KvFlag from './KvFlag';

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
