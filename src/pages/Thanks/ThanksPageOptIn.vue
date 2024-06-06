<template>
	<www-page data-testid="thanks-page" class="tw-bg-eco-green-1">
		<div class="md:tw-py-6 md:tw-rounded tw-mx-auto tw-overflow-x-hidden tw-relative" :style="{maxWidth: '620px'}">
			<div class="tw-bg-marigold-1 md:tw-rounded-b">
				<div class="tw-bg-eco-green-3 tw-text-center tw-pt-4 md:tw-rounded-t">
					<h1 class="tw-text-white">
						Success!
					</h1>
					<p class="tw-text-subhead tw-text-white tw-mb-2">
						You and {{ borrowerName }} are in this together now.
					</p>
					<div class="tw-relative tw-mx-auto" style="width: 200px;">
						<div class="tw-absolute tw-w-full tw-h-full tw-z-1" style="width: 240px;">
							<img
								class="tw-w-full tw-h-full"
								src="@/assets/images/thanks-page/sparkles.svg"
							>
						</div>
						<borrower-image
							class="borrower-image"
							:style="{ boxShadow: '0px 4.42px 22.1px 0px #D1DCD6' }"
							:alt="borrowerName"
							:aspect-ratio="1"
							:default-image="{ width: 400, faceZoom: 30 }"
							:hash="hash"
							:images="[
								{ width: 400, faceZoom: 30 },
							]"
						/>
					</div>
				</div>
				<div class="tw-relative tw-flex tw-justify-center">
					<div class="tw-bg-marigold-1 tw-absolute oval"></div>
					<div
						class="tw-bg-marigold-1 tw-w-full tw-px-3 tw-border-b tw-border-b-secondary tw-z-1"
					>
						<h4 class="tw-text-center tw-pt-1">
							What to expect next:
						</h4>
						<opt-in-steps
							class="tw-mb-5"
							:weeks-to-repay="weeksToRepay"
						/>
						<div class="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
							<template v-if="userOptedOut && isGuest">
								<h3 class="tw-text-center">
									<!-- eslint-disable-next-line max-len -->
									Want to hear how you’re impacting {{ borrowerName }}’s life and more ways to help people like them?
								</h3>
								<kv-button
									v-kv-track-event="[
										'thanks',
										'click',
										'accept-opt-in-request',
									]"
								>
									Yes, keep me updated
								</kv-button>
								<kv-button
									variant="ghost"
									class="ghost-button"
									v-kv-track-event="[
										'thanks',
										'click',
										'reject-opt-in-request',
									]"
								>
									No, I don’t want to receive updates
								</kv-button>
							</template>
							<template v-else>
								<kv-button>
									Go to my kiva
								</kv-button>
							</template>
						</div>
					</div>
				</div>
				<div class="tw-py-5 tw-px-3">
					<div class="tw-mb-2">
						<!-- eslint-disable-next-line max-len -->
						<div
							v-if="userOptedOut && isGuest"
							class="
								tw-w-full tw-border tw-rounded
								tw-flex tw-justify-between tw-cursor-pointer
								tw-py-2 tw-px-3
							"
							@click="openCreateAccount = !openCreateAccount"
							v-kv-track-event="[
								'thanks',
								'click',
								'open-account-creation-drawer',
							]"
						>
							<p>
								Create your account
							</p>
							<kv-material-icon
								:icon="mdiChevronDown"
								class="expandable-button"
								:class="{'tw-rotate-180' : openCreateAccount}"
							/>
						</div>
						<kv-expandable
							v-show="openCreateAccount"
							easing="ease-in-out"
						>
							<div class="tw-py-2">
								<h2>Before you go!</h2>
								<!-- eslint-disable-next-line max-len -->
								<p>Finish setting up your account to track and relend your money as you are paid back.</p>
								<guest-account-creation
									class="tw-pt-3 account-creation"
									event-category="thanks"
									event-label="open-account-creation-drawer"
								/>
							</div>
						</kv-expandable>
					</div>
					<div class="tw-mb-2">
						<!-- eslint-disable-next-line max-len -->
						<div
							class="
								tw-w-full tw-border tw-rounded
								tw-flex tw-justify-between tw-cursor-pointer
								tw-py-2 tw-px-3
							"
							@click="openOrderConfirmation = !openOrderConfirmation"
							v-kv-track-event="[
								'thanks',
								'click',
								'open-order-confirmation-drawer',
							]"
						>
							<p>
								Show previous loan details
							</p>
							<kv-material-icon
								:icon="mdiChevronDown"
								class="expandable-button"
								:class="{'tw-rotate-180' : openOrderConfirmation}"
							/>
						</div>
						<kv-expandable
							v-show="openOrderConfirmation"
							easing="ease-in-out"
						>
							<div class="tw-py-2">
								<checkout-receipt
									v-if="receipt"
									:lender="lender"
									:receipt="receipt"
								/>
							</div>
						</kv-expandable>
					</div>
					<div>
						<div
							class="
								tw-w-full tw-border tw-rounded
								tw-flex tw-justify-between tw-cursor-pointer
								tw-py-2 tw-px-3
							"
							@click="openShareModule = !openShareModule"
							v-kv-track-event="[
								'thanks',
								'click',
								'open-share-drawer',
							]"
						>
							<p>
								Share
							</p>
							<kv-material-icon
								:icon="mdiChevronDown"
								class="expandable-button"
								:class="{'tw-rotate-180' : openShareModule}"
							/>
						</div>
						<kv-expandable
							v-show="openShareModule"
							easing="ease-in-out"
						>
							<div class="tw-py-2">
								<social-share-v2
									v-if="receipt"
									class="social-share"
									:lender="lender"
									:loans="loans"
								/>
							</div>
						</kv-expandable>
					</div>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import OptInSteps from '@/components/Thanks/OptInSteps';
