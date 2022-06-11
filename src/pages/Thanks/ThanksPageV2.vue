<template>
	<www-page
		:gray-background="true"
	>
		<div class="row page-content">
			<div class="large-2">{{' '}}</div>
			<div class="small-12 large-8 columns thanks">
				<div class="thanks__header hide-for-print">
					<template v-if="receipt">
						<div
							class="thanks__header-h1 tw-mt-1 tw-mb-3"
							:class="{
								'tw-text-h2': showAutoDepositUpsell
							}"
						>
							<kv-material-icon
								class="tw-w-3 tw-h-3 tw-my-3 tw-align-middle tw-mr-0.5 success"
								:icon="mdiCheckAll"
							/> Success, your receipt has been sent to <strong>{{lender.email}}</strong>
						</div>
						<borrower-image
							class="
								tw-w-full
								tw-bg-black
								tw-rounded
								tw--mb-1.5
								md:tw--mb-1
							"
							data-testid="bp-story-borrower-image"
							:alt="selectedLoan.name"
							:aspect-ratio="2 / 5"
							:default-image="{ width: 612 }"
							:hash="selectedLoan.image.hash"
							:images="[
								{ width: 612, viewSize: 1024 },
								{ width: 580, viewSize: 768 },
								{ width: 416, viewSize: 480 },
								{ width: 374, viewSize: 414 },
								{ width: 335, viewSize: 375 },
								{ width: 280 },
							]"
						/>
						<div class="tw-flex-auto tw-mb-2">
							<figure>
								<figcaption class="tw-flex progress">
									<template v-if="!fundedPage">
										<div class="tw-flex-auto tw-text-left">
											<p class="tw-text-h3 tw-m-0 progress__to-go" data-testid="bp-summary-amount-to-go">
												{{ selectedLoan.unreservedAmount | numeral('$0,0[.]00') }} TO GO
											</p>
										</div>
										<p class="tw-flex-auto tw-text-right progress__days-remaining" data-testid="bp-summary-timeleft">
											<span lass="tw-text-h3 tw-block tw-m-0">
												{{ selectedLoan.fundraisingTimeLeft }}
											</span>
											<span class="tw-block">
												days remaining
											</span>
										</p>
									</template>
									<div v-else>
										<p class="tw-text-h3 tw-m-0" data-testid="bp-summary-amount-to-go">
											This loan is fully funded!
										</p>
										<div class="md:tw-flex tw-gap-2">
											<p class="tw-text-h4 tw-text-secondary tw-block">
												100% funded
											</p>
											<p class="tw-text-h4 tw-text-action tw-block">
												<router-link
													:to="`/lend/${$route.params.id}?minimal=false`"
													v-kv-track-event="['Lending', 'full-borrower-profile-exit-link']"
												>
													View the full borrower profile
												</router-link>
											</p>
										</div>
									</div>
								</figcaption>
								<kv-progress-bar
									class="tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary"
									aria-label="Percent the loan has funded"
									:value="selectedLoan.fundraisingPercent * 100"
								/>
							</figure>
						</div>
					</template>
					<template>
						<h1
							class="thanks__headline-h1 tw-mt-1 tw-mb-3"
							:class="{
								'tw-text-h2': showAutoDepositUpsell
							}"
						>
							Get a $25 lending credit by inspiring others.
						</h1>
						<p class="tw-text-h3 tw-m-0 thanks__base-text">
							Introduce someone new to Kiva and we'll give you $25 to support another borrower. Your Kiva Lending Credit will be applied automatically.
						</p>
					</template>
					<template>
						<social-share-v2
							class="thanks__social-share"
							:lender="lender"
							:loans="loans"
							:show-header="false"
						/>
					</template>
				</div>
			</div>
			<div class="large-2">{{' '}}</div>
		</div>
	</www-page>
</template>

<script>
import confetti from 'canvas-confetti';
import numeral from 'numeral';
import logReadQueryError from '@/util/logReadQueryError';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import GuestUpsell from '@/components/Checkout/GuestUpsell';
import AutoDepositCTA from '@/components/Checkout/AutoDepositCTA';
import MonthlyGoodCTA from '@/components/Checkout/MonthlyGoodCTA';
import SocialShare from '@/components/Checkout/SocialShare';
import SocialShareV2 from '@/components/Checkout/SocialShareV2';
import WwwPage from '@/components/WwwFrame/WwwPage';
import ThanksLayoutV2 from '@/components/Thanks/ThanksLayoutV2';
import { mdiCheckAll } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import orderBy from 'lodash/orderBy';
import { processPageContentFlat } from '@/util/contentfulUtils';
import logFormatter from '@/util/logFormatter';
import { joinArray } from '@/util/joinArray';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

