<template>
	<www-page-minimal :header-theme="headerTheme">
		<div class="page-wrap">
			<get-started-causes v-if="isIntro" />
			<router-view v-else />
		</div>
	</www-page-minimal>
</template>

<script>
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import GetStartedCauses from '@/pages/GetStarted/GetStartedCauses';

import { lightHeader } from '@/util/siteThemes';

export default {
	components: {
		GetStartedCauses,
		WwwPageMinimal,
	},
	metaInfo: {
		title: 'Get Started'
	},
	computed: {
		isIntro() {
			return this.$route.path === '/get-started';
		}
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
	background: #fff;
	position: relative;
	overflow: hidden;

	@include breakpoint(large) {
		background: $kiva-bg-lightgray;
	}
}
</style>
