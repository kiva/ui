<template>
	<transition
		@enter="enter"
		@leave="leave"
		:css="false"
		mode="out-in"
	>
		<!-- open banner -->
		<div
			class="appeal-banner appeal-banner--open"
			v-if="isOpen"
			key="openBanner"
		>
			<div class="row align-center">
				<div class="appeal-banner__swashie shrink small-12 columns">
					<div class="swashie">
						<kv-progress-circle
							class="swashie__progress-circle swashie__progress-circle--background"
							:stroke-width="12"
							:value="80"
							:show-number="false"
							aria-hidden="true"
						/>
						<kv-progress-circle
							class="swashie__progress-circle swashie__progress-circle--foreground"
							:stroke-width="12"
							:value="parseInt(goalPercent * .8)"
							:show-number="false"
						/>
						<swashie-face
							class="swashie__face"
							:percent-full="goalPercent"
							:show-liquid="false"
						/>
						<div class="swashie__goal-status" v-html="goalStatus">
						</div>
					</div>
				</div>
				<div class="appeal-banner__content small-12 columns">
					<h3 class="appeal-banner__title strong" v-html="headline"></h3>
					<div class="appeal-banner__body" v-html="body"></div>
					<ul class="appeal-banner__amount-list">
						<li v-for="(buttonAmount, index) in buttonAmounts"
							:key="`amount-${index}`"
							class="appeal-banner__amount-item"
						>
							<fifteen-years-button
								class="appeal-banner__btn"
								@click="onClickAmountBtn(buttonAmount)"
								v-kv-track-event="[
									'promo',
									'click-amount-btn',
									'AppealBanner',
									buttonAmount,
									buttonAmount
								]"
							>
								${{ buttonAmount }}
							</fifteen-years-button>
						</li>
						<li class="appeal-banner__amount-item--other">
							<fifteen-years-button
								class="appeal-banner__btn"
								to="/donate/supportus"
								v-kv-track-event="['promo', 'click-other', 'AppealBanner', 0, 0]"
							>
								Other
							</fifteen-years-button>
						</li>
					</ul>
				</div>
				<div class="small-12 columns text-right">
					<button
						class="appeal-banner__later-btn"
						@click="onClickToggleBanner"
					>
						Maybe Later
					</button>
				</div>
			</div>
		</div>
		</div>
		<!-- closed banner -->
		<div
			class="appeal-banner appeal-banner--closed"
			v-if="!isOpen"
			key="closedBanner"
		>
			<div class="appeal-banner__content row align-middle">
				<div class="columns">
					<h4 class="appeal-banner__title" v-html="headline"></h4>
				</div>
				<div class="shrink columns">
					<fifteen-years-button
						class="appeal-banner__btn appeal-banner__btn--toggle-open"
						@click="onClickToggleBanner"
					>
						Donate
					</fifteen-years-button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import numeral from 'numeral';
import { expand, collapse } from '@/util/expander';

import FifteenYearsButton from '@/components/15Years/15YearsButton';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';
import SwashieFace from '@/components/15Years/SwashieFace';

export default {
	components: {
		FifteenYearsButton,
		KvProgressCircle,
		SwashieFace
	},
	props: {
		targetAmount: {
			type: Number,
			default: null,
		},
		amountRaised: {
			type: Number,
			default: null,
		},
		buttonAmounts: {
			type: Array,
			default() { return [20, 35, 50]; },
		},
		headline: {
			type: String,
			default: '',
		},
		body: {
			type: String,
			default: '',
		},
		isOpen: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		goalPercent() {
			if (!this.targetAmount || !this.amountRaised) {
				return 0;
			}
			const percent = Math.floor((this.amountRaised / this.targetAmount) * 100);
			return percent > 100 ? 100 : percent;
		},
		goalStatus() {
			if (this.amountRaised === null) {
				return 'loading...';
			}
			if (this.goalPercent === 100) {
				return 'Goal <br />reached!';
			}
			const nearestThousand = numeral((this.targetAmount - this.amountRaised) / 1000).format('0.[00]');
			return `$${nearestThousand}k <br />‘til goal`;
		}
	},
	methods: {
		onClickAmountBtn(amount) {
			this.$emit('amount-selected', Number(amount));
		},
		onClickToggleBanner() {
			this.$emit('toggle-banner', !this.isOpen);
		},
		// slide up / down transitions
		enter(el, done) {
			expand(el, {
				easing: 'ease-in-out',
				done
			});
		},
		leave(el, done) {
			collapse(el, {
				easing: 'ease-in-out',
				done
			});
		},
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';
@import 'components/15-years/15-years';

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

$teal: #319788;
$beige: #FFFAF2;

.appeal-banner {
	border-bottom: 1px solid $twilight;
	background-color: $beige;

	&__content {
		max-width: rem-calc(490);
	}

	&__amount-list {
		display: flex;
		list-style: none;
		margin: 0;
	}

	&__amount-item {
		flex-grow: 1;
		margin-right: 1rem;

		&--other {
			margin-right: 0;
			flex-grow: 2;
		}
	}

	&__btn {
		background: transparent;
		border: rem-calc(1) solid $twilight;
		padding: 0.5rem;
		width: 100%;

		&--toggle-open {
			background: $teal;
			color: #fff;
			width: rem-calc(100);
		}
	}

	&__later-btn {
		@include link();

		margin-top: 2rem;
	}

	&__body {
		margin-bottom: 1rem;
	}

	&--open {
		.appeal-banner__content,
		.appeal-banner__swashie {
			padding-top: rem-calc(16);
			padding-bottom: rem-calc(16);

			@include breakpoint(large) {
				padding-top: rem-calc(54);
				padding-bottom: rem-calc(54);
			}
		}
	}

	&--closed {
		.appeal-banner__content {
			padding-top: rem-calc(8);
			padding-bottom: rem-calc(8);

			@include breakpoint(large) {
				padding-top: rem-calc(24);
				padding-bottom: rem-calc(24);
			}
		}

		.appeal-banner__title {
			margin: 0;
		}
	}
}

.swashie {
	position: relative;
	width: 9.5rem;
	height: 9.5rem;

	&__progress-circle,
	&__face {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	&__face {
		padding: 10%;
	}

	&__progress-circle {
		--kv-progress-circle-background-color: transparent;

		transform: rotate(36deg);
	}

	&__progress-circle--background {
		--kv-progress-circle-foreground-color: #E1DBD2;
	}

	&__progress-circle--foreground {
		--kv-progress-circle-foreground-color: #{$teal};

		z-index: 2;
	}

	&__goal-status {
		$width: 5rem;

		font-weight: bold;
		font-size: rem-calc(12);
		line-height: 1.2;
		color: $teal;
		text-align: center;
		width: $width;
		margin: 0 auto;
		position: absolute;
		bottom: 0;
		left: calc(50% - #{$width / 2});
	}
}
</style>
