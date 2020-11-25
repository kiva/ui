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
						<!-- TODO: replace this svg with a contentful image -->
						<!-- eslint-disable -->
						<svg
							class="indicator__image"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 102 41"
						>
							<path d="M12.197 24.743l.082 3.553a.678.678 0 01-.696.694l-2.908-.09.403 10.215a.677.677 0 01-.568.695l-3.708.593c-.036.004-.07.009-.106.009a.68.68 0 01-.436-.16.683.683 0 01-.238-.512l-.047-10.93-2.216-.244a.678.678 0 01-.601-.637l-.166-3.131a.685.685 0 01.184-.504.67.67 0 01.49-.212h9.856c.367 0 .666.294.675.661zM26.115 24l-1.355-.183a1.588 1.588 0 00-1.794 1.543l-.142 6.558c-.002.131-.02.26-.052.388l-.357 1.438a1.745 1.745 0 01-2.933.814l-.154-.154a1.76 1.76 0 01-.505-1.1l-.177-2.189a.54.54 0 01-.003-.089l.073-5.272a1.58 1.58 0 00-1.507-1.61l-1.654-.08a1.575 1.575 0 00-1.17.436 1.595 1.595 0 00-.49 1.15v8.194c0 .553.147 1.1.427 1.578l.697 1.188a7.077 7.077 0 004.946 3.413l.57.094a3.099 3.099 0 001.395-.085l2.466-.739a3.114 3.114 0 001.872-1.562l.956-1.872c.227-.445.347-.946.342-1.445l-.074-8.853a1.608 1.608 0 00-1.377-1.561zm13.694 11.28h-.002l-4.397.018-.018-1.009 4.265-.65a.675.675 0 00.571-.712l-.171-2.731a.675.675 0 00-.755-.63l-3.964.488-.124-1.798 4.39-.329a.674.674 0 00.618-.585l.34-2.56a.678.678 0 00-.735-.762l-8.5.853a.676.676 0 00-.608.687l.254 13.486a.676.676 0 00.675.665h.014l8.413-.172a.67.67 0 00.488-.225.684.684 0 00.171-.512l-.255-2.903a.674.674 0 00-.67-.619zm13.817-2.589a5.094 5.094 0 00-2.469-2.635l-1.569-.767a.242.242 0 01-.11-.104l-.163-.288a.257.257 0 01.136-.37l.789-.284a.25.25 0 01.175 0l.572.215a1.61 1.61 0 002.053-.917l.348-.883c.172-.432.15-.914-.063-1.327a1.603 1.603 0 00-1.034-.829l-1.167-.298a8.02 8.02 0 00-4.35.109 3.94 3.94 0 00-2.354 2l-.164.331a4.615 4.615 0 00-.193 3.654l.275.735c.305.824 1.13 1.73 1.92 2.11l1.515.732c.023.011.041.022.06.038l1.348 1.202a.257.257 0 01-.163.45 6.175 6.175 0 01-2.937-.652 1.596 1.596 0 00-2.129.672l-.643 1.19c-.21.388-.251.85-.114 1.27.138.42.444.768.843.958l.4.189c.1.048.205.084.314.111l2.25.537a6.309 6.309 0 004.149-.43 5.073 5.073 0 002.568-2.744 5.102 5.102 0 00-.033-3.834l-.06-.14zm15.64-4.827l-.495-.676a6.842 6.842 0 00-1.908-1.78l-.449-.279a6.881 6.881 0 00-3.295-1.037l-.432-.02a7.013 7.013 0 00-1.02.025l-3.892.391a.674.674 0 00-.607.675l.04 13.74c0 .37.296.67.666.675l4.597.06h.09a6.88 6.88 0 003.05-.715l.984-.49a6.848 6.848 0 002.922-2.767l.179-.312a6.964 6.964 0 00.839-4.337 6.95 6.95 0 00-1.269-3.153zm12.671-3.21a.67.67 0 00-.658-.42l-3.934.205a.677.677 0 00-.592.424l-5.532 13.829a.68.68 0 00.608.928l3.78.106h.018c.286 0 .542-.18.637-.451l1.052-3.005 3.562.016 1.61 2.906c.12.214.345.347.59.347h.013l3.893-.08a.678.678 0 00.611-.933l-5.658-13.872zm19.912-.307a.673.673 0 00-.596-.358h-.008l-4.63.04a.679.679 0 00-.56.307l-2.046 3.147-1.776-2.849a.69.69 0 00-.585-.318l-4.59.08a.673.673 0 00-.596.387.683.683 0 00.076.709l5.303 6.847-.157 6.713a.684.684 0 00.195.493c.126.13.3.199.477.199h.014l4.017-.083a.677.677 0 00.662-.684l-.08-6.866 4.838-7.066a.674.674 0 00.042-.698zM27.742 1.081h-5.108a.674.674 0 00-.491.213.696.696 0 00-.19.506l.84 18.067a.69.69 0 00.223.476.673.673 0 00.456.176h.037l4.627-.252a.684.684 0 00.644-.698l-.357-17.813a.683.683 0 00-.681-.675zm11.735 18.8c.1.247.332.412.597.425l4.214.212h.034a.684.684 0 00.648-.47l5.91-17.85a.685.685 0 00-.608-.9l-4.118-.24a.682.682 0 00-.687.463l-3.201 9.468L38.228.934a.685.685 0 00-.65-.43l-4.967.128a.678.678 0 00-.553.312.69.69 0 00-.06.635l7.479 18.303zm16.022.637h.015l4.531-.105a.685.685 0 00.668-.703l-.42-17.879a.682.682 0 00-.668-.668l-4.847-.106a.687.687 0 00-.697.713l.737 18.09a.682.682 0 00.68.658zm9.23-.24c.133.125.313.19.492.18l4.896-.211a.687.687 0 00.652-.725l-.412-6.874 5.184 7.555a.675.675 0 00.56.296l4.182.016h.002a.679.679 0 00.681-.709l-.683-18.571a.684.684 0 00-.825-.643l-3.9.847a.682.682 0 00-.537.682l.167 8.81-6.26-9.723a.683.683 0 00-.649-.31l-3.791.422a.687.687 0 00-.608.705l.632 17.773a.686.686 0 00.217.48zm37.198-6.808l-.077-.87c0-2.018-.109-2.482-.332-3.217l-2.581.025-2.76-.025s-2.861.043-2.861.077l-.052 3.806h.025l.024.025h.587l.818-.025 1.43.077v.101l-.022 1.02c-3.384.107-3.674-.51-4.436-1.125-.83-.67-1.947-4.12.485-5.84 2.432-1.72 5.26.186 5.26.186.16.112.387.097.526-.062.306-.46.818-1.008 1.533-1.64a49.307 49.307 0 011.711-2.233c-.648-.823-1.082-1.265-1.302-1.335-.392-.343-.92-.65-1.583-.923 0-.187-3.872-1.16-6.77-.307-8.544 2.513-7.367 10.203-7.367 10.203s-.349 6.05 5.966 8.269c.007.07.266.15.77.243.003 0 .006.003.008.003 7.127 1.973 10.665-1.429 10.665-1.429l.204-1.309c.003 0 .131-3.13.131-3.695zm-83.14 0l-.077-.87c0-2.018-.111-2.482-.333-3.217l-2.58.025-2.759-.025s-2.861.043-2.861.077l-.052 3.806h.024l.025.025h.586l.82-.025 1.429.077v.101l-.023 1.02c-3.382.107-3.673-.51-4.434-1.125-.83-.67-1.948-4.12.485-5.84 2.432-1.72 5.26.186 5.26.186.16.112.387.097.526-.062.307-.46.82-1.008 1.534-1.64a50.612 50.612 0 011.71-2.233c-.647-.823-1.08-1.265-1.302-1.335-.392-.343-.92-.65-1.582-.923 0-.187-3.872-1.16-6.77-.307-8.545 2.51-7.37 10.202-7.37 10.202s-.348 6.05 5.966 8.268c.007.071.265.151.772.244.002 0 .003.003.006.003 7.126 1.973 10.665-1.43 10.665-1.43l.205-1.308c.001 0 .13-3.13.13-3.694z" fill="#000" />
							<path d="M63.378 30.262c.352-.394.738-.722 1.237-.89 1.16-.384 2.398.543 2.253 1.896-.085.784-.458 1.429-.947 2.016-.663.796-1.47 1.418-2.34 1.97-.16.102-.27.094-.422-.004-.734-.471-1.431-.992-2.034-1.63-.499-.529-.925-1.105-1.136-1.814-.161-.537-.183-1.074.085-1.59a1.725 1.725 0 012.288-.753c.367.178.672.43.947.727.021.02.04.043.07.072z" fill="#FF7B7A" />
						</svg>
						<!-- eslint-enable -->
						<!-- <img
							class="indicator__image"
							:src="image"
							alt=""
						> -->
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
								class="appeal-banner__btn smallest rounded"
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
								class="appeal-banner__btn smallest rounded"
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
						class="appeal-banner__btn appeal-banner__btn--toggle-open smallest rounded"
						@click.native="onClickToggleBanner"
					>
						Donate
					</kv-button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
// import numeral from 'numeral';
import { expand, collapse } from '@/util/expander';

import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';

export default {
	components: {
		KvButton,
		KvIcon,
		KvProgressCircle,
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
		image: {
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
		border-radius: rem-calc(8);
		background: #fff;
		color: $kiva-icon-green;
		border-color: $kiva-icon-green;
		box-shadow: none;
		width: 100%;
		margin-bottom: 0;

		&:hover,
		&:focus {
			color: #fff;
			background: $kiva-green;
		}

		&--toggle-open {
			color: #fff;
			background: $kiva-icon-green;

			&:hover,
			&:focus {
				background: #fff;
				color: $kiva-icon-green;
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
			fill: $dark-charcoal;
		}
	}

	&__close-btn-icon {
		width: rem-calc(16);
		height: rem-calc(16);
	}

	&__body {
		margin-bottom: 1rem;
	}

	&--open {
		padding-top: rem-calc(16);
		padding-bottom: rem-calc(16);

		@include breakpoint(large) {
			padding-top: rem-calc(24);
			padding-bottom: rem-calc(24);
		}
	}

	&--closed {
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

	&__image {
		padding: 20%;
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
