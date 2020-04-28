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
							{{ lender.firstName }}, thanks to you, {{ loans.length }}
							{{ loans.length > 1 ? 'borrowers are' : 'borrower is' }} closer to their dreams!
						</h1>
						<p class="thanks__header-subhead">
							But the journey isn't over for them and many other borrowers.<br>
							Please tell your friends and multiply your impact
						</p>
					</div>

					<social-share
						class="thanks__social-share"
						:lender="lender"
						:loans="loans"
					/>
				</template>

				<p class="thanks__confirmation hide-for-print">
					Confirmation sent to: {{ lender.email }}.
				</p>

				<checkout-receipt
					class="thanks__receipt"
					:lender="lender"
					:receipt="receipt"
				/>
			</div>
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

import _get from 'lodash/get';
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
		errorHandlers: {
			'api.authenticationRequired': ({ route }) => {
				return Promise.reject({
					path: '/ui-login',
					query: { doneUrl: route.fullPath }
				});
			}
		},
		result({ data }) {
			this.lender = {
				...data.my.userAccount,
				teams: data.my.teams.values.map(value => value.team)
			};
			this.receipt = data.shop.receipt;
			this.loans = data.shop.receipt.items.values
				.filter(item => item.basketItemType === 'loan_reservation')
				.map(item => item.loan);
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
			const uiPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-thanks-lightbox'); // eslint-disable-line max-len
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
	padding: 1.625rem 0;
}

.thanks {
	&__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	&__header-h1 {
		@include impact-text();
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

	&__confirmation {
		text-align: center;
		margin-bottom: 1rem;
	}

	&__receipt {
		max-width: rem-calc(485);
		margin: 0 auto;

		@media print {
			max-width: none;
		}
	}
}
</style>
