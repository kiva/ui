<template>
	<div>
		<button
			class="tw-flex tw-items-center tw-pl-1.5 tw-border tw-border-tertiary"
			style="font-size: 17px; font-weight: 611; border-radius: 16px;"
		>
			${{ amount }}
			<div
				class="tw-ml-1.5"
				style="background: #F4B539; font-weight: 621; border-radius: 0 14px 14px 0; padding: 12px 18px;"
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
			type: String,
			default: '0'
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
