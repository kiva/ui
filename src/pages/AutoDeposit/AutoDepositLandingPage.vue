<template>
	<www-page>
		<!-- Auto Deposit Text -->
		<!-- Auto Deposit Form -->
		<!-- Auto Deposit What To Expect -->
		<!-- Auto Deposit Frequently Asked Questions -->
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`query autoDepositLandingPage {
	my {
		userAccount {
			id
		}
	}
}`;

export default {
	metaInfo: {
		title: 'Auto Deposit',
	},
	components: {
		WwwPage,

	},
	data() {
		return {
			isLoggedIn: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;
		},
	},
	computed: {
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';
</style>
