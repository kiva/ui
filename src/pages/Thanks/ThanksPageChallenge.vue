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
				<div>
					<p>
						Success, your receipt has been sent to
						<strong class="data-hj-suppress">{{ lender.email }}</strong>
					</p>
				</div>
			</div>
		</div>
		<kv-page-container v-if="rawContentfulContent">
			<kv-grid class="tw-grid-cols-12 tw-pt-3 md:tw-pt-4 lg:tw-pt-6 tw-mb-4 md:tw-mb-6">
				<div
					class="tw-col-span-12 md:tw-col-span-6"
				>
					<img
						:src="thankYouImage"
						alt="Thank you badge"
						class="tw-rounded tw-w-full tw--mb-1.5 md:tw--mb-1"
					>
				</div>
				<!-- Challenge Complete copy -->
				<div class="tw-col-span-12 md:tw-col-span-6" v-if="currentChallengeStatus === 'COMPLETE'">
					<div class="badge-thank-you-copy" v-html="completedCopy"></div>
					<router-link
						to="/portfolio/lending-stats"
						class="tw-mt-2 tw-inline-block"
						v-kv-track-event="['post-checkout', 'click', 'view-your-badge', challengeId]"
					>
						<h3>View your badge</h3>
					</router-link>
					<div
						class="tw-bg-black tw-bg-opacity-[65%] tw-rounded tw-flex tw-items-center
						tw-p-1.5 tw-mt-3 md:tw-mt-6"
						style="max-width: 295px;"
					>
						<h3 class="tw-text-primary-inverse tw-mr-1.5">
							You've completed your {{ completedAchievements.length | numeral('Oo') }} challenge.
						</h3>
						<img :src="badgeImage" class="tw-h-6 tw-w-6 tw-flex-none tw-mx-auto">
					</div>
				</div>
				<!-- Challenge In Progress copy -->
				<div class="tw-col-span-12 md:tw-col-span-6" v-if="currentChallengeStatus === 'PARTIALLY_COMPLETE'">
					<div class="badge-thank-you-copy" v-html="progressCopy"></div>
					<div
						class="tw-bg-black tw-rounded tw-flex tw-items-center
						tw-p-1 tw-mt-3 md:tw-mt-6 tw-relative"
						style="max-width: 390px;"
					>
						<h3 class="tw-text-primary-inverse tw-mr-1.5">
							You're on your way!
						</h3>
						<img :src="badgeImage" class="tw-h-6 tw-w-6 tw-flex-none tw-mx-auto">
					</div>
				</div>
			</kv-grid>

			<hr
				class="tw-block tw-border-tertiary tw-w-full tw-mb-3"
			>

			<!-- Challenge Complete -->
			<template v-if="currentChallengeStatus === 'COMPLETE'">
				<div
					class="tw-flex tw-w-full tw-justify-between"
				>
					<h2 class="tw-mr-1.5">
						Your {{ completedAchievements.length | numeral('Oo') }} challenge!
					</h2>
					<div
						class="tw-flex"
					>
						<div>
							<h3 class="tw-mb-1">
								{{ challengeName }}
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
			</template>

			<!-- Challenge In Progress -->
			<template v-if="currentChallengeStatus !== 'COMPLETE'">
				<div
					class="tw-flex tw-w-full tw-justify-between"
				>
					<h2 class="tw-mr-1.5">
						You're on your way to completing this challenge!
					</h2>
					<div
						class="tw-flex"
					>
						<div>
							<h3 class="tw-mb-1">
								{{ challengeName }}
							</h3>
							<kv-progress-bar
								aria-label="Completion of challenge"
								:value="66"
							/>
							<p class="tw-text-h4 tw-text-right tw-font-medium tw-mt-1">
								in progress!
							</p>
						</div>
					</div>
				</div>
			</template>

			<div class="tw-mt-3 tw-mb-4 md:tw-mb-6">
				<p class="tw-text-subhead" v-html="challengeShareFact">
				</p>
				<div class="tw-flex">
					<kv-social-share-button
						class="tw-mt-3"
						modal-title="Spread the word!"
						:share-message="challengeShareFact"
						:share-url="challengeShareFactUrl"
						variant="primary"
						:utm-campaign="`${challengeId}_thanks_page`"
						style="max-width: 190px;"
						tracking-category="post-checkout"
					>
						Share this fact
						<template #modal-content>
							{{ challengeShareFact }}
						</template>
					</kv-social-share-button>
					<kv-button
						class="tw-mt-3 tw-ml-3"
						:href="challengeShareFactUrl"
						variant="secondary"
						style="max-width: 190px;"
						v-kv-track-event="['post-checkout', 'click', 'learn-more', challengeId]"
					>
						Learn More
					</kv-button>
				</div>
			</div>
			<div class="tw-text-center tw-mt-1 tw-mb-4">
				<router-link
					to="/portfolio/impact"
					v-kv-track-event="['post-checkout', 'click', 'portfolio', challengeId]"
				>
					Continue to my portfolio
				</router-link>
			</div>
		</kv-page-container>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiCheckAll } from '@mdi/js';
