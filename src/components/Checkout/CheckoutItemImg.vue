<template>
	<router-link
		:to="`/lend/${loanId}`"
		v-kv-track-event="['basket', 'click-Read more', 'Photo', loanId, 'true']">

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
	height: rem-calc(71);
	width: rem-calc(71);

	@include breakpoint(medium) {
		height: rem-calc(80);
		width: rem-calc(80);
	}
}

</style>
