<template>
	<appeal-banner-swashie
		:target-amount="targetAmount"
		:amount-raised="amountRaised"
		:button-amounts="buttonAmounts"
		:headline="headline"
		:body="body"
		:is-open="isOpen"
		@toggle-banner="onToggleBanner"
		@amount-selected="onAmountSelected"
	/>
</template>

<script>
import cookieStore from '@/util/cookieStore';
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import AppealBannerSwashie from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerSwashie';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		AppealBannerSwashie
	},
	inject: ['apollo'],
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.amountRaised = data?.general?.kivaStats?.latestDonationCampaign?.amount_raised; // eslint-disable-line
			this.targetAmount = data?.general?.kivaStats?.latestDonationCampaign?.target_amount; // eslint-disable-line
		},
	},
	props: {
		appealBannerContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			targetAmount: null,
			amountRaised: null,
			isOpen: true,
		};
	},
	computed: {
		headline() {
			const appealHeadline = this.appealBannerContent?.richText || '';
			// contentful wraps all richText fields with a <p> tag,
			// which makes them difficult to style as headers,
			// this removes that wrapping tag
			const options = {
				renderNode: {
					paragraph: (node, next) => `${next(node.content)}`
				}
			};
			return documentToHtmlString(appealHeadline, options);
		},
		body() {
			const appealBody = this.appealBannerContent?.additionalContent?.[0].fields.richText || '';
			return documentToHtmlString(appealBody);
		},
		buttonAmounts() {
			const amountsArr = this.appealBannerContent?.dataObject?.donationAmounts || '';
			return amountsArr;
		},
	},
	created() {
		const bannerIsOpen = cookieStore.get('appeal_banner_is_open');
		if (typeof bannerIsOpen === 'undefined') {
			this.isOpen = true;
		} else {
			this.isOpen = bannerIsOpen === 'true';
		}
	},
	methods: {
		onToggleBanner(isOpen) {
			this.isOpen = isOpen;
			cookieStore.set('appeal_banner_is_open', isOpen, { path: '/' });
		},
		onAmountSelected(amount) {
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(amount).format('0.00'),
					isTip: true
				}
			}).then(data => {
				if (data.errors) {
					data.errors.forEach(({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					this.$kvTrackEvent(
						'/support-kiva',
						'Donate from Macro',
						'Donation from Macro',
						// pass donation amount as whole number
						numeral(amount).value() * 100,
						numeral(amount).value() * 100
					);
					this.$router.push({
						path: '/checkout',
					});
				}
			}).catch(error => {
				console.error(error);
			});
		}
	},
};
</script>
