<template>
	<div class="campaign-logo-group">
		<kiva-logo class="campaign-logo-group__kiva" />
		<span v-if="corporateLogoUrl" class="campaign-logo-group__separator" aria-hidden="true">+</span>
		<picture
			class="campaign-logo-group__corporate"
			v-if="corporateLogoUrl"
		>
			<source
				type="image/webp"
				:srcset="`
					${corporateLogoUrl}?h=56&fm=webp 2x,
					${corporateLogoUrl}?h=23&fm=webp 1x`"
			>
			<img
				:srcset="`
					${corporateLogoUrl}?h=56&fm=png 2x,
					${corporateLogoUrl}?h=23&fm=png 1x`"
				:src="`${corporateLogoUrl}?h=23&fm=png`"
				alt=""
			>
		</picture>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

export default {
	components: {
		KivaLogo,
	},
	props: {
		corporateLogoUrl: {
			type: String,
			default: ''
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
$logo-color: $white;

.campaign-logo-group {
	align-self: center;
	display: flex;
	justify-content: center;
	align-items: center;

	&__kiva {
		fill: $logo-color; // IE11 fallback
		fill: var(--logo-color, $logo-color);
	}

	&__kiva,
	&__corporate {
		height: 100%;
	}

	&__corporate {
		line-height: 0;

		img {
			height: 100%;
		}
	}

	&__separator {
		color: $subtle-gray;
		display: inline-block;
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 0.5rem;

		@include breakpoint(large) {
			font-size: 2rem;
			margin: 0 0.675rem;
		}
	}
}
</style>
