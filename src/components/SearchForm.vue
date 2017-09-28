<template>
	<form :id="name" :aria-hidden="closedAttr" action=".">
		<div>
			<button id="close-search" aria-controls="search-form" aria-hidden="true" :aria-expanded="openAttr" class="hide-for-large-up">
				<svg-icon class="close-icon" name="x" />
			</button>
			<svg-icon class="search-icon" name="magnify-glass" />
			<input type="search" id="search-box" placeholder="Search all loans">
			<input type="submit" class="hidden-submit">
		</div>
	</form>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';

export default {
	props: ['name', 'open'],
	components: { SvgIcon },
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
