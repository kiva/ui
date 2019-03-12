<template>
	<div class="list-loan-card">
		ListLoanCard Placeholder
	</div>
</template>

<script>
export default {

	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {},
					},
					image: {},
				};
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.list-loan-card {
	background-color: $white;
}
</style>
