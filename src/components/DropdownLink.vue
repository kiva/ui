<template>
	<router-link :data-dropdown="name"
		:data-options="options"
		:aria-controls="name"
		aria-expanded="false"
		:to="to">
		<slot></slot>
	</router-link>
</template>

<script>
// import $ from 'jquery';
import 'foundation/foundation.dropdown';

export default {
	props: {
		name: { type: String, required: true },
		to: { type: String, required: true }
	},
	data() {
		return {
			options: 'is_hover:true;hover_timeout:200;',
		};
	},
	mounted() {
		// $(document).foundation('dropdown', {});
	},
};
</script>

<style lang="scss">
@import 'settings';
// @import 'foundation/components/dropdown-buttons';
</style>
