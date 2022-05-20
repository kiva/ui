<template>
	<www-page>
		<template>
			<kv-page-container>
				<div class="tw-mt-4">
					<h2 class="tw-text-h2 tw-mb-2">
						We found the perfect loan for you!
					</h2>
					<p class="tw-mb-4">
						Check out this Kiva loan for food in Nicaragua.
					</p>
					<div class="tw-mb-2 tw-p-2" id="carousel_exp">
						<kv-carousel
							:embla-options="{
								loop: true,
							}"
							ref="recommendedLoansCarousel"
							:multiple-slides-visible="true"
							slides-to-scroll="visible"
							slide-max-width="360px"
						>
							<template v-for="(loanId, index) in loanIds" #[`slide${index}`]>
								<recommended-loan-card
									class="tw-p-2 tw-pb-4"
									:key="loanId"
									:loan-id="loanId"
									:hide-sector-data="true"
									:show-voting="true"
								/>
							</template>
						</kv-carousel>
					</div>
				</div>
			</kv-page-container>
		</template>
	</www-page>
</template>

<script>
// import gql from 'graphql-tag';
import WwwPage from '@/components/WwwFrame/WwwPage';
import RecommendedLoanCard from '@/components/LoanCards/RecommendedLoanCard';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KvCarousel,
		KvPageContainer,
		RecommendedLoanCard,
		WwwPage
	},
	props: {
		loanIds: {
			type: Array,
			default() { return [2370373, 2373062, 2370587, 2373377, 2367870]; },
		}
	},
	data() {
		return {
			currentIndex: 0,
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

@include breakpoint(xxlarge) {
	#carousel_exp >>> section > div:nth-child(2) {
		display: none;
	}
}

#carousel_exp >>> section > div:nth-child(1) {
	column-gap: 1rem !important;
}

#carousel_exp >>> section > div:nth-child(1) > div {
	max-width: 32% !important;
}
</style>
