<template>
	<www-page-minimal :header-theme="headerTheme">
		<div class="tw-relative tw-overflow-hidden md:tw-bg-secondary">
			<router-view />
		</div>
	</www-page-minimal>
</template>

<script>
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import { lightHeader } from '@/util/siteThemes';

export default {
	components: {
		WwwPageMinimal,
	},
	metaInfo: {
		title: 'Get Started'
	},
	data() {
		return {
			headerTheme: lightHeader
		};
	},
};
</script>
