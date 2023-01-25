<template>
	<div class="appeal-15-wrapper">
		<transition
			@enter="enter"
			@leave="leave"
			mode="out-in"
		>
			<!-- open banner -->
			<div class="appeal-15-row appeal-15-row--open row align-center" v-if="open" key="openBanner">
				<div class="shrink small-12 columns">
					<!-- <div class="swashie">
						<kv-progress-circle
							class="swashie__progress-circle"
							:value="fifteenYearGoalPercent"
							:show-number="fifteenYearGoalPercent > 0"
						/>
						<swashie-face class="swashie__face" :percent-full="fifteenYearGoalPercent" />
					</div> -->
					<video
						class="swashie"
						src="@/assets/media/15-years/swashie-party.mp4"
						autoplay
						loop
						muted
						playsinline
					>
					</video>
				</div>
				<div class="appeal-15-header small-12 columns">
					<h4 v-html="bannerHeadline" class="appeal-15-header__title appeal-15-header__title--open">
					</h4>
					<div v-html="bannerBody">
					</div>
					<fifteen-years-button class="appeal-15-header__cta_button" :to="ctaLink">
						{{ ctaButtonText }}
					</fifteen-years-button>
					<fifteen-years-button variant="black" @click.prevent.stop="shrinkAppeal">
						{{ shrinkButtonText }}
					</fifteen-years-button>
				</div>
			</div>
			<!-- minimal banner -->
			<div class="appeal-15-row appeal-15-row--closed row align-middle" v-if="!open" key="closedBanner">
				<div class="columns">
					<h4 class="appeal-15-header__title appeal-15-header__title--closed" v-html="bannerHeadline">
					</h4>
				</div>
				<div class="shrink columns">
					<fifteen-years-button
						variant="gray"
						class="appeal-15-header__cta_button appeal-15-header__cta_button--closed-small"
						:to="ctaLink"
					>
						{{ ctaButtonText }}
					</fifteen-years-button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
// import gsap from 'gsap';
// import { gql } from '@apollo/client';
import { expand, collapse } from '@/util/expander';

import FifteenYearsButton from '@/components/15Years/15YearsButton';
// import KvProgressCircle from '@/components/Kv/KvProgressCircle';
// import SwashieFace from '@/components/15Years/SwashieFace';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

// const recentFundedLoans = gql`query recentFundedLoans($start: Date!) {
// 	general {
// 		kivaStats {
// 			numRecentFundedLoans(start: $start)
// 		}
// 	}
// }`;

