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
import { gql } from '@apollo/client';
import { settingEnabled, settingWithinDateRange } from '@/util/settingsUtils';
import { globalBannerDenyList, isExcludedUrl } from '@/util/urlUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const disclaimerQuery = gql`query disclaimerQuery($basketId: String) {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
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
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: disclaimerQuery,
		preFetch: true,
		result({ data }) {
			// Hide ALL banners on these pages
			if (isExcludedUrl(globalBannerDenyList, this.$route.path)) return false;

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
					const hiddenUrls = promoContent?.fields?.hiddenUrls ?? [];
					if (isExcludedUrl(hiddenUrls, this.$route.path)) return false;

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
					const hiddenUrls = activePromoBanner?.fields?.hiddenUrls ?? [];
					if (isExcludedUrl(hiddenUrls, this.$route.path)) return false;

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
	computed: {
		// constructing the final form of the disclaimer text for display
		fullyBuiltDisclaimerText() {
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
