<template>
	<div class="checkout-steps">
		<ul>
			<li class="active arrow">
				<button @click="goToStep('basket')">My basket</button>
			</li>
			<li class="arrow">
				<button @click="goToStep('payment')">Review &amp; pay</button>
			</li>
			<li class="last">
				<button @click="goToStep('thanks')">Thank you</button>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	methods: {
		goToStep(step) {
			this.$emit('navigate-to-step', step);
		}
	}
};
</script>

<!-- <style lang="scss">
@import 'settings';
</style> -->
