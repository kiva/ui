<template>
	<www-page>
		<div class="row monthly-good-setup-page">
			<div class="column" v-if="!isMonthlyGoodSubscriber">
				<p> This is the setup form</p>
				{{ amount }}
				{{ group }}
			</div>
			<already-subscribed-notice class="column" v-if="isMonthlyGoodSubscriber" />
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import AlreadySubscribedNotice from './AlreadySubscribedNotice';
import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`{
	my {
		autoDeposit {
			id
			amount
			donateAmount
			dayOfMonth
			status
			isSubscriber
		}
	}
}`;

export default {
	props: {
		amount: {
			type: Number,
			default: 25
		},
		group: {
			type: String,
			default: 'default'
		}
	},
	components: {
		WwwPage,
		AlreadySubscribedNotice
	},
	data() {
		return {
			isMonthlyGoodSubscriber: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,

		preFetch(config, client, { route }) {
			return client.query({ query: userInfoQuery })
				.then(({ data }) => {
					const userId = _get(data, 'my.userAccount.id');
					if (!userId) {
						throw new Error('activeLoginRequired');
					}
				})
				.then(() => {
					return client.query({ query: pageQuery })
						.then(({ data }) => {
							this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
						});
				})
				.catch(e => {
					if (e.message.indexOf('activeLoginRequired') > -1) {
						// Force a login when active login is required
						return Promise.reject({
							path: '/ui-login',
							query: { doneUrl: route.fullPath }
						});
					}
					// Log other errors
					console.error(e);
				});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-setup-page {
	margin-top: 2rem;
}
</style>
