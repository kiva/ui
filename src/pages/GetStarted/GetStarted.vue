<template>
	<www-page-minimal :header-theme="headerTheme">
		<div class="page-wrap">
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

<style lang="scss" scoped>
@import 'settings';

.page-wrap {
	position: relative;
	overflow: hidden;

	@include breakpoint(large) {
		background: $kiva-bg-lightgray;
	}
}
</style>
