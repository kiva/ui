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
						</p>
						<p class="hide-for-print">
							We've emailed your order confirmation to <strong>{{ lender.email }}</strong>
						</p>
					</div>
				</template>
			</div>
		</div>

		<!-- Thanks Page V1 -->
		<div v-if="thanksPageVersion === 'a'">
			<div class="mg_cta-row">
				<div class="row align-center">
					<div class="small-12 columns">
						<monthly-good-c-t-a
							v-if="!isMonthlyGoodSubscriber"
							:headline="ctaHeadline"
							:body-copy="ctaBodyCopy"
							:button-text="ctaButtonText"
						/>
					</div>
				</div>
			</div>

			<div class="row page-content">
				<template v-if="loans.length > 0">
					<social-share
						class="thanks__social-share"
						:lender="lender"
						:loans="loans"
					/>
				</template>

				<div class="small-12 columns thanks">
					<hr v-if="loans.length > 0 || !isMonthlyGoodSubscriber">
					<checkout-receipt
						v-if="receipt"
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
		</div>

		<thanks-layout-v2
			v-if="thanksPageVersion === 'b'"
			:show-mg-cta="!isMonthlyGoodSubscriber"
			:show-share="loans.length > 0"
		>
			<template v-slot:receipt>
				<checkout-receipt
					v-if="receipt"
					:lender="lender"
					:receipt="receipt"
				/>
			</template>
			<template v-slot:mg>
				<monthly-good-c-t-a
					:headline="ctaHeadline"
					:body-copy="ctaBodyCopy"
					:button-text="ctaButtonText"
				/>
			</template>
			<template v-slot:share>
				<social-share
					class="thanks__social-share"
					:lender="lender"
					:loans="loans"
				/>
			</template>
		</thanks-layout-v2>
	</www-page>
</template>

<script>
import confetti from 'canvas-confetti';
import numeral from 'numeral';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import ContentfulLightbox from '@/components/Lightboxes/ContentfulLightbox';
import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import MonthlyGoodCTA from '@/components/Checkout/MonthlyGoodCTA';
import SocialShare from '@/components/Checkout/SocialShare';
import WwwPage from '@/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '@/components/Thanks/ThanksLayoutV2';

import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import contentful from '@/graphql/query/contentful.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

import { settingEnabled } from '@/util/settingsUtils';
import { processContent, processPageContent } from '@/util/contentfulUtils';
import { joinArray } from '@/util/joinArray';

export default {
	components: {
		CheckoutReceipt,
		ContentfulLightbox,
		KvCheckoutSteps,
		MonthlyGoodCTA,
		SocialShare,
		ThanksLayoutV2,
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
			],
			thanksPageVersion: 'a',
			isMonthlyGoodSubscriber: false,
			pageData: {},
		};
	},
	apollo: {
		query: thanksPageQuery,
		preFetch(config, client, { route }) {
			return client.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: numeral(route.query.kiva_transaction_id).value()
				}
			}).then(() => {
				return client.query({
					query: experimentAssignmentQuery, variables: { id: 'mg_thanks_cta' }
				});
			});
		},
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

			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

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

			// Check for contentful content
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
		},
	},
	computed: {
		borrowerSupport() {
			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, 'and');
		},
		ctaContentGroup() {
			// eslint-disable-next-line max-len
			return this.pageData?.page?.pageLayout?.contentGroups?.find(contentGroup => contentGroup.key === 'thanks-mg-cta-jan-2021');
		},
		ctaContentBlock() {
			// eslint-disable-next-line max-len
			return this.ctaContentGroup?.contents?.find(contentItem => contentItem.key === 'thanks-mg-cta');
		},
		ctaHeadline() {
			return this.ctaContentBlock?.headline;
		},
		ctaBodyCopy() {
			return this.ctaContentBlock?.subHeadline;
		},
		ctaButtonText() {
			return this.ctaContentBlock?.primaryCtaText;
		},
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c'], // misc. kiva colors
			disableForReducedMotion: true,
		});

		// MG Upsell On Thanks Page - EXP-SUBS-526-Oct2020
		// This experiment determines which Thanks Page layout will be shown.
		const mgCTAExperiment = this.apollo.readFragment({
			id: 'Experiment:mg_thanks_cta',
			fragment: experimentVersionFragment,
		}) || {};

		this.thanksPageVersion = mgCTAExperiment.version === 'shown' ? 'b' : 'a';
		this.$kvTrackEvent(
			'Thanks',
			'EXP-SUBS-526-Oct2020',
			mgCTAExperiment.version === 'shown' ? 'b' : 'a'
		);

		// Contentful Lightbox
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

.mg_cta-row {
	background: $white;
}

.page-content {
	padding: 1.625rem 0 0 0;

	@media print {
		padding: 0;
	}

	&:last-child {
		padding-bottom: 5rem;
	}
}

.thanks {
	&__header {
		text-align: left;
		margin-bottom: 2.5rem;

		@include breakpoint(medium) {
			text-align: center;
		}
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
		margin-bottom: 0.5rem;
	}

	&__receipt {
		max-width: rem-calc(485);
		margin: 1.75rem auto 2rem;

		@media print {
			max-width: none;
		}
	}
}
</style>