export default {
	name: 'ThanksPage',
	components: {
		AutoDepositCTA,
		CheckoutReceipt,
		GuestUpsell,
		KvButton,
		MonthlyGoodCTA,
		SocialShare,
		SocialShareV2,
		ThanksLayoutV2,
		WwwPage,
		KvMaterialIcon,
		BorrowerImage,
		KvProgressBar,
	},
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			autoDepositUpsellCookie: null,
			autoDepositUpsellExpVersion: null,
			imageRequire,
			lender: {},
			loans: [],
			receipt: null,
			isAutoDepositSubscriber: false,
			isMonthlyGoodSubscriber: false,
			hasModernSub: false,
			isGuest: false,
			pageData: {},
			simpleSocialShareVersion: '',
			mdiCheckAll,
			timeLeftMs: 0,
			fundedPage: false
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			return client.query({
				query: thanksPageQuery,
				variables: {
					checkoutId: numeral(route.query.kiva_transaction_id).value(),
					visitorId: cookieStore.get('uiv') || null,
				}
			}).then(({ data }) => {
				const isLoggedIn = data?.my?.userAccountId?.id !== null;
				const hasAutoDeposit = data?.my?.autoDeposit !== null;
				const hasLegacySubs = data?.my?.subscriptions?.values?.length !== 0;
				const modernSubscriptions = data?.mySubscriptions?.values ?? [];
				const hasModernSub = modernSubscriptions.length !== 0;
				const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !hasModernSub;

				return Promise.all([
					client.query({ query: experimentAssignmentQuery, variables: { id: 'simple_thanks_share' } }),
					upsellEligible ? client.query({ query: experimentAssignmentQuery, variables: { id: 'thanks_ad_upsell' } }) : Promise.resolve() // eslint-disable-line max-len
				]);
			}).catch(errorResponse => {
				logFormatter(
					'Thanks page preFetch failed: ',
					'error',
					{ errorResponse }
				);
			});
		}
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
		showAutoDepositUpsell() {
			// Check cookie and eligibility before showing
			if (!this.isGuest && this.autoDepositUpsellExpVersion === 'b') {
				return true;
			}
			return false;
		},
		selectedLoan() {
			debugger
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);
			return orderedLoans[0] || {};
		},
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
		try {
			data = this.apollo.readQuery({
				query: thanksPageQuery,
				variables: {
					checkoutId: numeral(this.$route.query.kiva_transaction_id).value(),
					visitorId: this.cookieStore.get('uiv') || null,
				}
			});
		} catch (e) {
			logReadQueryError(e, 'Thanks Page Data');
		}

		const modernSubscriptions = data?.mySubscriptions?.values ?? [];
		this.hasModernSub = modernSubscriptions.length !== 0;
		this.lender = {
			...(data?.my?.userAccount ?? {}),
			teams: data?.my?.teams?.values?.map(value => value.team) ?? [],
		};

		this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
		const hasAutoDeposit = data?.my?.autoDeposit?.id ?? false;
		this.isAutoDepositSubscriber = !!(hasAutoDeposit && !this.isMonthlyGoodSubscriber);

		const isLoggedIn = data?.my?.userAccountId?.id !== null;
		const hasLegacySubs = data?.my?.subscriptions?.values?.length !== 0;
		const upsellEligible = isLoggedIn && !hasAutoDeposit && !hasLegacySubs && !this.hasModernSub;

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = data?.shop?.receipt ?? null;
		this.isGuest = this.receipt && !data?.my?.userAccount;

		const loansResponse = this.receipt?.items?.values ?? [];
		this.loans = loansResponse
			.filter(item => item.basketItemType === 'loan_reservation')
			.map(item => item.loan);

		if (!this.isGuest && !data?.my?.userAccount) {
			logFormatter(
				`Failed to get lender for transaction id: ${this.$route.query.kiva_transaction_id}`,
				'error',
				{ data }
			);
		}
		if (!this.receipt) {
			logFormatter(
				`Failed to get receipt for transaction id: ${this.$route.query.kiva_transaction_id}`,
				'error',
				{ data }
			);
		}

		// Check for contentful content
		const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
		this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

		// Check for upsell eligibility and experiment state
		if (upsellEligible) {
			// CORE-427 Thanks auto deposit upsell experiment
			const autoDepositUpsellExp = this.apollo.readFragment({
				id: 'Experiment:thanks_ad_upsell',
				fragment: experimentVersionFragment,
			}) || {};

			this.autoDepositUpsellExpVersion = autoDepositUpsellExp.version;
			if (this.autoDepositUpsellExpVersion) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-CORE-427-Feb-2022',
					this.autoDepositUpsellExpVersion,
				);
			}
		}

		if (!this.isGuest) {
			// MARS-96 Simplified social share experiment
			const simpleSocialShareExp = this.apollo.readFragment({
				id: 'Experiment:simple_thanks_share',
				fragment: experimentVersionFragment,
			}) || {};

			this.simpleSocialShareVersion = simpleSocialShareExp.version;
			if (this.simpleSocialShareVersion) {
				this.$kvTrackEvent(
					'Thanks',
					'EXP-MARS-96-May2022',
					this.simpleSocialShareVersion,
				);
			}
		}
	},
	mounted() {
		if (this.receipt) {
			confetti({
				origin: {
					y: 0.2
				},
				particleCount: 150,
				spread: 200,
				colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c'],
				disableForReducedMotion: true,
			});
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 0 10px;

	@media print {
		padding: 0;
	}

	&:last-child {
		padding-bottom: 5rem;
	}
}

.success {
	color: #1B6E43;
}

.progress {
	&__to-go {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: #212121;
		font-weight: bold;
	}

	&__days-remaining {
		font-size: 14px;
		margin-top: 15px;
		margin-bottom: 5px;
		color: #212121;
		text-transform: uppercase;
		font-weight: bold;
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

	&__headline {
		text-align: left;
	}

	&__base-text {
		font-weight: 300;
		font-size: 25px;
		text-align: left;
		line-height: 1.4;
	}

	&__social-share {
		margin-bottom: 0.5rem;
	}
}
</style>