import confetti from 'canvas-confetti';
import numeral from 'numeral';

import userAchievementsProgress from '@/graphql/query/userAchievementsProgress.graphql';

import logReadQueryError from '@/util/logReadQueryError';
import logFormatter from '@/util/logFormatter';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const pageQuery = gql`query thanksPageChallenge($challengeId: String!) {
	my {
		id
		userAccount {
			id
			email
		}
	}
	contentful {
		entries(contentType: "challenge", contentKey: $challengeId)
	}
}`;

export default {
	name: 'ThanksPageChallenge',
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
			rawContentfulContent: null,
		};
	},
	props: {
		challengeId: {
			type: String,
			default: ''
		},
	},
	apollo: {
		preFetch(config, client, { route }) {
			const transactionId = route.query?.kiva_transaction_id
				? numeral(route.query?.kiva_transaction_id).value()
				: null;

			return client.query({
				query: pageQuery,
				variables: {
					challengeId: route.params?.challengeId,
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
					`Thanks challenge page preFetch failed: (transaction_id: ${transactionId})`,
					'error',
					{ errorResponse }
				);
			});
		},
		preFetchVariables({ route }) {
			return { challengeId: route.params.challengeId };
		},
		variables() {
			return { challengeId: this.$route.params.challengeId };
		},
	},
	computed: {
		challengeName() {
			return this.rawContentfulContent?.challengeName ?? '';
		},
		challengeShareFact() {
			return this.rawContentfulContent?.shareFact ?? '';
		},
		challengeShareFactUrl() {
			return this.rawContentfulContent?.shareFactUrl ?? '';
		},
		completedAchievements() {
			return this.allAchievements.filter(
				achievement => achievement.status === 'COMPLETE'
			);
		},
		thankYouImage() {
			return this.rawContentfulContent?.thankYouImage?.fields?.file?.url ?? '';
		},
		badgeImage() {
			return this.rawContentfulContent?.badgeImage?.fields?.file?.url ?? '';
		},
		completedCopy() {
			return documentToHtmlString(this.rawContentfulContent?.thankYouCopyComplete ?? '');
		},
		progressCopy() {
			return documentToHtmlString(this.rawContentfulContent?.thankYouCopyInProgress ?? '');
		},
		currentChallengeStatus() {
			// ENUM statuses for this query result are: COMPLETE, NO_PROGRESS, PARTIALLY_COMPLETE
			return this.allAchievements.find(
				achievement => achievement.achievementId === this.challengeId
			)?.status ?? '';
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
				query: pageQuery,
				variables: {
					challengeId: this.challengeId,
				}
			});
		} catch (e) {
			logReadQueryError(e,
				`Thanks challenge page readQuery failed: (transaction_id: ${transactionId})`);
		}
		this.lender = {
			...(data?.my?.userAccount ?? {})
		};

		this.rawContentfulContent = data?.contentful?.entries?.items?.[0]?.fields ?? null;

		// log errors if data is missing
		if (!data?.my?.userAccount) {
			logFormatter(
				`Failed to get lender for transaction id: ${transactionId}`,
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
				`Thanks challenge page achievements readQuery failed: (transaction_id: ${transactionId})`);
		}
		this.allAchievements = achievementData?.userAchievementProgress?.achievementProgress ?? [];
	},
	mounted() {
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
	},
};
</script>

<style lang="postcss" scoped>
.badge-thank-you-copy ::v-deep p {
	@apply tw-text-subhead tw-mt-1;
}
</style>