import KvExpandable from '@/components/Kv/KvExpandable';
import { mdiChevronDown } from '@mdi/js';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import numeral from 'numeral';
import { orderBy } from 'lodash';
import logReadQueryError from '@/util/logReadQueryError';
import confetti from 'canvas-confetti';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import { addMonths, differenceInWeeks } from 'date-fns';
import GuestAccountCreation from '@/components/Forms/GuestAccountCreation';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const getLoans = receipt => {
	const loansResponse = receipt?.items?.values ?? [];
	const loans = loansResponse
		.filter(item => item.basketItemType === 'loan_reservation')
		.map(item => {
			return {
				...item.loan,
				team: item.team,
			};
		});

	return loans;
};

export default {
	name: 'ThanksPageOptIn',
	components: {
		WwwPage,
		KvButton,
		OptInSteps,
		KvExpandable,
		KvMaterialIcon,
		CheckoutReceipt,
		SocialShareV2,
		BorrowerImage,
		GuestAccountCreation,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			openOrderConfirmation: false,
			openShareModule: false,
			openCreateAccount: false,
			mdiChevronDown,
			userOptedOut: false,
			isGuest: false,
			lender: {},
			loans: [],
			receipt: null,
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			const transactionId = route.query?.kiva_transaction_id
				? numeral(route.query?.kiva_transaction_id).value()
				: null;

			return client.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: cookieStore.get('uiv') || null,
				}
			});
		}
	},
	computed: {
		selectedLoan() {
			/**  We should select a loan if we are going to ask for comments for it.
			* The priority order is:
			* 1. PFP loan
			* 2. Partner loan With Team Attribution
			* 3. Loan with the highest unreservedAmount
			* loans should be sorted by unreservedAmount.
			*/
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			if (this.hasPfpLoan) {
				return orderedLoans.find(loan => loan.inPfp);
			}
			if (this.hasTeamAttributedPartnerLoan) {
				return orderedLoans.find(loan => loan?.team?.name);
			}
			return orderedLoans[0] || {};
		},
		hasPfpLoan() {
			return this.loans.some(loan => loan.inPfp);
		},
		hasTeamAttributedPartnerLoan() {
			return this.loans.some(loan => loan?.distributionModel === 'fieldPartner' && loan?.team?.name);
		},
		borrowerName() {
			return this.selectedLoan?.name ?? '';
		},
		isGuestUsCheckout() {
			// Is a guest checking out only with US loans?
			// eslint-disable-next-line no-underscore-dangle
			return this.isGuest && this.loans.every(loan => loan?.__typename === 'LoanDirect');
		},
		hash() {
			return this.selectedLoan.image?.hash ?? '';
		},
		weeksToRepay() {
			const date = this.selectedLoan?.terms?.expectedPayments?.[0]?.dueToKivaDate ?? null;
			const today = new Date();
			if (date) {
				// Get the number of weeks between the first repayment date (in the future) and now
				return `${differenceInWeeks(Date.parse(date), today)} weeks`;
			}

			// Calculating a possible range of weeks between the planned expiration date and a month after
			const expDate = Date.parse(this.selectedLoan?.plannedExpirationDate);
			const minDate = differenceInWeeks(addMonths(today, 1), today);
			const maxDate = differenceInWeeks(addMonths(expDate, 1), today);

			if (minDate === maxDate) {
				return `${minDate} weeks`;
			}

			return `${minDate} - ${maxDate} weeks`;
		}
	},
	created() {
		let data = {};
		this.userOptedOut = this.$route.query.optOut === '1';

		const transactionId = this.$route.query?.kiva_transaction_id
			? numeral(this.$route.query?.kiva_transaction_id).value()
			: null;

		try {
			data = this.apollo.readQuery({
				query: thanksPageQuery,
				variables: {
					checkoutId: transactionId,
					visitorId: this.cookieStore.get('uiv') || null,
				}
			});
		} catch (e) {
			logReadQueryError(e, `Thanks page readQuery failed: (transaction_id: ${transactionId})`);
		}

		this.receipt = data?.shop?.receipt ?? null;
		this.isGuest = this.receipt && !data?.my?.userAccount;

		this.loans = getLoans(this.receipt);
		this.lender = {
			...(data?.my?.userAccount ?? {}),
			publicName: data?.my?.lender?.name ?? '',
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
			imageUrl: data?.my?.lender?.image?.url ?? '',
			publicId: data?.my?.lender?.publicId ?? '',
		};

		this.$kvTrackEvent('thanks', 'view', 'opt-in-request', this.isGuest ? 'guest' : 'signed-in');
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#6AC395', '#223829'],
			disableForReducedMotion: true,
		});
	},
};
</script>

<style lang="postcss" scoped>

.oval {
	width: 653px;
	height: 181px;
	border-radius: 50%;
	margin-top: -90px;
}

.expandable-button {
	@apply tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500;
}

.borrower-image {
	@apply tw-w-full tw-rounded-full tw-bg-black tw-border-4 tw-border-white tw-z-2;
}

.borrower-image >>> img.tw-object-contain {
	@apply tw-object-fill;
}

.social-share >>> .share__social.social {
	@apply tw-w-full;
}

.ghost-button >>> span {
	@apply tw-bg-transparent;
}

.account-creation >>> input {
	@apply tw-bg-marigold-1;
}

</style>
