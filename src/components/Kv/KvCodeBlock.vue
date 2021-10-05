<template>
	<code>
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
	},
};
</script>
