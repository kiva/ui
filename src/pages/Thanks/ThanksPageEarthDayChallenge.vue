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
					<img
						src="@/assets/images/achievements/thankyou_badge_earthday@2x.jpg"
						alt="Thank you badge"
						class="tw-rounded tw-w-full tw--mb-1.5 md:tw--mb-1"
					>
				</div>
				<!-- challenge complete copy -->
				<div class="tw-col-span-12 md:tw-col-span-6">
					<h2>Way to go!</h2>
					<p class="tw-text-subhead tw-mt-1">
						<!-- eslint-disable-next-line max-len -->
						You earned the 2023 Earth Day badge by lending to a climate-smart loan! Thank you for helping people solve climate-related issues in their communities and build resilience for the future.
					</p>
					<router-link
						to="/portfolio/lending-stats"
						class="tw-mt-2 tw-inline-block"
						v-kv-track-event="['post-checkout', 'click', 'view-your-badge', 'challenge-earth-day']"
					>
						<h3>View your badge</h3>
					</router-link>
					<div
						class="tw-bg-black tw-bg-opacity-[65%] tw-rounded tw-flex tw-items-center
						tw-p-1.5 tw-mt-3 md:tw-mt-6"
						style="max-width: 295px;"
					>
						<h3 class="tw-text-primary-inverse tw-mr-1.5">
							You've completed your {{ achievementNumberLanguage }} challenge.
						</h3>
						<!-- <earth-day-challenge-badge class="tw-h-6 tw-w-6 tw-flex-none tw-mx-auto" /> -->
					</div>
				</div>
			</kv-grid>
			<!-- Challenge Complete -->
			<template>
				<hr
					class="tw-block tw-border-tertiary tw-w-full tw-mb-3"
				>
				<div
					class="tw-flex tw-w-full tw-justify-between"
				>
					<h2 class="tw-mr-1.5">
						Your {{ achievementNumberLanguage }} challenge!
					</h2>
					<div
						class="tw-flex"
					>
						<div>
							<h3 class="tw-mb-1">
								2023 Earth Day challenge
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
					<p class="tw-text-subhead" v-html="earthDayFact">
					</p>
					<div class="tw-flex">
						<kv-social-share-button
							class="tw-mt-3"
							modal-title="Spread the word about climate resilience"
							:share-message="earthDayFact"
							share-url="/blog/climate-resilience"
							variant="primary"
							utm-campaign="earthday_challenge_thanks_page"
							style="max-width: 190px;"
							tracking-category="post-checkout"
						>
							Share this fact
							<template #modal-content>
								{{ earthDayFact }}
							</template>
						</kv-social-share-button>
						<kv-button
							class="tw-mt-3 tw-ml-3"
							href="/blog/climate-resilience"
							variant="secondary"
							style="max-width: 190px;"
							v-kv-track-event="['post-checkout', 'click', 'learn-more', 'challenge-earth-day']"
						>
							Learn More
						</kv-button>
					</div>
				</div>
			</template>
			<div class="tw-text-center tw-mt-1 tw-mb-4">
				<router-link
					to="/portfolio"
					v-kv-track-event="['post-checkout', 'click', 'portfolio', 'challenge-earth-day']"
				>
					Continue to my portfolio
				</router-link>
			</div>
		</kv-page-container>
	</www-page>
</template>

<script>

import { mdiCheckAll } from '@mdi/js';
import confetti from 'canvas-confetti';
import numeral from 'numeral';

import thanksPageQuery from '@/graphql/query/thanksPage.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import logFormatter from '@/util/logFormatter';
import userAchievementsProgress from '@/graphql/query/userAchievementsProgress.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'ThanksPageEarthDayChallenge',
	components: {
		KvGrid,
		KvMaterialIcon,
		KvPageContainer,
		KvProgressBar,
		KvButton,
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
			allAchievements: [],
			mdiCheckAll,
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
			}).then(({ data }) => {
				return client.query({
					query: userAchievementsProgress,
					variables: {
						userId: data?.my?.userAccount?.id?.toString(),
					},
				});
			}).catch(errorResponse => {
				logFormatter(
					`Thanks earthday challenge page preFetch failed: (transaction_id: ${transactionId})`,
					'error',
					{ errorResponse }
				);
			});
		}
	},
	computed: {
		earthDayFact() {
			// eslint-disable-next-line max-len
			return 'Thank you for helping someone make a climate-positive change in their community! Climate change could reduce agriculture yields by up to 30% by 2050. Learn more about how Kiva supports climate resilience for smallholder farmers worldwide.';
		},
		completedAchievements() {
			return this.allAchievements.filter(
				achievement => achievement.status === 'COMPLETE'
			);
		},
		achievementNumberLanguage() {
			if (this.completedAchievements.length === 3) {
				// there have only been 2 achievements so far
				return 'third';
			}
			if (this.completedAchievements.length === 2) {
				return 'second';
			}
			return 'first';
		}
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
				`Thanks earthday challenge page readQuery failed: (transaction_id: ${transactionId})`);
		}
		this.lender = {
			...(data?.my?.userAccount ?? {})
		};

		// The default empty object and the v-if will prevent the
		// receipt from rendering in the rare cases this query fails.
		// But it will not throw a server error.
		this.receipt = data?.shop?.receipt ?? null;

		// log errors if data is missing
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

		// Get achievement completion status
		let achievementData = {};
		try {
			achievementData = this.apollo.readQuery({
				query: userAchievementsProgress,
				variables: {
					userId: data?.my?.userAccount?.id?.toString(),
				}
			});
		} catch (e) {
			logReadQueryError(e,
				`Thanks earthday challenge achievements readQuery failed: (transaction_id: ${transactionId})`);
		}
		this.allAchievements = achievementData?.userAchievementProgress?.achievementProgress ?? [];
	},
	mounted() {
		if (this.receipt) {
			confetti({
				origin: {
					y: 0.2
				},
				particleCount: 150,
				spread: 200,
				// misc. kiva colors
				colors: ['#d74937', '#6859c0', '#fee259', '#118aec', '#DDFFF4', '#4faf4e', '#aee15c'],
				disableForReducedMotion: true,
			});
		}
	},
};
</script>
