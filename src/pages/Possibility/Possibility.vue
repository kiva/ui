<template>
	<www-page>
		<router-view />
	</www-page>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	name: 'Possibility',
	components: {
		WwwPage
	},
	beforeCreate() {
		const offset = 8 * 60 * 60 * 1000; // PDT is 8 hours behind UTC
		const now = Date.now() - offset;

		const dec3 = 1575331200000;
		const dec13 = 1576195200000;
		const dec26 = 1577318400000;

		let url = '/possibility/year-end';

		if (now >= dec3 && now < dec13) {
			url = '/possibility/giving-tuesday';
		} else if (now >= dec13 && now < dec26) {
			url = '/possibility/12-days-of-lending';
		} else if (now >= dec26) {
			url = '/possibility/year-end';
		}

		if (this.$route.path === '/possibility') {
			this.$router.push({ path: url, query: this.$route.query });
		}
	}
};
</script>
