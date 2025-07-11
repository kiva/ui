<template>
	<div class="tw-flex tw-items-center tw-mb-2.5">
		<dt class="tw-flex-1 tw-mb-0">
			<button
				@click="$emit('show-definition')" class="tw-underline tw-font-book"
				data-testid="bp-details-lightbox-btn"
			>
				{{ term }}
			</button>
		</dt>
		<dd data-testid="bp-details-value">
			{{ details }}
		</dd>
	</div>
</template>

<script>
export default {
	name: 'DescriptionListItem',
	emits: ['show-definition'],
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
