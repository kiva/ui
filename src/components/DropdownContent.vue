<template>
	<div :id="name"
		class="f-dropdown content"
		data-dropdown-content
		aria-hidden="true"
		aria-autoclose="false"
		tabindex="-1">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: ['name'],
};
</script>

<style lang="scss">
@import 'settings';
@import 'foundation/components/dropdown';
</style>
