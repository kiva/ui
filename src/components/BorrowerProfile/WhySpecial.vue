<template>
	<h2 class="tw-text-h2">
		{{ whySpecial }}
	</h2>
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
