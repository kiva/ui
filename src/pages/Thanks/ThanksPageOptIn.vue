<template>
	<www-page data-testid="thanks-page" class="tw-bg-eco-green-1">
		<div class="md:tw-pt-5 md:tw-rounded tw-mx-auto" :style="{maxWidth: '620px'}">
			<div class="tw-bg-marigold-1 md:tw-rounded-b">
				<div class="tw-bg-eco-green-3 tw-text-center tw-pt-4 md:tw-rounded-t">
					<h1 class="tw-text-white">
						Success!
					</h1>
					<p class="tw-text-subhead tw-text-white tw-mb-2">
						You and {{ borrowerName }} are in this together now.
					</p>
					<div class="tw-relative tw-mx-auto" style="width: 220px;">
						<div class="tw-absolute" style="width: 240px;">
							<svg class="tw-w-full" width="199" height="164" viewBox="0 0 199 164" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
								<path d="M38.3281 50.8176C33.2656 50.8176 32 46.4392 32 44.25C32 46.4392 30.7344 50.8176 25.6719 50.8176C30.7344 50.8176 32 55.4392 32 57.75C32 55.4392 33.2656 50.8176 38.3281 50.8176Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<g clip-path="url(#clip0_8313_593)">
									<rect x="172.358" y="0.118286" width="24.5106" height="27" fill="url(#pattern0_8313_593)" />
								</g>
								<g clip-path="url(#clip1_8313_593)">
									<rect x="158.901" y="18.4602" width="16.5287" height="17.617" fill="url(#pattern1_8313_593)" />
								</g>
								<g clip-path="url(#clip2_8313_593)">
									<rect x="1.33691" y="137.118" width="24.5106" height="27" fill="url(#pattern2_8313_593)" />
								</g>
								<defs>
									<pattern id="pattern0_8313_593" patternContentUnits="objectBoundingBox" width="1" height="1">
										<use xlink:href="#image0_8313_593" transform="scale(0.0078125 0.0070922)" />
									</pattern>
									<pattern id="pattern1_8313_593" patternContentUnits="objectBoundingBox" width="1" height="1">
										<use xlink:href="#image0_8313_593" transform="scale(0.0078125 0.0070922)" />
									</pattern>
									<pattern id="pattern2_8313_593" patternContentUnits="objectBoundingBox" width="1" height="1">
										<use xlink:href="#image0_8313_593" transform="scale(0.0078125 0.0070922)" />
									</pattern>
									<clipPath id="clip0_8313_593">
										<rect width="27.2604" height="27" fill="white" transform="translate(171.021)" />
									</clipPath>
									<clipPath id="clip1_8313_593">
										<rect width="18.383" height="17.617" fill="white" transform="translate(158 18.3829)" />
									</clipPath>
									<clipPath id="clip2_8313_593">
										<rect width="27.2604" height="27" fill="white" transform="translate(0 137)" />
									</clipPath>
									<image id="image0_8313_593" width="128" height="141" xlink:href="data:image/png;base64,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" />
								</defs>
							</svg>
						</div>
						<img
							:src="borrowerImage"
							alt="Borrower"
							class="tw-rounded-full tw-w-24 tw-h-24 tw-border-4 tw-border-white tw-mx-auto"
							:style="{boxShadow: '0px 4.42px 22.1px 0px #D1DCD6'}"
						>
					</div>
				</div>
				<div
					class="tw-bg-marigold-1 tw-w-full tw-px-3 tw-border-b tw-border-b-secondary"
				>
					<h4 class="tw-text-center tw-pt-6">
						What to expect next:
					</h4>
					<opt-in-steps
						:current-step="1"
						class="tw-mb-5"
					/>
					<div class="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
						<template v-if="isGuest">
							<h3 class="tw-text-center">
								Want to hear how you’re impacting {{ borrowerName }}’s life and more ways to help people like them?
							</h3>
							<kv-button>
								Yes, keep me updated
							</kv-button>
							<kv-button variant="ghost">
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
				<div class="tw-py-5 tw-px-3">
					<div class="tw-mb-2">
						<div
							class="tw-w-full tw-border tw-rounded tw-py-2 tw-px-3 tw-flex tw-justify-between"
							@click="openOrderConfirmation = !openOrderConfirmation"
						>
							<p>
								Show previous loan details
							</p>
							<kv-material-icon
								:icon="mdiChevronDown"
								class="tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500"
								:class="{'tw-rotate-180' : openOrderConfirmation}"
							/>
						</div>
						<kv-expandable
							v-show="openOrderConfirmation"
							easing="ease-in-out"
						>
							<div class="tw-py-2">
								<h3>
									Order confirmation
								</h3>
							</div>
						</kv-expandable>
					</div>
					<div>
						<div
							class="tw-w-full tw-border tw-rounded tw-py-2 tw-px-3 tw-flex tw-justify-between"
							@click="openShareModule = !openShareModule"
						>
							<p>
								Share
							</p>
							<kv-material-icon
								:icon="mdiChevronDown"
								class="tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500"
								:class="{'tw-rotate-180' : openShareModule}"
							/>
						</div>
						<kv-expandable
							v-show="openShareModule"
							easing="ease-in-out"
						>
							<div class="tw-py-2">
								<h3>
									Share
								</h3>
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
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			openOrderConfirmation: false,
			openShareModule: false,
			mdiChevronDown,
			userOptedOut: false,
			isGuest: false,
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
			return this.selectedLoan?.borrower?.name ?? '';
		},
		borrowerImage() {
			return this.selectedLoan?.borrower?.image?.default ?? '';
		},
		isGuestUsCheckout() {
			// Is a guest checking out only with US loans?
			// eslint-disable-next-line no-underscore-dangle
			return this.isGuest && this.loans.every(loan => loan?.__typename === 'LoanDirect');
		},
	},
	created() {
		let data = {};
		this.userOptedOut = this.$route.query.optOut === 'true';

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

		this.isGuest = this.receipt && !data?.my?.userAccount;
		this.receipt = data?.shop?.receipt ?? null;
		this.loans = getLoans(this.receipt);
	},
	mounted() {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			// misc. kiva colors
			colors: ['#6AC395', '##223829'],
			disableForReducedMotion: true,
		});
	},
};
</script>

<style lang="postcss" scoped>

</style>
