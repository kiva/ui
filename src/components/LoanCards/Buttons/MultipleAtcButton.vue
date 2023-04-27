<template>
	<div>
		<button
			class="tw-flex tw-items-center tw-pl-1.5"
			style="font-size: 17px; font-weight: 611; border-radius: 16px; border: 1px solid #C4C4C4;"
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
			if (this.loansNumber === 4) return 'Add all 4 cart';
			if (this.loansNumber === 3) return 'Add all 3 cart';
			return 'Add both to cart';
		}
	}
};

</script>
