<template>
	<div class="tw-flex tw-mb-1.5">
		<dt class="tw-flex-1 tw-mb-0">
			<button @click="$emit('show-definition')" class="tw-underline tw-font-book">
				{{ term }}
			</button>
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
			type: [String, Number],
			default: ''
		},
	},
};
</script>
