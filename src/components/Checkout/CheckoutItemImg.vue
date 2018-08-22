<template>
	<router-link
		:to="`/lend/${loanId}`"
		v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId, 'true']">

		<img class="small-2 loan-img"
			:src="imageUrl"
			:alt="'photo of ' + name"
		>
	</router-link>
</template>

<script>
export default {
	props: {
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
	},
};
</script>
