<template>
	<www-page
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="row">
			<div class="container">
				<div class="small-12 columns">
					<kv-checkout-steps
						class="checkout-steps"
						:steps="['Pre-check', 'New Account', 'Application']"
						v-if="!isIntro"
					/>

					<borrow-intro v-if="isIntro" />
					<router-view v-if="!isIntro" />
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import BorrowIntro from '@/pages/Borrow/BorrowIntro';

import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';

import { lightHeader, lightFooter } from '@/util/siteThemes';

export default {
	components: {
		BorrowIntro,
		KvCheckoutSteps,
		WwwPage
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter
		};
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
		margin: 2rem auto;
	}

	&__title {
		@include large-text();

		margin-bottom: 1rem;
	}

	&__body {
		@include medium-text();

		max-width: 43rem;
		margin: 0 auto 2.5rem auto;
	}
}

.cta-btn {
	width: 100%;
}
</style>
