<template>
	<loan-count class="mobile-counter">
		Currently matching loans:
	</loan-count>
</template>

<script>
import LoanCount from './LoanCount';

export default {
	components: {
		LoanCount,
	},
};
</script>

<style lang="scss">
@import 'settings';

.mobile-counter {
	text-align: center;
	color: $kiva-green;

	.count-caption {
		display: inline;
		margin-right: 0.25rem;
		font-size: rem-calc(18);
	}

	.count-value {
		font-size: rem-calc(28);
		font-weight: 500;
	}

	.loading-spinner {
		vertical-align: middle;
		width: 1.75rem;
		height: 1.75rem;
		margin-top: -0.25rem;

		& >>> .line {
			background-color: $kiva-green;
		}
	}

	&.zero {
		color: $kiva-accent-red;

		.loading-spinner >>> .line {
			background-color: $kiva-accent-red;
		}
	}
}
</style>
