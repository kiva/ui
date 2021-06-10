<template>
	<h1 class="tw-text-h2">
		{{ whySpecial }}
	</h1>
</template>

<script>

export default {
	props: {
		whySpecial: {
			type: String,
			default: ''
		}
	}
};
</script>
