<template>
	<div class="tw-flex tw-mb-2">
		<dt class="tw-flex-1">
			<button class="tw-underline">{{ term }}</button>
		</dt>
		<dd>{{ details }}</dd>
	</div>
</template>

<script>
export default {
	props: {
		term: {
			type: String,
			default: ''
		},
		details: {
			type: String,
			default: ''
		},
	},
};
</script>
