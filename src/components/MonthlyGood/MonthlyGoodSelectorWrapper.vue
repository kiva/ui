<template>
	<div>
		<!-- MG Selector Desktop -->
		<section
			class="monthly-good-selector show-for-medium"
			:class="{ 'sticky': isSticky}"
			:style="{bottom: mgStickBarOffset + 'px'}"
		>
			<monthly-good-selector />
		</section>

		<!-- MG Selector Mobile -->
		<section
			class="monthly-good-selector section hide-for-large"
		>
			<div class="row align-center hide-for-large">
				<div class="small-10 columns">
					<kv-button
						class="classic hollow expanded"
						to="/monthlygood"
						v-kv-track-event="[
							'homepage',
							'click-mgpromo-cta',
							'Join today'
						]"
					>
						Join today <kv-icon
							class="right-arrow-icon"
							name="fat-chevron"
							:from-sprite="true"
							title="Next Loans"
						/>
					</kv-button>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';

import KvButton from '@/components/Kv/KvButton';
import MonthlyGoodSelector from '@/components/MonthlyGood/MonthlyGoodSelector';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvButton,
		KvIcon,
		MonthlyGoodSelector,
	},
	data() {
		return {
			isSticky: false,
			initialBottomPosition: 0,
			mgStickBarOffset: 0,
		};
	},
	computed: {
		throttledScroll() {
			// prevent onScroll from being called more than once every 100ms
			return _throttle(this.onScroll, 100);
		}
	},
	methods: {
		// Determine if MG desktop selector should be sticky or not
		onScroll() {
			if ((document.documentElement.scrollTop + window.innerHeight) <= this.initialBottomPosition) {
				this.isSticky = false;
			} else {
				this.isSticky = true;
				this.setMgStickyBarOffset();
			}
		},
		initStickyBehavior() {
			// Initial position down the page of element before mg selector element
			// const { bottom } = this.$el.getElementsByClassName('monthly-good-info')[0].getBoundingClientRect();
			const heightOfMgSelector = this.$el.getElementsByClassName('monthly-good-selector')[0].offsetHeight;
			const scrollPositionOfPage = window.scrollY;

			this.initialBottomPosition = scrollPositionOfPage + heightOfMgSelector;
			this.onScroll();
		},
		setMgStickyBarOffset() {
			let offsetHeight = 0;
			const basketBar = document.getElementsByClassName('basket-bar')[0];
			const cookieBanner = document.getElementsByClassName('cookie-banner-container')[0];
			// Height of basket bar if present
			if (typeof basketBar !== 'undefined' && basketBar.clientHeight > 0) {
				offsetHeight = basketBar.clientHeight;
			}
			// Height of Cookie banner if present (overrides basket bar if present)
			if (typeof cookieBanner !== 'undefined' && cookieBanner.clientHeight > 0) {
				offsetHeight = cookieBanner.clientHeight;
			}
			// set offset
			this.mgStickBarOffset = offsetHeight;
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.throttledScroll);
		window.removeEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
		}, 200));
	},
	mounted() {
		window.addEventListener('scroll', this.throttledScroll);
		window.addEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
		}, 200));
		this.initStickyBehavior();
	},
};
</script>
<style lang="scss">
@import 'settings';
// Hack to allow the entire footer to still be visible when the MG sticky is active
.www-footer {
	padding-bottom: 20rem;
	@include breakpoint(large) {
		padding-bottom: 15rem;
	}

	@include breakpoint(xlarge) {
		padding-bottom: 10rem;
	}

	@include breakpoint(xxlarge) {
		padding-bottom: 7rem;
	}
}
</style>

<style lang="scss" scoped>
@import "settings";

// utils
.section {
	position: relative;
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 2rem 0;
	}
}

.featured-loans,
.monthly-good-info {
	&__header {
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		font-weight: 500;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}

		// This text field from contentful can include an em tag or an i tag
		::v-deep em,
		::v-deep i {
			font-style: normal;
			color: $kiva-green;
		}
	}

	&__body {
		::v-deep p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();

				line-height: rem-calc(36);
			}
		}
	}
}

