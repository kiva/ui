<template>
	<router-link
		:to="`/lend/${loanId}`"
		v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId, 'true']">

		<img class="loan-img"
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

<style lang="scss" scoped>
@import 'settings';

.loan-img {
	height: rem-calc(55);
	width: rem-calc(55);
}

</style>
