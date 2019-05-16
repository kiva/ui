<template>
	<div class="checkout-steps">
		<ul class="checkout-step-list">
			<li id="basket-step" class="step first" :class="isActive('basket')">
				<p class="step-name">
					Basket
				</p>
				<span class="step-icon number-icon number-1">1</span>
			</li>
			<li id="account-step" class="step" :class="isActive('account')">
				<p class="step-name">
					Account
				</p>
				<span class="step-icon number-icon number-2">2</span>
			</li>
			<li id="payment-step" class="step" :class="isActive('payment')">
				<p class="step-name">
					Payment
				</p>
				<span class="step-icon number-icon number-2">3</span>
			</li>
			<li id="thanks-step" class="step last" :class="isActive('thanks')">
				<p class="step-name">
					Thank you!
				</p>
				<span class="step-icon checkmark">
					<kv-icon name="confirmation" />
				</span>
			</li>
		</ul>
		<div class="step-rule">
			<hr>
		</div>
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
	padding: 0  0 1.2rem;

	ul {
		list-style: none;
		display: flex;
		align-items: center;
		max-width: 40rem;
		margin: 0 auto 2rem;
		position: relative;
	}

	.checkout-step-list::before {
		content: '';
		position: absolute;
		border-top: 1px dashed $subtle-gray;
		bottom: 0.9rem;
		left: 2rem;
		right: 3rem;

		@include breakpoint(medium) {
			left: 4rem;
			right: 5rem;
		}
	}

	.step {
		text-align: center;
		flex-grow: 1;
		z-index: 10;
		font-weight: $global-weight-bold;
		color: $kiva-stroke-gray;

		.step-name {
			margin-bottom: 0.3rem;
			font-size: 0.9rem;

			@include breakpoint(large) {
				font-size: inherit;
			}
		}

		.step-icon {
			display: block;
			margin: 0 auto;
			width: 2rem;
			height: 2rem;

			&.number-icon {
				background: $kiva-bg-lightgray;
				color: $kiva-stroke-gray;
				border: 1px solid $kiva-stroke-gray;
				border-radius: 1rem;
				font-size: 1.2rem;
				text-align: center;
				line-height: 1.825rem;
			}

			.icon {
				// width: 1.9rem;
				width: rem-calc(30px);
				// height: 1.9rem;
				height: rem-calc(30px);
				// border-radius: 1.9rem;
				fill: $kiva-bg-lightgray;
			}
		}

		.checkmark {
			// background: white;
			background: $kiva-stroke-gray;
			// border-radius: 1.9rem;
			border-radius: rem-calc(30px);
			border: 1px solid $kiva-stroke-gray;
		}

		&.active {
			color: $kiva-green;

			.step-icon {
				&.number-icon {
					background: $kiva-green;
					color: $white;
					border: 1px solid $kiva-green;
				}

				.icon {
					width: 2rem;
					height: 2rem;
					fill: $kiva-green;
				}
			}
		}
	}
}
</style>