.monthly-good-info {
	&__block {
		display: flex;
		margin-top: 1.75rem;
	}

	&__icon-report,
	&__icon-choose {
		margin-top: 0.65rem;
		flex-shrink: 0;
	}

	&__icon-choose {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__icon-report {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__body {
		padding: 0 0.75rem 1rem 1.5rem;
		flex-grow: 1;
	}
}

.featured-loans {
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 4rem 0 2rem;
	}

	&__cta_wrapper {
		padding: 0;

		@include breakpoint(medium) {
			padding: 0 2rem;
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__body {
		margin: 2.25rem auto 0;

		@include breakpoint(medium) {
			margin: 2.25rem auto 2.25rem;
		}
	}
}

.loan-categories {
	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.how-it-works {
	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__list {
		list-style: none;
		margin-top: 1rem;
		margin-bottom: 0;
		padding: 0;
	}

	&__li {
		margin-bottom: 1rem;
	}

	&__img {
		width: rem-calc(81);
		height: rem-calc(100);
		margin: 0 auto 1rem;

		&--borrower {
			width: rem-calc(81);
		}

		&--loan {
			width: rem-calc(124);
		}

		&--repaid {
			width: rem-calc(87);
		}

		&--repeat {
			width: rem-calc(94);
		}
	}

	&__subtitle {
		font-weight: bold;

		@include breakpoint(large) {
			@include featured-text();
		}
	}
}

.statistics {
	&__img {
		width: rem-calc(235);
		margin: 0 auto 1rem;
	}

	&__header {
		font-size: 6rem;
		font-weight: bold;
		margin-bottom: 0;

		span {
			display: block;
		}
	}

	&__header-small {
		@include featured-text();

		font-weight: $global-weight-normal;
	}

	&__body {
		@include featured-text();

		margin-bottom: rem-calc(30);
	}
}

.lender-quotes {
	&__header {
		margin-bottom: 2rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	.quote-card {
		@include featured-text();

		margin: 0 auto rem-calc(25) auto;
		text-align: center;
		border-radius: 1rem;
		background: $white;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		position: relative;
		overflow: hidden;
		z-index: 1;

		@include breakpoint(large) {
			@include medium-text();
		}

		&__lender-img {
			margin: rem-calc(30) auto rem-calc(30) auto;
			width: 5.5rem;
			border-radius: 50%;

			@include breakpoint(large) {
				width: 4rem;
			}
		}

		&__quote {
			line-height: 1.3;
			margin-bottom: rem-calc(30);
		}

		&__attribution {
			line-height: 1.3;
			font-weight: bold;
			margin-bottom: 0;
			position: relative;
		}

		&__title {
			position: relative;
			margin-bottom: rem-calc(30);
		}
	}

	.quote-card:nth-child(even) {
		@include breakpoint(large) {
			margin-right: 0.9rem;
		}
	}

	.quote-card:nth-child(odd) {
		@include breakpoint(large) {
			margin-left: 0.9rem;
		}
	}
}

.final-cta {
	&__body {
		@include featured-text();

		margin-bottom: 1rem;

		@include breakpoint(large) {
			@include impact-text();

			font-weight: 300;
			margin-bottom: 2rem;
		}
	}
}

.monthly-good-selector {
	border-radius: rem-calc(20) rem-calc(20) 0 0;
	background-color: $white;

	&.sticky {
		position: fixed;
		bottom: 0;
		transition: bottom 0.4s;
		z-index: 1000;
		width: 100%;
		box-shadow: 0 -5px 80px rgba(0, 0, 0, 0.1);
	}

	.right-arrow-icon {
		width: rem-calc(21);
		height: rem-calc(23);
		transform: rotate(270deg);
		fill: $kiva-green;
		margin: 0 20px;
		position: absolute;
	}
}
</style>
