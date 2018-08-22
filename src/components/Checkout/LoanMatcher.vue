<template>
	<div class="small-text">Matched by {{ matcherName }}</div>
</template>

<script>
export default {
	props: {
		matcherName: {
			type: String,
			default: ''
		}
	}
};
</script>
