<template>
	<div>
		<!-- eslint-disable max-len -->
		<button
			class="tw-flex tw-items-center tw-pl-1.5 tw-border tw-border-tertiary tw-text-base tw-rounded"
			@click="$emit('add-multiple')"
		>
			${{ amount }}
			<div
				class="tw-ml-1.5 tw-bg-marigold"
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
		}
	},
	computed: {
		buttonCopy() {
			if (this.loansNumber > 2) return `Add all ${this.loansNumber} cart`;
			return 'Add both to cart';
		}
	}
};

</script>
