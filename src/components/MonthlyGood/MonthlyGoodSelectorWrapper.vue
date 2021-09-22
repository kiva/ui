<template>
	<div>
		<!-- MG Selector Desktop -->
		<section
			:class="[
				'monthly-good-selector',
				'tw-invisible md:tw-visible',
				'tw-bg-brand-50',
				'tw-px-3 tw-py-0',
				'tw-rounded-t',
				{
					'sticky': isSticky,
					'tw-fixed tw-bottom-0 tw-w-full tw-z-sticky': isSticky,
					'tw-relative': !isSticky
				}
			]"
			:style="{ bottom: mgStickBarOffset + 'px' }"
		>
			<monthly-good-selector-desktop :pre-selected-category="preSelectedCategory" />
		</section>

		<!-- MG Selector Mobile show-for-small-only, show only after scrolling initially  -->
		<transition
			enter-active-class="tw-transition-all tw-duration-1000 tw-delay-300 tw-ease-in-out"
			enter-class="tw-translate-y-full tw-opacity-0"
			enter-to-class="tw-translate-y-0 tw-opacity-100"
		>
			<section
				:class="[
					'monthly-good-selector',
					'tw-visible md:tw-invisible',
					'tw-bg-primary',
					'tw-border-t tw-border-b tw-border-tertiary',
					'tw-px-3 tw-pt-2.5 tw-pb-3',
					'tw-text-center',
					{
						'sticky': isSticky,
						'tw-fixed tw-bottom-0 tw-w-full tw-z-sticky': isSticky,
						'tw-relative': !isSticky
					}
				]"
				:style="{ bottom: mgStickBarOffset + 'px' }"
				v-show="hasScrolled"
			>
				<monthly-good-selector-mobile
					:pre-selected-category="preSelectedCategory"
					:rich-text-content="mgMobileRichText"
				/>
			</section>
		</transition>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';

import MonthlyGoodSelectorDesktop from '@/components/MonthlyGood/MonthlyGoodSelectorDesktop';
import MonthlyGoodSelectorMobile from '@/components/MonthlyGood/MonthlyGoodSelectorMobile';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

export default {
	props: {
		/**
		 * Content group content from Contentful
		* */
		content: {
			type: Object,
			default: () => {},
		},
	},
	components: {
		MonthlyGoodSelectorDesktop,
		MonthlyGoodSelectorMobile,
	},
	data() {
		return {
			isSticky: false,
			initialBottomPosition: 0,
			mgStickBarOffset: 0,
			hasScrolled: false
		};
	},
	mixins: [
		loanGroupCategoriesMixin,
	],
	computed: {
		throttledScroll() {
			// prevent onScroll from being called more than once every 100ms
			return _throttle(this.onScroll, 100);
		},
		mgSelectorSetting() {
			return this.content?.contents?.find(
				({ contentType }) => contentType === 'uiSetting'
			) ?? {};
		},
		mgMobileRichText() {
			return this.content?.contents?.find(
				({ contentType }) => contentType === 'richTextContent'
			) ?? {};
		},
		alwaysSticky() {
			return this.mgSelectorSetting?.dataObject?.alwaysSticky ?? false;
		},
		preSelectedCategorySetting() {
			return this.mgSelectorSetting?.dataObject?.preSelectedCategory ?? null;
		},
		preSelectedCategory() {
			// Validated Category Setting
			// Check setting to make sure it is an actual category or return null
			// Must return null (no preselected category) or a valid category object
			return this.lendingCategories.find(({ value }) => value === this.preSelectedCategorySetting) ?? null;
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

			// override for always sticky behavior
			if (this.alwaysSticky) {
				this.initialBottomPosition = 0;
			} else {
				this.initialBottomPosition = top + scrollPositionOfPage + heightOfMgSelector;
			}

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
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.throttledScroll);
		window.removeEventListener('scroll', () => {
			this.hasScrolled = true;
		});
		window.removeEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
		}, 200));
	},
	mounted() {
		window.addEventListener('scroll', this.throttledScroll);
		window.addEventListener('scroll', () => {
			this.hasScrolled = true;
		});
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

.monthly-good-selector {
	&.sticky {
		// probably doable with tw, will revisit later
		box-shadow: 0 -5px 80px rgba(0, 0, 0, 0.1);
		// Temporary scss override to ensure layering over header in mobile
		z-index: 1000;
	}
}
</style>
