<template>
	<h1 class="tw-text-h2">
		{{ name }}
	</h1>
</template>

<script>

export default {
	props: {
		name: {
			type: String,
			default: ''
		}
	}
};
</script>
