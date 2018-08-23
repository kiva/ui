<template functional>
	<div class="small-text">
		Matched by {{ props.matchingText }}
	</div>
</template>

<script>
export default {
	props: {
		matchingText: {
			type: String,
			default: ''
		}
	},
};
</script>
