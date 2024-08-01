<template>
	<div v-if="!isLoggedIn || !hasCampaignReward">
		<generic-promo-banner
			class="tw-text-center"
			:promo-banner-content="promoBannerContent"
			:enable-deposit-incentive-exp="isLoggedIn"
			:progress-bar-value="basketTotal"
			:amount-to-lend="amountToLend"
		/>
	</div>
</template>

<script>
import GenericPromoBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import numeral from 'numeral';
import { gql } from 'graphql-tag';
import configSettingQuery from '#src/graphql/query/configSetting.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

const key = 'deposit_incentive_active_campaign_id';

const amountToLendQuery = gql`
	query amountToLendQuery ($basketId: String, $campaignId: String) {
		shop(basketId: $basketId) {
			id
			basket {
				id
				totals {
					loanReservationTotal
				}
			}
		}
		my {
			id
			depositIncentiveAmountToLend
			userAccount {
				id
				hasCampaignReward(campaignId: $campaignId)
			}
		}
	}
`;

export default {
	name: 'DepositIncentiveBanner',
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			hasCampaignReward: false,
			amountToLend: 0,
			isLoggedIn: false,
			basketTotal: 0,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(_config, client) {
			return client.query({ query: configSettingQuery, variables: { key } }).then(result => {
				const campaignId = JSON.parse(result?.data?.general?.configSetting?.value ?? '""');
				return campaignId ? client.query({ query: amountToLendQuery, variables: { campaignId } }) : null;
			});
		},
	},
	created() {
		let campaignId;

		try {
			campaignId = JSON.parse(this.apollo.readQuery({ query: configSettingQuery, variables: { key } })
				?.general?.configSetting?.value ?? '""');
		} catch (e) {
			logReadQueryError(e, 'DepositIncentiveBanner configSettingQuery');
		}

		if (campaignId) {
			try {
				const data = this.apollo.readQuery({
					query: amountToLendQuery,
					variables: { campaignId, basketId: this.cookieStore.get('kvbskt') }
				});
				this.amountToLend = parseFloat(data?.my?.depositIncentiveAmountToLend ?? 0);
				this.isLoggedIn = !!data?.my?.id ?? false;
				this.basketTotal = parseFloat(data?.shop?.basket?.totals?.loanReservationTotal ?? 0);
				this.hasCampaignReward = !!data?.my?.userAccount?.hasCampaignReward ?? false;
			} catch (e) {
				logReadQueryError(e, 'DepositIncentiveBanner amountToLendQuery');
			}
		}
	},
	computed: {
		promoBannerContent() {
			const richText = this.isLoggedIn
				? `Just for you! Lend ${numeral(this.amountToLend).format('$0,0')} and get a $25 lending credit!¹`
				: 'Lend & get a free lending credit reward!¹ Log in or sign up to get started →';

			const link = this.isLoggedIn
				? '/lend/filter'
				: '/ui-login?force=true&doneUrl=/lend/filter';

			return {
				richText,
				link,
				disclaimer: '',
			};
		}
	},
};
</script>
