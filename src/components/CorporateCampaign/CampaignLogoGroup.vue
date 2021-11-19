<template>
	<div class="campaign-logo-group">
		<kiva-logo class="campaign-logo-group__kiva" />
		<span v-if="corporateLogoUrl" class="campaign-logo-group__separator" aria-hidden="true">+</span>
		<kv-contentful-img
			v-if="corporateLogoUrl"
			class="campaign-logo-group__corporate"
			:contentful-src="corporateLogoUrl"
			:height="28"
			alt=""
			fallback-format="png"
		/>
	</div>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

export default {
	components: {
		KvContentfulImg,
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
$logo-color: $green;

.campaign-logo-group {
	align-self: center;
	display: flex;
	justify-content: center;
	align-items: center;

	&__kiva {
		color: $logo-color; // IE11 fallback
		color: var(--logo-color, $logo-color);
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
