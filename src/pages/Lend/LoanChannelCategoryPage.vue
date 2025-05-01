<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<kv-atb-modal-container
			:added-loan="addedLoan"
		/>
		<loan-channel-category-control
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:enable-huge-amount="enableHugeLendAmount"
			@show-cart-modal="handleCartModal"
		/>

		<add-to-basket-interstitial />
	</www-page>
</template>

<script>
import { readBoolSetting } from '#src/util/settingsUtils';
import updateAddToBasketInterstitial from '#src/graphql/mutation/updateAddToBasketInterstitial.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '#src/components/Lightboxes/AddToBasketInterstitial';
import LoanChannelCategoryControl from '#src/pages/Lend/LoanChannelCategoryControl';
import retryAfterExpiredBasket from '#src/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '#src/plugins/five-dollars-test-mixin';
import hugeLendAmount from '#src/plugins/huge-lend-amount-mixin';
import basketModalMixin from '#src/plugins/basket-modal-mixin';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';

const CATEGORY_REDIRECT_KEY = 'combo_page_enable';

export default {
	name: 'LoanChannelCategoryPage',
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryControl,
		WwwPage,
		KvAtbModalContainer,
	},
	mixins: [retryAfterExpiredBasket, fiveDollarsTest, hugeLendAmount, basketModalMixin],
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			meta: {
				title: undefined,
				description: undefined
			},
			pageLayout: 'control',
			enableLoanTags: false,
		};
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({ query: uiConfigSettingQuery, variables: { key: CATEGORY_REDIRECT_KEY } })
				.then(({ data }) => {
					const query = args?.route?.query ?? {};
					const isComboPageEnabled = readBoolSetting(data, 'general.uiConfigSetting.value');

					// Redirect to /lend-category-beta/** if combo page flag is enabled
					const category = args?.route?.value?.params?.category ?? '';

					if (isComboPageEnabled) {
						return Promise.reject({ path: `/lend-category-beta/${category}`, query });
					}

					// eslint-disable-next-line max-len
					return client.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } });
				});
		}
	},
	created() {
		/*
		 * Experiment Initializations
		*/

		// Add to Basket Interstitial
		this.initializeAddToBasketInterstitial();

		this.initializeFiveDollarsNotes();

		// Enable huge lend amount
		this.initializeHugeLendAmount();
	},
	methods: {
		initializeAddToBasketInterstitial() {
			this.apollo.mutate({
				mutation: updateAddToBasketInterstitial,
				variables: {
					active: true,
				}
			});
		},
	},
};
</script>
