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
					<div>
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
			default() { return [2370373, 2373062, 2370587]; },
		}
	},
	data() {
		return {
			currentIndex: 0,
		};
	},
	computed: {
		singleSlideWidth() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
			// handle tiny screens
			if (viewportWidth < 414) {
				return `${viewportWidth - 80}px`;
			}
			if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
			if (viewportWidth >= 768 && viewportWidth < 1024) return '336px';
			return '336px';
		},
	},
};
</script>
