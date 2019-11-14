<template>
	<www-page>
		<router-view />
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage
	},
	beforeCreate() {
		const todaysDate = new Date();
		const timezoneOffset = todaysDate.getTimezoneOffset() - 480; // PDT Offset is 480 minutes
		todaysDate.setMinutes(todaysDate.getMinutes() + timezoneOffset);

		const day = todaysDate.getDate();
		const month = todaysDate.getMonth() + 1; // getMonth is 0 based

		let url = '/';
		if (month === 12 && (day >= 3 && day <= 13)) {
			url = '/possibility/giving-tuesday';
		} else if (month === 12 && (day >= 14 && day <= 25)) {
			url = '/possibility/12-days-of-lending';
		} else if (month === 12 && (day >= 26 && day <= 31)) {
			url = '/possibility/year-end';
		}

		if (this.$route.path === '/possibility') {
			this.$router.push({ path: url, query: this.$route.query });
		}
	}
};
</script>
