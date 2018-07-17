<template>
	<div class="checkout-steps">
		<ul>
			<li class="step first">
				<button @click="goToStep('basket')" :class="isActive">
					<p class="step-name">My basket</p>
					<span class="step-icon number-1">1</span>
				</button>
			</li>
			<li class="step">
				<button @click="goToStep('payment')" :class="isActive">
					<p class="step-name">Review &amp; pay</p>
					<span class="step-icon number-2">2</span>
				</button>
			</li>
			<li class="step last">
				<button @click="goToStep('thanks')" :class="isActive">
					<p class="step-name">Thank you!</p>
					<span class="step-icon checkmark">
						<kv-icon name="confirmation" />
					</span>
				</button>
			</li>
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
		}
	},
	computed: {
		isActive() {
			return 'active';
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.checkout-steps {
	display: block;
	width: 100%;
	border-bottom: 2px solid $kiva-stroke-gray;
	padding: 2rem 1rem;

	ul {
		list-style: none;
		display: flex;
		align-items: center;
		flex-direction: column;

		li {
			padding: 0 1rem;
		}
	}

	.step {
		text-align: center;

		// .step-name {

		// }

		.step-icon {
			width: rem-calc(32);
			height: rem-calc(32);
		}
	}
}
</style>
