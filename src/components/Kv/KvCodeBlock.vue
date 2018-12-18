<template>
	<div class="code" :class="`${nowrap ? 'nowrap' : ''}`">
		<pre v-if="code">{{ code }}</pre>
		<slot v-else></slot>
	</div>
</template>

<script>
export default {
	props: {
		code: {
			type: String,
			default: '',
		},
		nowrap: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.code {
	font-family: $font-family-monospace;
	background-color: $light-gray;
	color: $black;
	padding: 1rem;
	overflow: auto;
	border: 1px solid $gray;
	border-radius: 3px;

	&.nowrap {
		white-space: nowrap;
	}
}
</style>
