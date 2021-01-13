<template>
	<div class="small-12 large-8 align-self-middle columns">
		<div class="small-12 columns thanks">
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
		</div>

		<template v-if="loans.length > 0">
			<social-share
				class="thanks__social-share"
				:lender="lender"
				:loans="loans"
			/>
		</template>

		<div class="small-12 columns thanks">
			<hr v-if="loans.length > 0">
			<checkout-receipt
				v-if="showReceipt"
				class="thanks__receipt"
				:lender="lender"
				:receipt="receipt"
			/>
		</div>
		<canvas
			class="campaign-thanks__confetti-canvas"
			ref="confettiCanvas"
		></canvas>
	</div>
</template>

<script>
import confetti from 'canvas-confetti';

import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShare from '@/components/Checkout/SocialShare';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import { joinArray } from '@/util/joinArray';

export default {
	components: {
		CheckoutReceipt,
		SocialShare,
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
				// misc. kiva colors
				colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c']
			});
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.thanks {
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
		margin-bottom: 3rem;
	}

	&__header-h1 {
		@include large-text();

		margin-bottom: 1.5rem;
	}

	&__header-subhead {
		@include featured-text();
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
