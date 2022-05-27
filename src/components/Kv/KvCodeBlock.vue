<template>
	<code>
		<pre v-if="code">{{ code }}</pre>
		<slot v-else></slot>
	</code>
</template>

<script>
export default {
	name: 'KvCodeBlock',
	props: {
		code: {
			type: String,
			default: '',
		},
	},
};
</script>
