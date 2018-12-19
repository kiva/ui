<template>
	<code class="code" :class="{nowrap}">
		<pre v-if="code">{{ code }}</pre>
		<slot v-else></slot>
	</code>
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
	&.nowrap {
		white-space: nowrap;
	}
}
</style>
