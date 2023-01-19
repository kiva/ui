<template>
	<www-page>
		<div
			class="tw-w-full tw-bg-brand-50"
		>
			<div
				class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8 tw-flex tw-items-center tw-justify-center"
				style="max-width: 1200px;"
			>
				<kv-material-icon
					class="tw-w-3 tw-h-3 tw-my-3 tw-align-middle tw-text-action tw-flex-none tw-mr-2"
					:icon="mdiCheckAll"
				/>
				<div v-if="receipt">
					<p>
						Success, your receipt has been sent to
						<strong class="data-hj-suppress">{{ lender.email }}</strong>
					</p>
				</div>
			</div>
		</div>
		<kv-page-container v-if="receipt">
			<kv-grid class="tw-grid-cols-12 tw-pt-3 md:tw-pt-4 lg:tw-pt-6 tw-mb-4 md:tw-mb-6">
				<div
					class="tw-col-span-12 md:tw-col-span-6"
				>
					<borrower-image
						class="
								tw-w-full
								tw-bg-black
								tw-rounded
								tw--mb-1.5
								md:tw--mb-1
							"
						data-testid="bp-story-borrower-image"
						:alt="loan.name"
						:aspect-ratio="1 / 2"
						:default-image="{ width: 612 }"
						:hash="loan.image.hash"
						:images="[
							{ width: 612, viewSize: 1024 },
							{ width: 580, viewSize: 768 },
							{ width: 416, viewSize: 480 },
							{ width: 374, viewSize: 414 },
							{ width: 335, viewSize: 375 },
							{ width: 280 },
						]"
					/>
					<figure>
						<figcaption class="tw-flex tw-justify-between tw-mt-1.5">
							<p class="tw-text-h4 tw-font-medium">
								{{ loan.unreservedAmount | numeral('$0,0[.]00') }} TO GO
							</p>
							<p class="tw-text-h4 tw-font-medium">
								{{ loan.fundraisingTimeLeft }} remaining
							</p>
						</figcaption>
						<kv-progress-bar
							aria-label="Percent the loan has funded"
							:value="loan.fundraisingPercent * 100"
						/>
					</figure>
				</div>
				<!-- challenge complete copy -->
				<div class="tw-col-span-12 md:tw-col-span-6" v-if="loansRemainingInChallenge === 0">
					<h2>Way to go!</h2>
					<p class="tw-text-subhead tw-mt-1">
						You've joined more than 800 lenders in collective action against climate change.
					</p>
					<div
						class="tw-bg-black tw-bg-opacity-[65%] tw-rounded tw-flex tw-items-center
						tw-p-1 tw-mt-3 md:tw-mt-6"
						style="max-width: 295px;"
					>
						<h3 class="tw-text-primary-inverse tw-mr-1.5">
							You've completed your first challenge!
						</h3>
						<icon-sun class="tw-h-5 tw-w-5 tw-mr-0.5 tw-flex-none" />
					</div>
				</div>
				<!-- challenge in progress copy -->
				<div class="tw-col-span-12 md:tw-col-span-6" v-if="loansRemainingInChallenge !== 0">
					<h2>Way to go!</h2>
					<p class="tw-text-subhead tw-mt-1">
						<!-- eslint-disable-next-line max-len -->
						By supporting this eco-friendly loan, you're enabling sustainable lifestyles that slow climate change.
					</p>
					<div
						class="tw-bg-black tw-rounded tw-flex tw-items-center
						tw-p-1 tw-mt-3 md:tw-mt-6 tw-relative"
						style="max-width: 390px;"
					>
						<h3 class="tw-text-primary-inverse tw-mr-1.5">
							You’re on the way to your first achievement!
						</h3>
						<icon-sun-half class="tw-h-5 tw-w-5 tw-mr-0.5 tw-flex-none" />
						<icon-spark class="tw-h-5 tw-w-5 tw-absolute" style="right: -2rem; top: -2rem;" />
					</div>
				</div>
			</kv-grid>
			<!-- Challenge Complete -->
			<template v-if="loansRemainingInChallenge === 0">
				<hr
					class="tw-block tw-border-tertiary tw-w-full tw-mb-3"
				>
				<div
					class="tw-flex tw-w-full tw-justify-between"
				>
					<h2 class="tw-mr-1.5">
						Your first challenge
					</h2>
					<div
						class="tw-flex"
					>
						<icon-sun class="tw-h-6 tw-w-6 tw-mr-3 tw-flex-none tw-mt-0.5" />
						<div>
							<h3 class="tw-mb-1">
								Building climate resilience
							</h3>
							<kv-progress-bar
								aria-label="Completion of challenge"
								:value="100"
							/>
							<p class="tw-text-h4 tw-text-right tw-font-medium tw-mt-1">
								complete!
							</p>
						</div>
					</div>
				</div>
				<div class="tw-mt-3 tw-mb-4 md:tw-mb-6">
					<p class="tw-text-subhead">
						{{ climateFact }}
					</p>
					<kv-social-share-button
						class="tw-mt-3"
						modal-title="Spread the word about climate change solutions"
						:share-message="climateFact"
						share-url="/blog/biodigester-borrowers-the-triple-bottom-line?game=won"
						variant="primary"
						utm-campaign="social_eco_thanks_page"
						style="max-width: 190px;"
					>
						Share this fact
						<template #modal-content>
							{{ climateFact }}
						</template>
					</kv-social-share-button>
				</div>
			</template>
		</kv-page-container>
		<!-- Challenge In Progress -->
		<div
			class="tw-w-full tw-bg-brand-50 tw-py-4"
			v-if="loansRemainingInChallenge !== 0 && receipt"
		>
			<kv-page-container>
				<div
					class="md:tw-flex tw-w-full tw-justify-between"
				>
					<h2 class="tw-mr-1.5 tw-mb-2">
						{{ loansRemainingInChallenge }} more loans to complete this challenge
					</h2>
					<div
						class="tw-flex tw-mb-2"
					>
						<icon-sun-half
							class="tw-h-6 tw-w-6 tw-mr-3 tw-flex-none tw-mt-0.5"
						/>
						<div>
							<h3 class="tw-mb-1">
								Building climate resilience
							</h3>
							<kv-progress-bar
								aria-label="Completion of challenge"
								:value="66"
							/>
							<p class="tw-text-h4 tw-text-right tw-font-medium tw-mt-1">
								<!-- eslint-disable-next-line max-len -->
								{{ loansRemainingInChallenge }} {{ loansRemainingInChallenge == 1 ? 'loan' : 'loans' }} to go
							</p>
						</div>
					</div>
				</div>
				<p class="tw-text-subhead">
					<!-- eslint-disable-next-line max-len -->
					On Kiva a little goes a long way in offsetting your carbon footprint. Make a {{ categoriesMissingString }} loan to go greener.
				</p>
				<div v-for="(channelId, index) in categoriesMissingIds" :key="index" class="tw-mt-6">
					<kiva-classic-single-category-carousel
						:class="{ 'tw-pt-4': index === 0 }"
						:climate-challenge="true"
						:loan-channel-id="channelId"
						:loan-display-settings="loanDisplaySettings"
						:lend-now-button="true"
						:query-context="ecoExpQueryContext"
					/>
				</div>
			</kv-page-container>
		</div>
	</www-page>
