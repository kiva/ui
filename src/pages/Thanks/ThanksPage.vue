<template>
	<www-page :gray-background="true">
		<div class="row page-content">
			<div class="small-12 columns thanks">
				<div class="thanks__checkout-steps-wrapper hide-for-print">
					<kv-checkout-steps
						:steps="checkoutSteps"
						:current-step-index="2"
						style="max-width: 40rem;"
						class="tw-mx-auto"
					/>
					<hr class="tw-border-tertiary tw-my-3">
				</div>

				<div class="thanks__header hide-for-print">
					<h1 class="thanks__header-h1 tw-mb-4">
						Thank you!
					</h1>
					<p v-if="loans.length > 0" class="thanks__header-subhead tw-text-subhead tw-mb-2">
						Thanks for supporting <span class="fs-mask">{{ borrowerSupport }}</span>.<br>
					</p>
					<p v-if="lender.email" class="hide-for-print">
						We've emailed your order confirmation to
						<strong class="fs-exclude">{{ lender.email }}</strong>
					</p>
					<p v-else class="hide-for-print">
						We've emailed your order confirmation to you.
					</p>
				</div>
			</div>
		</div>

		<thanks-layout-v2
			:show-mg-cta="!isMonthlyGoodSubscriber && !isGuest"
			:show-guest-upsell="isGuest"
			:show-share="loans.length > 0"
		>
			<template #receipt>
				<checkout-receipt
					v-if="receipt"
					:lender="lender"
					:receipt="receipt"
				/>
			</template>
			<template #mg>
				<monthly-good-c-t-a
					:headline="ctaHeadline"
					:body-copy="ctaBodyCopy"
					:button-text="ctaButtonText"
				/>
			</template>
			<template #share>
				<social-share
					class="thanks__social-share"
					:lender="lender"
					:loans="loans"
				/>
			</template>
			<template #guest>
				<guest-upsell
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
import GuestUpsell from '@/components/Checkout/GuestUpsell';
import KvCheckoutSteps from '@/components/Kv/KvCheckoutSteps';
import MonthlyGoodCTA from '@/components/Checkout/MonthlyGoodCTA';
import SocialShare from '@/components/Checkout/SocialShare';
import WwwPage from '@/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '@/components/Thanks/ThanksLayoutV2';

import thanksPageQuery from '@/graphql/query/thanksPage.graphql';

import { processPageContentFlat } from '@/util/contentfulUtils';
import logFormatter from '@/util/logFormatter';
import { joinArray } from '@/util/joinArray';

export default {
	components: {
		CheckoutReceipt,
		GuestUpsell,
		KvCheckoutSteps,
		MonthlyGoodCTA,
		SocialShare,
		ThanksLayoutV2,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
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
			checkoutSteps: [
				'Basket',
				'Payment',
				'Thank You!'
			],
			isMonthlyGoodSubscriber: false,
			isGuest: false,
			pageData: {},
		};
	},
	apollo: {
		query: thanksPageQuery,
		preFetch: true,
		preFetchVariables({ cookieStore, route }) {
			return {
				checkoutId: numeral(route.query.kiva_transaction_id).value(),
				visitorId: cookieStore.get('uiv') || null,
			};
		},
		variables() {
			return {
				checkoutId: numeral(this.$route.query.kiva_transaction_id).value(),
				visitorId: this.cookieStore.get('uiv') || null,
			};
		},
		result(result) {
			const { data } = result;

			this.lender = {
				...(data?.my?.userAccount ?? {}),
				teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
			};

			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

			// The default empty object and the v-if will prevent the
			// receipt from rendering in the rare cases this query fails.
			// But it will not throw a server error.
			this.receipt = data?.shop?.receipt;
			this.isGuest = this.receipt && !data?.my?.userAccount;

			const loansResponse = this.receipt?.items?.values ?? [];
			this.loans = loansResponse
				.filter(item => item.basketItemType === 'loan_reservation')
				.map(item => item.loan);

			if (!this.isGuest && !data?.my?.userAccount) {
				logFormatter(
					`Failed to get lender for transaction id: ${this.$route.query.kiva_transaction_id}`,
					'error',
					{ result }
				);
			}
			if (!this.receipt) {
				logFormatter(
					`Failed to get receipt for transaction id: ${this.$route.query.kiva_transaction_id}`,
					'error',
					{ result }
				);
			}

			// Check for contentful content
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
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
			return this.pageData?.page?.contentGroups?.thanksMgCtaJan_2021;
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
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

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

	&__checkout-steps-wrapper {
		padding-bottom: 1.2rem;
	}

	&__social-share {
		margin-bottom: 0.5rem;
	}
}
</style>
