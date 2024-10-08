<template>
	<div>
		<ol id="disclaimers" class="tw-text-small tw-list-decimal tw-list-outside">
			<li
				v-for="(disclaimer, index) in fullyBuiltDisclaimerText"
				:key="index"
				v-html="disclaimer"
			>
			</li>
		</ol>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { gql } from 'graphql-tag';
import { settingEnabled, settingWithinDateRange } from '#src/util/settingsUtils';
import { globalBannerDenyList, isExcludedUrl } from '#src/util/urlUtils';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const disclaimerQuery = gql`query disclaimerQuery($basketId: String) {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
	}
	experiment(id: "deposit_incentive_banner") @client {
		id
		version
	}
	my {
		id
		userAccount {
			id
			promoBalance
		}
	}
	shop (basketId: $basketId) {
		id
		basket {
			id
			hasFreeCredits
			totals {
				redemptionCodeAvailableTotal
			}
		}
		lendingRewardOffered
	}
}`;

export default {
	name: 'DisclaimersContentful',
	data() {
		return {
			disclaimerContent: [],
			lendingRewardOffered: false,
			bonusBalance: 0,
			hasFreeCredits: false,
			depositIncentiveExperimentActive: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: disclaimerQuery,
		preFetch: true,
		result({ data }) {
			this.disclaimerContent = [];
			// gather contentful content and the uiSetting key ui-global-promo
			const contentfulContent = data?.contentful?.entries?.items ?? [];
			const uiGlobalPromoSetting = contentfulContent.find(item => item.fields.key === 'ui-global-promo');

			// exit if missing setting or fields
			if (!uiGlobalPromoSetting || !uiGlobalPromoSetting.fields) {
				return false;
			}
			// uiGlobalPromoSetting can contain an array of different banners with
			// different start/end dates first determine if setting is enabled.
			const isGlobalSettingEnabled = settingEnabled(
				uiGlobalPromoSetting.fields,
				'active',
				'startDate',
				'endDate'
			);

			// if setting is enabled determine which banner to display
			if (isGlobalSettingEnabled) {
				const activePromoBanner = uiGlobalPromoSetting?.fields?.content?.find(promoContent => {
					// exclude items that are not global-promo-banners
					const isGlobalPromo = promoContent?.sys?.contentType?.sys?.id === 'globalPromoBanner';
					if (!isGlobalPromo) return false;
					// check global promo banner fields
					return settingEnabled(
						promoContent.fields,
						'active',
						'startDate',
						'endDate'
					);
				});

				// gather all inactive promo banners by their start and end dates
				const inactivePromoBanners = uiGlobalPromoSetting?.fields?.content?.filter(promoContent => {
					// exclude items that are not global-promo-banners
					const isGlobalPromo = promoContent?.sys?.contentType?.sys?.id === 'globalPromoBanner';
					if (!isGlobalPromo) return false;
					// check for visibility based on current route and hiddenUrls field
					const hiddenUrls = globalBannerDenyList.concat(promoContent?.fields?.hiddenUrls ?? []);
					const visibleUrls = promoContent?.fields?.visibleUrls ?? [];
					if (isExcludedUrl(hiddenUrls, visibleUrls, this.$route.path)) return false;
					if (promoContent.fields.active) {
						return false;
					}
					return settingWithinDateRange(
						promoContent.fields,
						'startDate',
						'endDate'
					);
				});

				if (activePromoBanner) {
					// check for visibility based on current route and hiddenUrls field
					const hiddenUrls = globalBannerDenyList.concat(activePromoBanner?.fields?.hiddenUrls ?? []);
					const visibleUrls = activePromoBanner?.fields?.visibleUrls ?? [];

					if (isExcludedUrl(hiddenUrls, visibleUrls, this.$route.path)) return false;

					// check for visibility on promo session override
					const showForPromo = _get(activePromoBanner, 'fields.showForPromo', false);
					if (this.hasPromoSession && !showForPromo) {
						return false;
					}

					// set the disclaimer text if it exists in active promo banner
					const activeDisclaimerText = activePromoBanner?.fields?.disclaimers ?? null;

					// if there's an active promo banner with a disclaimer,
					// push that disclaimer to the disclaimerContent for display
					if (activeDisclaimerText) {
						this.disclaimerContent.push(documentToHtmlString(activeDisclaimerText));
					}
				}

				// go through the inactive promoBanners, if within date range and disclaimer text exists
				// push that disclaimer text to disclaimerContent
				if (inactivePromoBanners.length > 0) {
					inactivePromoBanners.forEach(item => {
						const itemDisclaimer = item?.fields?.disclaimers ?? null;
						if (itemDisclaimer) {
							this.disclaimerContent.push(documentToHtmlString(itemDisclaimer));
						}
					});
				}

				// data for the hasPromoCredit function
				const promoBalance = numeral(data?.my?.userAccount?.promoBalance ?? 0);
				const basketPromoBalance = numeral(data?.shop?.totals?.redemptionCodeAvailableTotal ?? 0);
				this.bonusBalance = promoBalance + basketPromoBalance;
				this.lendingRewardOffered = data?.shop?.lendingRewardOffered ?? false;
				this.hasFreeCredits = data?.shop?.basket?.hasFreeCredits ?? false;
			}
		}
	},
	created() {
		const { version } = this.apollo.readFragment({
			id: 'Experiment:deposit_incentive_banner',
			fragment: experimentVersionFragment,
		}) ?? {};
		if (version === 'b') {
			this.depositIncentiveExperimentActive = true;
		}
	},
	computed: {
		// constructing the final form of the disclaimer text for display
		fullyBuiltDisclaimerText() {
			// if deposit incentive experiemt is active, show its disclaimer only
			if (this.depositIncentiveExperimentActive) {
				// eslint-disable-next-line max-len
				return ['<p>Disclaimer: While funds last, 1 $25 free credit will be applied to your account after you lend at least $25 in newly-deposited funds between now and 8/23/2024 at 11:59 pm PST. Limit one per person. You will receive a notification email when your free credit has been applied to your account within 1 business day of a qualifying transaction. Free credits expire after 14 days. Free credits have no cash value and repayments will return to Kiva.</p>'];
			}

			// prepend 'Disclaimer: ' to each disclaimer text
			const builtDisclaimertext = [];
			this.disclaimerContent.forEach(disclaimer => {
				const prependDisclaimer = disclaimer.replace('<p>', '<p>Disclaimer: ');
				builtDisclaimertext.push(prependDisclaimer);
			});
			return builtDisclaimertext;
		},
		hasPromoSession() {
			// check if the user has Promo Credit
			// (lending reward credit, bonus credit, or free credit)
			// if they have any of the above, the banners are hidden
			// so we also hide the disclaimer section
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return true;
			}
			return false;
		}
	},
};
</script>
