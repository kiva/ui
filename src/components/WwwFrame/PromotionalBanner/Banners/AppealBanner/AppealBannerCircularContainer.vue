<template>
	<appeal-banner-circular
		:target-amount="targetAmount"
		:amount-raised="amountRaised"
		:button-amounts="buttonAmounts"
		:headline="headline"
		:body="body"
		:image-url="imageUrl"
		:is-open="isOpen"
		:disclaimer="hasDisclaimer"
		@toggle-banner="onToggleBanner"
		@amount-selected="onAmountSelected"
	/>
</template>

<script>
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import AppealBannerCircular from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerCircular';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'AppealBannerCircularContainer',
	components: {
		AppealBannerCircular
	},
	inject: ['apollo', 'cookieStore'],
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
			const appealBody = this.appealBannerContent?.additionalContent?.[0]?.fields?.richText || '';
			return documentToHtmlString(appealBody);
		},
		buttonAmounts() {
			const amountsArr = this.appealBannerContent?.dataObject?.donationAmounts || '';
			return amountsArr;
		},
		imageUrl() {
			return this.appealBannerContent?.additionalContent
				?.find(content => content?.fields?.name === 'Progress Meter Image')
				.fields?.images?.[0]?.fields?.file?.url || '';
		},
		hasDisclaimer() {
			const disclaimer = this.appealBannerContent?.disclaimers?.content?.[0] ?? '';
			return disclaimer !== '';
		}
	},
	created() {
		const bannerIsOpen = this.cookieStore.get('appeal_banner_is_open');
		if (typeof bannerIsOpen === 'undefined') {
			this.isOpen = true;
		} else {
			this.isOpen = bannerIsOpen === 'true';
		}
	},
	methods: {
		onToggleBanner(isOpen) {
			this.isOpen = isOpen;
			this.cookieStore.set('appeal_banner_is_open', isOpen, { path: '/' });
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
