import KvToggle from '@/components/Kv/KvToggle';

export default { title: 'Kv | KvToggle' };

export const Default = () => ({
	components: {
		KvToggle
	},
	data() {
		return {
			checked: true,
		}
	},
	template: `<kv-toggle v-model="checked">Label here</kv-toggle>`
});

export const Disabled = () => ({
	components: {
		KvToggle
	},
	data() {
		return {
			checked: true,
		}
	},
	template: `<kv-toggle disabled v-model="checked">Label here</kv-toggle>`
});

