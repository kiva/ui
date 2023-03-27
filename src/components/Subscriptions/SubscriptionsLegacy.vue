<template>
	<div class="row">
		<kv-settings-card class="column large-8" title="Auto Deposits">
			<template #content>
				<div v-for="(sub, index) in legacySubscriptions" :key="index">
					<p>
						<!-- eslint-disable-next-line max-len -->
						Each month <strong>{{ sub.amount | numeral('$0,0.00') }}</strong> will be transferred from PayPal. This includes a <strong>{{ sub.amount - sub.autoDonate | numeral('$0,0.00') }}</strong> deposit for lending and a <strong>{{ sub.autoDonate | numeral('$0,0.00') }}</strong> optional donation to support Kiva.
					</p>
					<p class="legacy_notice">
						<!-- eslint-disable-next-line max-len -->
						Because you have an existing auto deposit, to make changes you'll need to <a :href="subscriptionCancelLink(sub)">cancel your current auto deposit via PayPal</a> and then return to Kiva to set up a new one.
					</p>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';

import KvSettingsCard from '@/components/Kv/KvSettingsCard';

const pageQuery = gql`query legacySubscription {
	my {
		id
		subscriptions {
			values {
				id
				amount
				autoDonate
				subscrId
				type
			}
		}
	}
}`;

export default {
	name: 'SubscriptionsLegacy',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSettingsCard,
	},
	data() {
		return {
			legacySubscriptions: []
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			this.legacySubscriptions = _get(data, 'my.subscriptions.values', []);
		},
	},
	methods: {
		subscriptionCancelLink(legacySubObject) {
			return `https://${this.$appConfig.paypal.url}/cgi-bin/webscr`
				+ `?cmd=_profile-recurring-payments&encrypted_profile_id=${legacySubObject.subscrId}`;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.legacy_notice {
	background-color: $vivid-yellow;
	padding: 0.625rem;
	margin-top: 1.25rem;
}
</style>