export default {
	name: 'AppealBanner15',
	components: {
		FifteenYearsButton,
		// KvProgressCircle,
		// SwashieFace
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		appealBannerContent: {
			type: Object,
			default: () => {},
		},
		ctaLink: {
			type: String,
			default: '/get-started',
		},
	},
	data() {
		return {
			open: true,
			fifteenYearGoalPercent: 0
		};
	},
	computed: {
		bannerHeadline() {
			const appealHeadline = this.appealBannerContent?.richText || '';
			// contentful wraps all richText fields with a <p> tag,
			// which makes them difficult to style as headers,
			// this removes that wrapping tag
			const options = {
				renderNode: {
					paragraph: (node, next) => `${next(node.content)}`
				}
			};
			if (!this.open) {
				return this.truncateStringToNumberOfWords(documentToHtmlString(appealHeadline, options), 5);
			}
			return documentToHtmlString(appealHeadline, options);
		},
		bannerBody() {
			const appealBody = this.appealBannerContent?.additionalContent?.[0].fields.richText || '';
			return documentToHtmlString(appealBody);
		},
		ctaButtonText() {
			const buttonText = this.appealBannerContent?.dataObject?.ctaButtonText || '';
			return buttonText;
		},
		shrinkButtonText() {
			const buttonText = this.appealBannerContent?.dataObject?.shrinkButtonText || '';
			return buttonText;
		},
	},
	created() {
		if (this.cookieStore.get('appeal_banner_15_shrunk')) {
			this.open = false;
		} else {
			// open banner
			this.open = true;
		}
	},
	// mounted() {
	// 	// Get recent funded loans data
	// 	this.apollo.query({
	// 		query: recentFundedLoans,
	// 		variables: {
	// 			start: '2020-10-01'
	// 		}
	// 	}).then(({ data }) => {
	// 		// Default to 1 to avoid division by 0
	// 		const fundedGoal = this.appealBannerContent?.dataObject?.kiva15FundedLoansGoal || 1;
	// 		const numRecentFundedLoans = data?.general?.kivaStats?.numRecentFundedLoans || 0;
	// 		if (numRecentFundedLoans !== 0) {
	// 			const vm = this;
	// 			const percentFull = { val: 0 };

	// 			gsap.to(percentFull, 1, {
	// 				val: (numRecentFundedLoans / fundedGoal) * 100,
	// 				roundProps: 'val',
	// 				onUpdate() {
	// 					vm.fifteenYearGoalPercent = percentFull.val;
	// 				}
	// 			});
	// 		}
	// 	});
	// },
	methods: {
		shrinkAppeal() {
			this.cookieStore.set('appeal_banner_15_shrunk', true, { path: '/' });
			this.open = false;
		},
		truncateStringToNumberOfWords(string, numberOfWords) {
			return string.split(' ').splice(0, numberOfWords).join(' ');
		},
		// slide up / down transitions
		enter(el) {
			expand(el, {
				easing: 'ease-in-out',
			});
		},
		leave(el) {
			collapse(el, {
				easing: 'ease-in-out',
			});
		},
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';
@import 'components/15-years/15-years';

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

h4 {
	@include h4();
}

p {
	@include body-text();
}

a {
	@include link();
}

.appeal-15-wrapper {
	border-bottom: 1px solid $twilight;
	background-color: #FFF;
}

.appeal-15-row {
	&--open {
		& > div {
			padding-top: rem-calc(16);
			padding-bottom: rem-calc(16);

			@include breakpoint(large) {
				padding-top: rem-calc(54);
				padding-bottom: rem-calc(54);
			}
		}
	}

	&--closed {

		@include breakpoint(small only) {
			background-color: $mint;
		}

		& > div {
			padding-top: rem-calc(16);
			padding-bottom: rem-calc(16);

			@include breakpoint(large) {
				padding-top: rem-calc(24);
				padding-bottom: rem-calc(24);
			}
		}
	}
}

.appeal-15-header {
	max-width: rem-calc(490);

	&__cta_button {
		margin: 0;
		@include breakpoint(large) {
			margin: 0 1.25rem 0 0.25rem;
		}

		&--closed-small {
			@include breakpoint(small only) {
				background-color: $offwhite;
				color: $twilight;
				border-color: $offwhite;

				&:hover {
					background-color: $twilight;
					color: $offwhite;
					border-color: $twilight;
				}
			}
		}
	}

	.fifteen-yr-button {
		display: block;
		width: 100%;
		margin-bottom: 1rem;

		@include breakpoint(large) {
			width: auto;
			display: inline-block;
		}
	}

	&__title {
		&--closed {
			margin-bottom: 0;
		}

		&--open {
			max-width: rem-calc(455);
			margin-bottom: 1.5rem;
		}
	}

	::v-deep p {
		margin-bottom: 1.5rem;
	}
}

.swashie {
	// position: relative;
	// width: rem-calc(150);
	// height: rem-calc(150);
	// margin: 0.5rem 0 1rem 0;

	// &__progress-circle,
	// &__face {
	// 	position: absolute;
	// 	z-index: 1;
	// 	width: 100%;
	// 	height: 100%;
	// }

	// &__progress-circle {
	// 	--kv-progress-circle-foreground-color: #{$twilight};
	// }

	// &__face {
	// 	padding: 10%;
	// }

	width: rem-calc(250);
	height: rem-calc(250);
	margin: -2.25rem -1.75rem 1rem;
}
</style>
