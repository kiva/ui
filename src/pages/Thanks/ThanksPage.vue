<template>
	<www-page :gray-background="true">
		<div class="row page-content">
			<div class="small-12 columns thanks">
				<div class="thanks__checkout-steps-wrapper hide-for-print">
					<kv-checkout-steps :steps="checkoutSteps" :current-step-index="3" />
					<hr>
				</div>

				<template v-if="loans.length > 0">
					<div class="thanks__header hide-for-print">
						<h1 class="thanks__header-h1">
							Thank you!
						</h1>
						<p class="thanks__header-subhead">
							Thanks for supporting {{ borrowerSupport }}.<br>
							<span class="hide-for-print">
								We've emailed your order confirmation to {{ lender.email }}
							</span>
						</p>
					</div>
				</template>

				<checkout-receipt
					v-if="receipt"
					class="thanks__receipt"
					:lender="lender"
					:receipt="receipt"
				/>
				<hr>
			</div>

			<template v-if="loans.length > 0">
				<social-share
					class="thanks__social-share"
					:lender="lender"
					:loans="loans"
				/>
			</template>

			<contentful-lightbox
				v-if="promoEnabled"
				:content-group="contentGroup"
				:visible="displayLightbox"
				@lightbox-closed="displayLightbox = false"
			/>
		</div>
	</www-page>
</template>

<script>
import confetti from 'canvas-confetti';
import numeral from 'numeral';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import SocialShare from '@/components/Checkout/SocialShare';
import WwwPage from '@/components/WwwFrame/WwwPage';
import checkoutReceiptQuery from '@/graphql/query/checkoutReceipt.graphql';

import ContentfulLightbox from '@/components/Lightboxes/ContentfulLightbox';
import contentful from '@/graphql/query/contentful.graphql';

import { settingEnabled } from '@/util/settingsUtils';
import { processContent } from '@/util/contentfulUtils';

export default {
	components: {
		CheckoutReceipt,
		ContentfulLightbox,
		KvCheckoutSteps,
		SocialShare,
		WwwPage,
	},
	inject: ['apollo', 'federation'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			lender: {},
			loans: [],
			receipt: {},
			displayLightbox: true,
			promoEnabled: false,
			contentGroup: {},
			checkoutSteps: [
				'Basket',
				'Account',
				'Payment',
				'Thank You!'
			]
		};
	},
	computed: {
		borrowerSupport() {
			// TODO Convert this to a mixin or plugin for reuse
			// Takes an array of strings, joins them and inserts a delimiter before last item.
			// Default last delimiter is 'and'
			function joinArray(arr, last = ' and ') {
				if (!Array.isArray(arr)) {
					throw new Error('Passed value is not of array type.');
				}
				let processedArray = arr;

				if (arr.length > 1) {
					// Insert delimiter as part of the array
					processedArray.splice(-1, 0, last);
					// Make a per-letter array with commas between each item
					processedArray = processedArray.join().split('');
					// Remove last 2 commas
					processedArray[processedArray.lastIndexOf(',')] = '';
					processedArray[processedArray.lastIndexOf(',')] = '';
					// Add a space after last comma
					processedArray[processedArray.lastIndexOf(',')] = ', ';
					return processedArray.join('');
				}
				// Return array of length 1 as string
				return arr.join('');
			}

			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, ' and ');
		}
	},
	apollo: {
		query: checkoutReceiptQuery,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				checkoutId: numeral(route.query.kiva_transaction_id).value()
			};
		},
		variables() {
			return {
				checkoutId: numeral(this.$route.query.kiva_transaction_id).value()
			};
		},
		result({ data }) {
			this.lender = {
				...data.my.userAccount,
				teams: data.my.teams.values.map(value => value.team)
			};

			// The default empty object and the v-if will prevent the
			// receipt from rendering in the rare cases this query fails.
			// But it will not throw a server error.
			this.receipt = data?.shop?.receipt;
			const loansResponse = this.receipt?.items?.values ?? [];
			this.loans = loansResponse
				.filter(item => item.basketItemType === 'loan_reservation')
				.map(item => item.loan);

			if (!data?.my?.userAccount) {
				console.error(`Failed to get lender for transaction id: ${this.$route.query.kiva_transaction_id}`);
			}
			if (!this.receipt) {
				console.error(`Failed to get receipt for transaction id: ${this.$route.query.kiva_transaction_id}`);
			}
		}
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c'] // misc. kiva colors
		});
		this.federation.query({
			query: contentful,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-thanks-lightbox',
			}
		}).then(({ data }) => {
			// returns the contentful content of the uiSetting key ui-thanks-lightbox or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const contentfulItems = data?.contentful?.entries?.items || [];
			const uiPromoSetting =	contentfulItems.find(item => item.fields.key === 'ui-thanks-lightbox'); // eslint-disable-line max-len
			// exit if missing setting or fields
			if (!uiPromoSetting || !uiPromoSetting.fields) {
				return false;
			}
			this.promoEnabled = settingEnabled(
				uiPromoSetting.fields,
				'active',
				'startDate',
				'endDate'
			);

			this.contentGroup = processContent(uiPromoSetting.fields.content).contentGroup;
		});
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0 5rem 0;
}

.thanks {
	&__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	&__header-h1 {
		@include large-text();

		margin-bottom: 1.5rem;
	}

	&__header-subhead {
		@include featured-text();
	}

	&__checkout-steps-wrapper {
		padding-bottom: 1.2rem;
	}

	&__social-share {
		margin-bottom: 3rem;
	}

	&__receipt {
		max-width: rem-calc(485);
		margin: 0 auto 2rem;

		@media print {
			max-width: none;
		}
	}
}
</style>
