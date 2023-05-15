<template>
	<div>
		<button
			class="
				multiple-act-button
				tw-flex
				tw-items-center
				tw-pl-1.5
				tw-border
				tw-border-tertiary
				tw-text-base
				tw-rounded
			"
			:disabled="isAdding"
			@click="$emit(showCheckout ? 'checkout' : 'add-multiple')"
		>
			${{ amount }}
			<div
				class="tw-ml-1.5"
				:class="{
					'tw-bg-marigold': !showCheckout,
					'tw-bg-white': showCheckout
				}"
				style="border-radius: 0 14px 14px 0; padding: 12px 18px; font-weight: 621;"
			>
				{{ buttonCopy }}
			</div>
		</button>
	</div>
</template>

<script>
export default {
	name: 'MultipleAtcButton',
	props: {
		amount: {
			type: Number,
			default: 0
		},
		loansNumber: {
			type: Number,
			default: 2
		},
		isAdding: {
			type: Boolean,
			default: false
		},
		showCheckout: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		buttonCopy() {
			if (this.isAdding) return 'Adding to basket';
			if (this.showCheckout) return 'Checkout now';
			if (this.loansNumber > 2) return `Add all ${this.loansNumber} cart`;
			return 'Add both to cart';
		}
	}
};
</script>

<style scoped>
.multiple-act-button:hover {
	filter: brightness(0.95);
}
</style>
