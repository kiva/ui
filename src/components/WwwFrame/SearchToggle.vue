<template>
	<button class="search-toggle"
		:aria-controls="controls"
		:aria-expanded="openAttr"
		:aria-pressed="openAttr"
		@click.prevent="toggle">
		<kv-icon class="search-icon" name="magnify-glass" />
		<kv-icon class="close-icon" name="x" />
	</button>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	props: {
		controls: { type: String, required: true }
	},
	components: { KvIcon },
	data() {
		return {
			open: false,
		};
	},
	computed: {
		openAttr() {
			return this.open ? 'true' : 'false';
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
			this.$emit('toggle', this.open);
		},
	},
};
</script>

<style lang="scss">
.search-toggle {
	border: none;

	&:focus {
		outline: none;
	}

	&[aria-expanded="true"] .search-icon,
	&[aria-expanded="false"] .close-icon {
		display: none;
	}
}
</style>