</template>

<script>
// This component was used in the Eco Challenge. Currently not in use.

import { mdiCheckAll } from '@mdi/js';
import confetti from 'canvas-confetti';
import numeral from 'numeral';
import orderBy from 'lodash/orderBy';

import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import { FLSS_ORIGIN_THANKS } from '@/util/flssUtils';
import logFormatter from '@/util/logFormatter';
import { joinArray } from '@/util/joinArray';
import { missingMilestones, achievementsQueryFromCache, achievementsQuery } from '@/util/ecoChallengeUtils';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';
import KivaClassicSingleCategoryCarousel from '@/components/LoanCollections/KivaClassicSingleCategoryCarousel';

import IconSun from '@/assets/icons/inline/eco-challenge/sun.svg';
import IconSunHalf from '@/assets/icons/inline/eco-challenge/sun-half.svg';
import IconSpark from '@/assets/icons/inline/eco-challenge/spark.svg';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

export default {
	name: 'ThanksPageEcoChallenge',
	components: {
		BorrowerImage,
		IconSpark,
		IconSun,
		IconSunHalf,
		KivaClassicSingleCategoryCarousel,
		KvGrid,
		KvMaterialIcon,
		KvPageContainer,
		KvProgressBar,
		KvSocialShareButton,
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
			mdiCheckAll,
			missingMilestones: [],
			receipt: null,
			loanDisplaySettings: {
				loanLimit: 9,
				showViewMoreCard: true,
				showCheckBackMessage: true
			},
			ecoExpQueryContext: FLSS_ORIGIN_THANKS
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
			}).then(({ data }) => {
				const loansResponse = data?.shop?.receipt?.items?.values ?? [];
				const loans = loansResponse
					.filter(item => item.basketItemType === 'loan_reservation')
					.map(item => item.loan);

				const loanIdsInTransaction = loans.map(loan => loan.id);
				return achievementsQuery(client, loanIdsInTransaction);
			}).catch(errorResponse => {
				logFormatter(
					`Thanks eco challenge page preFetch failed: (transaction_id: ${transactionId})`,
					'error',
					{ errorResponse }
				);
			});
		}
	},
	computed: {
		categoriesMissingIds() {
			// Category loan channel ids:
			// 116, solar energy
			// 117, sustainable agriculture
			// 118, recycle and reuse
			const milestoneNames = this.missingMilestones.map(milestone => milestone.milestoneName);

			const arrayOfCategoryIds = [];
			// If milestoneNames contains category, add id to arrayOfCategoryIds
			if (milestoneNames.includes('solar')) {
				arrayOfCategoryIds.push(116);
			}
			if (milestoneNames.includes('sustainable-agriculture')) {
				arrayOfCategoryIds.push(117);
			}
			if (milestoneNames.includes('recycle-reuse')) {
				arrayOfCategoryIds.push(118);
			}
			return arrayOfCategoryIds;
		},
		categoriesMissingString() {
			const milestoneNames = this.missingMilestones.map(milestone => milestone.milestoneName);
			return joinArray(milestoneNames).replaceAll('-', ' ');
		},
		loansRemainingInChallenge() {
			let loansRemaining = 0;
			this.missingMilestones.forEach(milestone => {
				loansRemaining += milestone.target - milestone.progress;
			});
			return loansRemaining;
		},
		climateFact() {
			// eslint-disable-next-line max-len
			return 'Did you know that a biodigester is a system that transforms livestock waste (💩) into organic fertilizer for crops, as well as biogas that can be used for household energy?';
		},
		// Return the first "eco friendly" loan we find in the loans that are part of this transaction.
		// If none are found, return the first loan.
		// Hacky implementation for game test, it should be improved upon.
		loan() {
			const orderedLoans = orderBy(this.loans, ['unreservedAmount'], ['desc']);

			// terms used in solar loans, or reuse loans or sustainable agriculture loans
			// if this term is in a loan we can assume it was the eco challenge loan that
			// was part of the checkout
			const arrayOfTerms = [
				'solar',
				'biodigester',
				'fertilizer',
				'manure',
				'livestock',
				'clothes',
				'fabric',
				'shirts',
				'trousers',
				'garments'
			];
			const ecoLoan = orderedLoans.find(loan => {
				return arrayOfTerms.some(element => {
					if (loan.use.includes(element)) {
						return true;
					}
					return false;
				});
			});
			return ecoLoan || orderedLoans[0];
		},
	},
	created() {
		// Retrieve and apply Page level data + experiment state
		let data = {};
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
			logReadQueryError(e,
				`Thanks eco challenge page readQuery failed: (transaction_id: ${transactionId})`);
		}
		this.lender = {
			...(data?.my?.userAccount ?? {})
		};

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = data?.shop?.receipt ?? null;

		const loansResponse = this.receipt?.items?.values ?? [];
		this.loans = loansResponse
			.filter(item => item.basketItemType === 'loan_reservation')
			.map(item => item.loan);
		const loanIdsInTransaction = this.loans.map(loan => loan.id);
		const myAchievements = achievementsQueryFromCache(this.apollo, loanIdsInTransaction);

		// eslint-disable-next-line max-len
		const checkoutMilestoneProgresses = myAchievements?.achievementMilestonesForCheckout?.checkoutMilestoneProgresses;
		this.missingMilestones = missingMilestones(checkoutMilestoneProgresses, 'climate-challenge');

		if (!data?.my?.userAccount) {
			logFormatter(
				`Failed to get lender for transaction id: ${transactionId}`,
				'info',
				{ data }
			);
		}
		if (!this.receipt) {
			logFormatter(
				`Failed to get receipt for transaction id: ${transactionId}`,
				'info',
				{ data }
			);
		}
	},
	mounted() {
		// Green Eco confetti
		if (this.receipt) {
			confetti({
				origin: {
					y: 0.2
				},
				particleCount: 150,
				spread: 200,
				colors: ['#eaf6f0', '#2a7c5f', '#26985d', '#2ba967', '#c1ff9b'],
				disableForReducedMotion: true,
			});
		}
	},
};
</script>
