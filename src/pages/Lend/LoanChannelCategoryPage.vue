<template>
	<www-page
		class="loan-channel-page category-page"
		:gray-background="pageLayout === 'control'"
	>
		<kv-cart-modal
			v-if="addedLoan"
			:added-loan="addedLoan"
			:visible="cartModalVisible"
			:photo-path="PHOTO_PATH"
			:basket-count="basketCount"
			@cart-modal-closed="closeCartModal"
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
import updateAddToBasketInterstitial from '#src/graphql/mutation/updateAddToBasketInterstitial.graphql';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import AddToBasketInterstitial from '#src/components/Lightboxes/AddToBasketInterstitial';
import LoanChannelCategoryControl from '#src/pages/Lend/LoanChannelCategoryControl';
import retryAfterExpiredBasket from '#src/plugins/retry-after-expired-basket-mixin';
import fiveDollarsTest, { FIVE_DOLLARS_NOTES_EXP } from '#src/plugins/five-dollars-test-mixin';
import hugeLendAmount from '#src/plugins/huge-lend-amount-mixin';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import basketModalMixin from '#src/plugins/basket-modal-mixin';
import KvCartModal from '@kiva/kv-components/vue/KvCartModal';

const CATEGORY_REDIRECT_EXP_KEY = 'category_filter_redirect';

const getHasEverLoggedIn = client => !!(client.readQuery({ query: hasEverLoggedInQuery })?.hasEverLoggedIn);

export default {
	name: 'LoanChannelCategoryPage',
	components: {
		AddToBasketInterstitial,
		LoanChannelCategoryControl,
		WwwPage,
		KvCartModal,
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
			return client.query({ query: experimentAssignmentQuery, variables: { id: CATEGORY_REDIRECT_EXP_KEY } })
				.then(() => {
					const query = args?.route?.query ?? {};

					// Redirect to /lend-category-beta/** if user has previously signed in and experiment is assigned
					const { version } = client.readFragment({
						id: `Experiment:${CATEGORY_REDIRECT_EXP_KEY}`,
						fragment: experimentVersionFragment,
					}) ?? {};

					const category = args?.route?.params?.category ?? '';

					if (version === 'b' && getHasEverLoggedIn(client)) {
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
	mounted() {
		if (getHasEverLoggedIn(this.apollo)) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORY_REDIRECT_EXP_KEY,
				'EXP-CORE-1205-May2023'
			);
		}
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
