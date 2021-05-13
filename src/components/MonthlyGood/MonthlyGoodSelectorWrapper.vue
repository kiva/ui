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
			class="monthly-good-selector section show-for-small-only"
			v-if="isMobile"
		>
			<monthly-good-selector-mobile />
		</section>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';

import MonthlyGoodSelector from '@/components/MonthlyGood/MonthlyGoodSelector';
import MonthlyGoodSelectorMobile from '@/components/MonthlyGood/MonthlyGoodSelectorMobile';

export default {
	components: {
		MonthlyGoodSelector,
		MonthlyGoodSelectorMobile,
	},
	data() {
		return {
			isSticky: false,
			initialBottomPosition: 0,
			mgStickBarOffset: 0,
			isMobile: false
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
			// temporary set to not sticky to calculate these values based on original element position on page
			this.isSticky = false;
			this.mgStickBarOffset = 0;

			// Initial position down the page of selector
			const { top } = this.$el.getElementsByClassName('monthly-good-selector')[0].getBoundingClientRect();
			const heightOfMgSelector = this.$el.getElementsByClassName('monthly-good-selector')[0].offsetHeight;
			const scrollPositionOfPage = window.scrollY;

			this.initialBottomPosition = top + scrollPositionOfPage + heightOfMgSelector;
			this.onScroll();
		},
		setMgStickyBarOffset() {
			let offsetHeight = 0;
			const basketBar = document.getElementsByClassName('basket-bar')[0];
			const cookieBanner = document.getElementById('onetrust-banner-sdk');
			// Height of basket bar if present
			if (typeof basketBar !== 'undefined' && basketBar.clientHeight > 0) {
				offsetHeight = basketBar.clientHeight;
			}
			// Height of Cookie banner if present (overrides basket bar if present)
			if (cookieBanner && cookieBanner.clientHeight > 0) {
				offsetHeight = cookieBanner.clientHeight;
			}
			// set offset
			this.mgStickBarOffset = offsetHeight;
		},
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 480;
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.throttledScroll);
		window.removeEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
			this.determineIfMobile();
		}, 200));
	},
	mounted() {
		window.addEventListener('scroll', this.throttledScroll);
		window.addEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
			this.determineIfMobile();
		}, 200));

		this.initStickyBehavior();
		this.determineIfMobile();
	},
};
</script>
<style lang="scss">
@import 'settings';
// Hack to allow the entire footer to still be visible when the MG sticky is active
footer.www-footer {
	padding-bottom: 17rem;
	@include breakpoint(large) {
		padding-bottom: 15rem;
	}

	@include breakpoint(xlarge) {
		padding-bottom: 10rem;
	}

	@include breakpoint(xxlarge) {
		padding-bottom: 8rem;
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
}
</style>
