<template>
	<p class="tw-text-h2">
		{{ whySpecial }}
	</p>
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
