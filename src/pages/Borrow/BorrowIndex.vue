<template>
	<www-page>
		<div class="row">
			<div class="container">
				<div class="small-12 columns">
					<borrow-intro v-if="isIntro" />
					<router-view v-else />
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import BorrowIntro from '@/pages/Borrow/BorrowIntro';

export default {
	components: {
		BorrowIntro,
		WwwPage
	},
	metaInfo: {
		title: 'Borrow Pre-application',
	},
	computed: {
		isIntro() {
			return this.$route.path === '/borrow/pre-application';
		}
	}
};
</script>

<style lang="scss">
// These styles are used on all 3 slides

@import 'settings';

.container {
	margin: 4rem 0;

	@include breakpoint(large) {
		border-radius: rem-calc(8);
		box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.15); // TODO: make the same as MonthlyGoodSetupPageVariant
		padding: 4rem 4rem;
		margin: 4rem -4rem;
		width: calc(100% + 8rem);
	}
}

.checkout-steps {
	max-width: 35rem;
	margin: 0 auto 4rem auto;
}

.intro {
	margin-bottom: 2rem;

	&__graphic {
		display: block;
		width: 100%;
		max-width: rem-calc(505);
		margin: 0 auto 3rem;
	}

	&__title {
		@include large-text();

		margin-bottom: 1rem;
	}

	&__subtitle {
		@include featured-text();

		line-height: 1.2;
		margin-bottom: 0.5rem;
		font-weight: 700;
		text-align: center;
		color: $kiva-text-light;
	}

	&__body {
		@include medium-text();

		margin: 0 auto 2.5rem auto;
	}
}

.cta-btn {
	width: 100%;
}
</style>
