<template>
	<div class="tw-flex tw-justify-center tw-items-center tw-self-center">
		<kiva-logo class="tw-h-full tw-text-brand" />
		<span
			v-if="corporateLogoUrl"
			class="tw-text-secondary tw-inline-block tw-mx-1 tw-text-h2"
			aria-hidden="true"
		>+</span>
		<kv-contentful-img
			v-if="corporateLogoUrl"
			class="tw-h-full campaign-logo-group__corporate"
			:contentful-src="corporateLogoUrl"
			:height="28"
			alt=""
			fallback-format="png"
		/>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

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
