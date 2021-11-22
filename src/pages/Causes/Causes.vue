<template>
	<www-page
		main-class="kv-tailwind"
	>
		<router-view />
	</www-page>
</template>

<script>

import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
};
</script>

<style lang="scss">
</style>
