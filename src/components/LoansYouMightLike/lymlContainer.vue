<template>
	<div>
		<div class="row">
			<div class="column small-12">
				<h2 class="section-title featured-text">More loans for you</h2>
				<!-- row for loan cards -->

				<minimal-loan-card />
			</div>
		</div>
	</div>
</template>

<script>
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';

export default {
	components: {
		MinimalLoanCard,
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.section-title {
	margin-left: -0.5rem;
	font-weight: 400;
}

</style>
