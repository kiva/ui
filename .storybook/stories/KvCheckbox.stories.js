import KvCheckbox from '@/components/Kv/KvCheckbox';

export default { title: 'Kv | KvCheckbox' };

export const Default = () => ({
	components: { KvCheckbox },
	template: `<kv-checkbox>Default</kv-checkbox>`
});

export const Checked = () => ({
	components: { KvCheckbox },
	template: `<kv-checkbox is-checked>isChecked</kv-checkbox>`
});

export const Disabled = () => ({
	components: { KvCheckbox },
	template: `<kv-checkbox disabled>Disabled</kv-checkbox>`
});
