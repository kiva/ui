<template>
	<div class="campaign-thanks">
		<div class="campaign-thanks__container">
			<template v-if="loans.length > 0">
				<header class="campaign-thanks__header hide-for-print">
					<h2>Thanks for supporting {{ borrowerSupport }}!</h2>
					<p>We've emailed your order confirmation to <span class="fs-exclude">{{ lender.email }}</span></p>
				</header>
				<section class="campaign-thanks__partner-block">
					<campaign-partner-thanks :partner-content="partnerContent" />
				</section>
				<kv-accordion-item id="thanks-share">
					<template #header>
						<h2>Share the Good</h2>
					</template>
					<social-share
						class="campaign-thanks__social-share"
						:lender="lender"
						:loans="loans"
					/>
				</kv-accordion-item>
				<kv-accordion-item id="thanks-receipt">
					<template #header>
						<h2>Receipt</h2>
					</template>
					<checkout-receipt
						v-if="showReceipt"
						class="campaign-thanks__receipt"
						:disable-redirects="true"
						:lender="lender"
						:receipt="receipt"
					/>
				</kv-accordion-item>
			</template>
			<div
				v-else
				class="campaign-thanks__spinner"
			>
				<kv-loading-spinner />
			</div>
		</div>
		<canvas
			class="campaign-thanks__confetti-canvas"
			ref="confettiCanvas"
		></canvas>
	</div>
</template>

<script>
import confetti from 'canvas-confetti';

import KvAccordionItem from '@/components/Kv/KvAccordionItem';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShare from '@/components/Checkout/SocialShare';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import { joinArray } from '@/util/joinArray';
import CampaignPartnerThanks from './CampaignPartnerThanks';

export default {
	components: {
		CampaignPartnerThanks,
		CheckoutReceipt,
		KvAccordionItem,
		KvLoadingSpinner,
		SocialShare
	},
	inject: ['apollo'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	props: {
		transactionId: {
			type: Number,
			default: null,
		},
		partnerContent: {
			type: Object,
			default() { return {}; }
		}
	},
	data() {
		return {
			lender: {},
			loans: [],
			receipt: {},
			showReceipt: false,
		};
	},
	computed: {
		borrowerSupport() {
			const loanNames = this.loans.map(loan => loan.name);
			if (loanNames.length > 3) {
				return `these ${loanNames.length} borrowers`;
			}
			return joinArray(loanNames, 'and');
		}
	},
	mounted() {
		if (this.transactionId) {
			this.fetchReceipt();
		}
	},
	methods: {
		fetchReceipt() {
			this.apollo.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: this.transactionId
				}
			}).then(async ({ data }) => {
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

				this.showReceipt = true;
				await this.$nextTick();
				this.celebrate();
			});
		},
		celebrate() {
			const confettiCanvasEl = this.$refs.confettiCanvas;
			confettiCanvasEl.confetti = confettiCanvasEl.confetti || confetti.create(confettiCanvasEl, {
				resize: true,
				useWorker: true
			});
			confettiCanvasEl.confetti({
				origin: {
					y: 0.2
				},
				particleCount: 150,
				spread: 200,
				disableForReducedMotion: true,
				// misc. kiva colors
				colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c']
			});
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-thanks {
	position: relative;
	@include breakpoint(large) {
		width: rem-calc(600);
	}

	&__spinner {
		display: flex;
		justify-content: center;
		margin: 2rem 2rem 0;
	}

	&__container {
		position: relative;
		z-index: 1;
	}

	&__confetti-canvas {
		position: absolute;
		z-index: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	&__header {
		text-align: center;
		margin-bottom: 2rem;
	}

	&__partner-block {
		text-align: center;
		margin-bottom: 2rem;
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
