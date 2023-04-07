<template>
	<div class="tw-flex tw-justify-center tw-items-center tw-self-center tw-my-1">
		<kiva-logo class="tw-h-4 tw-text-brand" />
		<span
			v-if="corporateLogoUrl"
			class="tw-text-secondary tw-inline-block tw-mx-2 tw-text-h2"
			aria-hidden="true"
		>+</span>
		<kv-contentful-img
			v-if="corporateLogoUrl"
			:class="`campaign-logo-group__corporate ${logoClasses}`"
			:contentful-src="corporateLogoUrl"
			:height="logoHeight"
			alt=""
			fallback-format="png"
		/>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'CampaignLogoGroup',
	components: {
		KvContentfulImg,
		KivaLogo,
	},
	props: {
		corporateLogoUrl: {
			type: String,
			default: ''
		},
		logoClasses: {
			type: String,
			default: '',
			required: false
		},
		logoHeight: {
			type: String,
			default: '28',
			required: false
		}
	},
};
</script>
