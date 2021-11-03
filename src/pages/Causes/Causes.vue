<!-- TODO
main-class="kv-tailwind" can't be added to www-page here because kv-tailwind reset classes are overwriting
BT drop in css supplied by braintree in src/components/Causes/CausesDropInPaymentWrapper.vue
Add main-class="kv-tailwind" once BT drop in and tailwind issues are worked out.
And remove kv-tailwind from child views-->
<template>
	<www-page
		:header-theme="headerTheme"
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
