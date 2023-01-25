<template>
	<kv-social-share-button
		:modal-title="modalTitle"
		:share-message="modifiedShareMessage"
		:share-url="shareLink"
		variant="caution"
		:utm-campaign="utmCampaign"
		:utm-content="utmContent"
		:open-lightbox="forceLightbox"
		:loan-id="loan.id"
	>
		<template #modal-content>
			<div class="tw-relative">
				<textarea
					class="tw-w-full tw-border tw-border-tertiary tw-rounded-sm tw-h-12 tw-p-2"
					style="height: 10rem;"
					v-model="modifiedShareMessage"
				>
				</textarea>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-2 tw-right-2"
					:icon="mdiPencilOutline"
				/>
			</div>
		</template>
	</kv-social-share-button>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiPencilOutline } from '@mdi/js';
import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'ShareButton',
	components: {
		KvSocialShareButton,
		KvMaterialIcon
	},
	data() {
		return {
			modifiedShareMessage: '',
			mdiPencilOutline,
			borrowedLoanId: null
		};
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		lender: {
			type: Object,
			default: () => {}
		},
		loan: {
			type: Object,
			required: true
		},
		campaign: {
			type: String,
			required: true
		}
	},
	created() {
		// This query is part of the header query and should be in the cache.
		// It's also not critical that this is 100% accurate since most
		// borrowers will get prompted to share via the share query param
		const myBorrowedLoanQuery = this.apollo.readQuery({
			query: gql`
				query mostRecentBorrowedLoan {
					my {
						mostRecentBorrowedLoan {
							id
						}
					}
				}
			`,
		});
		this.borrowedLoanId = myBorrowedLoanQuery?.my?.mostRecentBorrowedLoan?.id ?? null;
		this.modifiedShareMessage = this.shareMessage;
	},
	computed: {
		progressPercent() {
			// percent as a whole number 0-100
			const percent = this.loan?.fundraisingPercent ?? 0;
			return Math.round(percent * 100);
		},
		amountRemaining() {
			return `$${this.loan?.loanAmount - this.loan?.loanFundraisingInfo?.fundedAmount}`;
		},
		isBorrower() {
			// If the loan id's match or the share query param is present, the user is the borrower
			return this.loan?.id === this.borrowedLoanId || this.$route.query.share === 'true';
		},
		modalTitle() {
			if (this.isBorrower) {
				switch (true) {
					case (this.progressPercent >= 50):
						return 'You’re almost there';
					case (this.progressPercent < 50):
					default:
						return 'Set a goal for today';
				}
			}
			// Not the borrower of this loan
			switch (true) {
				case (this.progressPercent >= 50):
					return 'Push this loan over the finish line!';
				case (this.progressPercent < 50):
				default:
					return `Get ${this.name}'s loan back on track`;
			}
		},
		name() {
			if (this.loan.name && this.loan.anonymization !== 'full') {
				return this.loan.name;
			}
			return 'this lender';
		},
		shareMessage() {
			if (this.isBorrower) {
				switch (true) {
					case (this.progressPercent >= 50):
						return `My fundraiser on Kiva is over halfway there — only ${this.amountRemaining} to go!`;
					case (this.progressPercent < 50):
					default:
						return `I'm crowdfunding a loan on Kiva — Help me hit ${this.progressPercent + 10}% today!`;
				}
			}
			// Not the borrower of this loan
			const borrowerName = this.$options.filters.changeCase(this.name, 'titleCase');
			switch (true) {
				case (this.progressPercent >= 50):
					return `${borrowerName}'s loan is over halfway there on Kiva – only ${this.amountRemaining} to go!`;
				case (this.progressPercent < 50):
				default:
					// eslint-disable-next-line max-len
					return `${borrowerName} is crowdfunding a loan on Kiva — Let's get them to ${this.progressPercent + 10}% today!`;
			}
		},
		utmContent() {
			if (this.lender?.public && this.lender?.inviterName) return this.lender.inviterName;
			return 'anonymous';
		},
		utmCampaign() {
			// If 'emlid' is present in the query params, append it to the campaign prop.
			// This is used to track email campaigns.
			if (this.$route.query.emlid) {
				return `${this.campaign}_eml${this.$route.query.emlid}`;
			}
			return this.campaign;
		},
		shareLink() {
			if (this.loan.id && this.lender?.inviterName) {
				return `/invitedby/${this.lender.inviterName}/for/${this.loan.id}`; // eslint-disable-line max-len
			}
			return `${this.$route.path}`;
		},
		forceLightbox() {
			// If query param share=true return true to force lightbox open
			return this.$route.query.share === 'true';
		}
	},
};
</script>
