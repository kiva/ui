<template>
	<div class="checkout-steps">
		<ul>
			<li class="step first">
				<a id="basket-step" @click.prevent="goToStep('basket')" :class="isActive('basket')">
					<p class="step-name">My basket</p>
					<span class="step-icon number-icon number-1">1</span>
				</a>
			</li>
			<li class="step">
				<a id="payment-step" @click.prevent="goToStep('payment')" :class="isActive('payment')">
					<p class="step-name">Review &amp; pay</p>
					<span class="step-icon number-icon number-2">2</span>
				</a>
			</li>
			<li class="step last">
				<a id="thanks-step" @click.prevent="goToStep('thanks')" :class="isActive('thanks')">
					<p class="step-name">Thank you!</p>
					<span class="step-icon checkmark">
						<kv-icon name="confirmation" />
					</span>
				</a>
			</li>
			<li class="bar"></li>
		</ul>
		<div class="step-rule"></div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	props: {
		currentStep: {
			type: String,
			default: 'basket'
		}
	},
	components: {
		KvIcon
	},
	methods: {
		goToStep(step) {
			this.$emit('navigate-to-step', step);
		},
		isActive(step) {
			return step === this.currentStep ? 'active' : '';
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.checkout-steps {
	display: block;
	width: 100%;
	border-bottom: 2px solid $kiva-stroke-gray;
	padding: 1.2rem 0;

	ul {
		list-style: none;
		display: flex;
		align-items: center;
		max-width: rem-calc(400);
		margin: 0 auto;
		position: relative;

		.bar {
			display: block;
			width: 69%;
			border-top: 2px solid $kiva-stroke-gray;
			position: absolute;
			bottom: 1rem;
			z-index: 1;
			left: 12%;
		}
	}

	.step {
		text-align: center;
		flex-grow: 1;
		z-index: 10;

		a {
			font-weight: $global-weight-bold;
			color: $kiva-stroke-gray;
			width: rem-calc(110);

			&:hover,
			&:active {
				text-decoration: none;
			}

			.step-name {
				margin-bottom: 0.3rem;
			}

			.step-icon {
				display: block;
				margin: 0 auto;
				width: 2.2rem;
				height: 2.2rem;

				&.number-icon {
					background: $kiva-bg-lightgray;
					color: $kiva-stroke-gray;
					border: 2px solid $kiva-stroke-gray;
					border-radius: 1.1rem;
					font-size: 1.2rem;
					text-align: center;
					line-height: 2rem;
				}

				.icon {
					width: 2.2rem;
					height: 2.2rem;
					// fill: $kiva-bg-lightgray;
					fill: $kiva-stroke-gray;
				}
			}

			&.active {
				color: $kiva-green;

				.step-icon {
					&.number-icon {
						background: $kiva-green;
						color: $white;
						border: 2px solid $kiva-green;
					}

					.icon {
						width: 2.2rem;
						height: 2.2rem;
						fill: $kiva-green;
					}
				}
			}
		}
	}
}
</style>
