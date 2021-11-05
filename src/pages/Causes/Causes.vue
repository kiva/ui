<template>
	<www-page
		:header-theme="headerTheme"
		main-class="kv-tailwind"
	>
		<router-view />
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	data() {
		return {
			headerTheme: lightHeader,
		};
	},
};
</script>

<style lang="scss">
</style>
