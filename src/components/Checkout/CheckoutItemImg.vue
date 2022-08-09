<template>
	<router-link
		:is="disableLink ? 'span' : 'router-link'"
		:to="`/lend/${loanId}`"
		v-kv-track-event="['basket', 'click-Read more', 'Photo', loanId, loanId]"
	>
		<img
			class="loan-img tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
			:src="imageUrl"
			:alt="'photo of ' + name"
		>
	</router-link>
</template>

<script>
export default {
	name: 'CheckoutItemImg',
	props: {
		disableLink: {
			type: Boolean,
			default: false,
		},
		loanId: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: ''
		},
		imageUrl: {
			type: String,
			default: ''
		}
	}
};
</script>
