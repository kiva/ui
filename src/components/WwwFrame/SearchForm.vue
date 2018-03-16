<template>
	<form :id="name" :aria-hidden="closedAttr" action=".">
		<div>
			<button id="close-search" class="hide-for-large-up"
				aria-controls="search-form"
				aria-hidden="true"
				:aria-expanded="openAttr"
			>
				<svg-icon class="close-icon" name="x" />
			</button>
			<kv-icon class="search-icon" name="magnify-glass" />
			<input type="search" id="search-box" placeholder="Search all loans">
			<input type="submit" class="hidden-submit">
		</div>
	</form>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	props: {
		name: { type: String, required: true },
		open: { type: Boolean, default: false },
	},
	components: { KvIcon },
	computed: {
		openAttr() {
			return this.open ? 'true' : 'false';
		},
		closedAttr() {
			return this.open ? 'false' : 'true';
		},
	},
};
</script>

<style lang="scss">
input[type="submit"].hidden-submit {
	position: absolute;
	left: -9999px;
	width: 1px;
	height: 1px;
}
</style>
