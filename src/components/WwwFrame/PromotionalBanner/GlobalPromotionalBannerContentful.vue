<template>
	<generic-promo-banner
		v-if="isPromoEnabled"
		:icon-key="promoBannerContent.iconKey"
		:promo-banner-content="promoBannerContent"
	/>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import contentfulCMS from '@/graphql/query/contentfulCMS.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import GenericPromoBanner from './Banners/GenericPromoBanner';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	inject: ['apollo'],
	components: {
		GenericPromoBanner,
	},
	props: {
		hasPromoSession: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isPromoEnabled: false,
			promoBannerContent: {},
			specialConditions: null
		};
	},
	mounted() {
		this.apollo.query({
			query: contentfulCMS,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-global-promo',
			}
		}).then(({ data }) => {
			// returns the contentful content of the uiSetting key ui-global-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiGlobalPromoSetting = _get(data, 'contentfulCMS.items', []).find(item => item.key === 'ui-global-promo'); // eslint-disable-line max-len

			// uiGlobalPromoSetting can contain an array of different banners with
			// different start/end dates first determine if setting is enabled.
			const isGlobalSettingEnabled = settingEnabled(
				uiGlobalPromoSetting,
				'active',
				'startDate',
				'endDate'
			);

			// if setting is enabled determine which banner to display
			if (isGlobalSettingEnabled) {
				const activePromoBanner = uiGlobalPromoSetting.content.find(promoContent => {
					return settingEnabled(
						promoContent.fields,
						'active',
						'startDate',
						'endDate'
					);
				});
				if (activePromoBanner) {
					// check for visibility on promo session override
					const showForPromo = _get(activePromoBanner, 'fields.showForPromo', false);
					if (this.hasPromoSession && !showForPromo) {
						return false;
					}
					// parse the contentful richText into an html string
					this.promoBannerContent = {
						kvTrackEvent: activePromoBanner.fields.kvTrackEvent,
						link: activePromoBanner.fields.link,
						richText: documentToHtmlString(activePromoBanner.fields.richText),
						iconKey: _get(activePromoBanner, 'fields.iconKey', 'present')
					};
					// check for special conditions and allow that process to control enabled
					const specialConditions = _get(activePromoBanner, 'fields.specialConditions', null);
					if (specialConditions) {
						this.specialConditions = specialConditions;
						this.processSpecialConditions();
					} else {
						this.isPromoEnabled = true;
					}
				}
			}
		});
	},
	methods: {
		processSpecialConditions() {
			// check for and operate on autolending opt in condition
			if (this.specialConditions.includes('autolending-opted-in')) {
				this.verifyAutoLendingOptin();
			}
		},
		verifyAutoLendingOptin() {
			const query = gql`{
				my {
					autolendProfile	{
						isEnabled
						idleCreditOptIn
					}
					userAccount {
						id
						inactiveAccountSetting
					}
				}
			}`;
			// check this lender's autolend opt-out state
			// - show the banner if they are currently opted in
			// - and we are not on the /settings/autolending page
			this.apollo.query({
				query
			}).then(({ data }) => {
				if (_get(data, 'my.autolendProfile.isEnabled')) {
					return false;
				}
				const optedIn = _get(data, 'my.autolendProfile.idleCreditOptIn', false);
				const inactiveAccountSetting = _get(data, 'my.userAccount.inactiveAccountSetting', null);
				if ((optedIn || inactiveAccountSetting === 'email_address')
					&& this.$route.path !== '/settings/autolending') {
					this.isPromoEnabled = true;
				}
			});
		}
	}
};
</script>
