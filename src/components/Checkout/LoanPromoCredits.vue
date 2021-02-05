<template>
	<div class="promo-tags">
		<template
			v-for="(promoCredit, index) in appliedPromoCredits"
		>
			<div class="promo-tags__item" :key="index">
				<span class="promo-tags__item-credit">
					<strong>{{ promoCredit.amount }} credit applied</strong>
				</span>
				<span class="promo-tags__item-sponsor">
					Sponsored by:
					<br>
					<strong>{{ promoCredit.promoFund.displayName }}</strong>
				</span>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		appliedPromoCredits: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.promo-tags {
	clear: both;
	margin: 0.375rem 0 0.5rem;

	&__item {
		font-size: 0.8rem;
		color: $kiva-text-medium;
	}

	&__item-credit {
		color: $kiva-darkgreen;
		display: inline-block;
		margin-bottom: 0.25rem;
		background: $very-light-gray;
		padding: 0.3rem 0.3rem 0.1rem;
		margin-left: -0.2rem;
		border-radius: 0.25rem;
	}

	&__item-sponsor {
		display: block;
		padding: 0.2rem 0;
	}
}
</style>
