<template>
	<div>
		<!-- open banner -->
		<div
			class="appeal-banner appeal-banner--open"
			v-if="isOpen"
			key="openBanner"
		>
			<div class="row align-center align-middle relative">
				<div class="appeal-banner__indicator shrink small-12 columns">
					<div
						class="indicator"
						:class="isLoading ? 'indicator--is-loading' : ''"
					>
						<kv-progress-circle
							class="indicator__progress-circle"
							:stroke-width="12"
							:value="goalPercent"
							:arc-scale=".8"
							:rotate="36"
							:show-number="false"
						/>
						<kv-contentful-img
							v-if="imageUrl"
							class="indicator__image"
							:contentful-src="imageUrl"
							alt=""
							fallback-format="gif"
							:height="164"
							:width="164"
						/>
						<div
							class="indicator__goal-status"
							v-html="goalStatus"
						>
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
							<kv-button
								class="appeal-banner__btn rounded"
								@click.native="onClickAmountBtn(buttonAmount)"
								v-kv-track-event="[
									'promo',
									'click-amount-btn',
									'AppealBanner',
									buttonAmount,
									buttonAmount
								]"
							>
								${{ buttonAmount }}
							</kv-button>
						</li>
						<li class="appeal-banner__amount-item--other">
							<kv-button
								class="appeal-banner__btn rounded"
								to="/donate/supportus"
								v-kv-track-event="['promo', 'click-other', 'AppealBanner', 0, 0]"
							>
								Other
							</kv-button>
						</li>
					</ul>
					<button
						class="appeal-banner__close-btn"
						@click="onClickToggleBanner"
						v-kv-track-event="[
							'promo',
							'click-appeal-banner-close',
							'x',
						]"
					>
						<kv-icon
							class="appeal-banner__close-btn-icon"
							name="small-x"
							title="Close banner"
							:from-sprite="true"
						/>
					</button>
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
					<kv-button
						class="appeal-banner__btn appeal-banner__btn--toggle-open rounded"
						@click.native="onClickToggleBanner"
						v-kv-track-event="[
							'promo',
							'click-appeal-banner-open',
							'Donate'
						]"
					>
						Donate
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import numeral from 'numeral';
import smoothReflow from 'vue-smooth-reflow';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

export default {
	components: {
		KvButton,
		KvIcon,
		KvProgressCircle,
		KvContentfulImg
	},
	mixins: [smoothReflow],
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
		imageUrl: {
			type: String,
			default: ''
		},
		isOpen: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		isLoading() {
			return this.amountRaised === null;
		},
		goalPercent() {
			if (!this.targetAmount || !this.amountRaised) {
				return 0;
			}
			const percent = Math.floor((this.amountRaised / this.targetAmount) * 100);
			return percent > 100 ? 100 : percent;
		},

		goalStatus() {
			if (this.isLoading) {
				return 'loading...';
			}
			if (this.goalPercent === 100) {
				return 'Goal <br />reached!';
			}
			const nearestThousand = parseFloat(Number((this.targetAmount - this.amountRaised) / 1000).toPrecision(3));
			// const nearestThousand = numeral((this.targetAmount - this.amountRaised) / 1000).format('0.[00]');
			return `$${nearestThousand}k <br />to goal`;
		}
	},
	methods: {
		onClickAmountBtn(amount) {
			this.$emit('amount-selected', Number(amount));
		},
		onClickToggleBanner() {
			this.$emit('toggle-banner', !this.isOpen);
		},
	},
	mounted() {
		this.$smoothReflow();
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';

.appeal-banner {
	// border-bottom: 1px solid $twilight;
	letter-spacing: -0.02em;

	&__indicator {
		margin-bottom: rem-calc(32);
		@include breakpoint('large') {
			margin: 0;
		}
	}

	&__content {
		max-width: rem-calc(381);
		text-align: center;

		@include breakpoint('large') {
			text-align: left;
		}
	}

	&__title {
		margin-bottom: rem-calc(4);
	}

	&__amount-list {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		margin: 0;
	}

	&__amount-item {
		flex: 1;
		margin-right: rem-calc(8);
		margin-bottom: rem-calc(8);

		&--other {
			margin-right: 0;
			flex-grow: 2;
		}
	}

	&__btn {
		font-size: rem-calc(14);
		padding: 0.5rem 1rem;
		border-radius: rem-calc(8);
		background: $white;
		color: $kiva-green;
		box-shadow: none;
		width: 100%;
		margin-bottom: 0;
		border: 1px solid $kiva-green;

		@include breakpoint(large) {
			padding: 0.75rem 1.5rem;
		}

		&:hover,
		&:focus {
			color: $kiva-green;
			background: $kiva-bg-darkgray;
		}

		&--toggle-open {
			color: $white;
			background: $kiva-green;

			&:hover,
			&:focus {
				background: darken($kiva-green, 10%);
			}
		}
	}

	&__close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: rem-calc(32);
		height: rem-calc(32);
		top: 0;
		right: 1rem;
		border-radius: rem-calc(12);
		fill: $kiva-text-medium;

		&:hover,
		&:focus {
			background-color: $kiva-bg-darkgray;
			color: $white;
			fill: $dark-charcoal;
		}
	}

	&__close-btn-icon {
		width: rem-calc(16);
		height: rem-calc(16);
	}

	&__body {
		margin-bottom: 1rem;
		white-space: pre-wrap;

		&::v-deep {
			a {
				color: $kiva-text-dark;
			}
		}
	}

	&--open {
		padding-top: rem-calc(16);
		padding-bottom: rem-calc(16);
		background-color: #EAF6F0;

		@include breakpoint(large) {
			padding-top: rem-calc(24);
			padding-bottom: rem-calc(24);
		}
	}

	&--closed {
		background-color: #EAF6F0;

		.appeal-banner__content {
			padding-top: rem-calc(8);
			padding-bottom: rem-calc(8);
			text-align: left;

			@include breakpoint(large) {
				padding-top: rem-calc(12);
				padding-bottom: rem-calc(12);
			}
		}

		.appeal-banner__title {
			margin: 0;
			color: $kiva-text-dark;
		}
	}
}

.indicator {
	position: relative;
	width: rem-calc(164);
	height: rem-calc(164);

	&__progress-circle,
	&__image {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	&__progress-circle {
		z-index: 2;

		--kv-progress-circle-foreground-color: #{$kiva-green};
	}

	&__goal-status {
		$width: 5rem;

		font-weight: bold;
		font-size: rem-calc(12);
		line-height: 1.2;
		text-align: center;
		width: $width;
		margin: 0 auto;
		position: absolute;
		bottom: 0;
		left: calc(50% - #{$width / 2});
		z-index: 2;
	}

	&--is-loading {
		.indicator__image {
			opacity: 0.3;
		}
	}
}

.relative {
	position: relative;
}
</style>
