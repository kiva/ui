<template>
	<www-page>
		<kv-page-container
			class="tw-pt-4 tw-pb-8"
		>
			<lender-profile-wrapper
				v-if="lenderIsPublic"
				:public-id="publicId"
				:lender-info="lenderInfo"
				:all-achievements="allAchievements"
				:completed-achievements="completedAchievements"
			/>
			<not-found-wrapper
				v-else
			/>
		</kv-page-container>
	</www-page>
</template>

<script>
import { gql } from 'graphql-tag';

import logReadQueryError from '#src/util/logReadQueryError';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import LenderProfileWrapper from '#src/components/LenderProfile/LenderProfileWrapper';
import NotFoundWrapper from '#src/components/NotFound/NotFoundWrapper';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';
import { defaultBadges } from '#src/util/achievementUtils';

const badgeQuery = gql`query contentfulBadgeImage ($badgeKey: String!) {
	contentful {
		entries(contentKey: $badgeKey, contentType: "challenge")
	}
}`;

export default {
	name: 'LenderProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		LenderProfileWrapper,
		NotFoundWrapper,
	},
	head() {
		return {
			title: this.pageTitle,
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: this.pageDescription,
				},
				{
					property: 'og:title',
					vmid: 'og:title',
					content: this.pageTitle,
				},
				{
					property: 'og:description',
					vmid: 'og:description',
					content: this.pageDescription,
				},
				{
					property: 'og:site_name',
					vmid: 'og:site_name',
					content: 'Kiva',
				},
				{
					property: 'og:image',
					vmid: 'og:image',
					content: this.seoImageUrl,
				},
			].concat([
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: this.pageTitle,
				},
			]).concat([
				// Twitter Tags
				{
					name: 'twitter:title',
					vmid: 'twitter:title',
					content: this.pageTitle,
				},
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: this.seoImageUrl,
				},
				{
					name: 'twitter:description',
					vmid: 'twitter:description',
					content: this.pageDescription,
				},
			]),
		};
	},
	data() {
		return {
			lenderInfo: {},
			publicId: '',
			allAchievements: [],
			lenderIsPublic: false,
			enableBadgeContent: false,
			badgeImage: null,
			badgeCategory: '',
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const currentRoute = route.value ?? route ?? {};
			const publicId = currentRoute.params?.publicId ?? '';

			const utmCampaign = currentRoute?.query?.utm_campaign ?? '';
			const isUtmValid = utmCampaign.includes('badge_') && utmCampaign.includes('social_share');
			const badgeKey = utmCampaign.split('badge_')[1];
			const isBadgeKeyValid = defaultBadges.includes(badgeKey);

			return Promise.all([
				client.query({ query: lenderPublicProfileQuery, variables: { publicId } }),
				isUtmValid && isBadgeKeyValid ? client.query({ query: badgeQuery, variables: { badgeKey } }) : null,
			]);
		}
	},
	computed: {
		lenderName() {
			return this.lenderInfo?.name ?? '';
		},
		lenderWhereAbouts() {
			return this.lenderInfo?.lenderPage?.whereabouts ?? '';
		},
		loanCount() {
			return this.lenderInfo?.loanCount ?? 0;
		},
		pageTitle() {
			if (this.enableBadgeContent) {
				const checkoutLoans = this.$route.query?.badgeLoans ?? 0;
				return `${this.lenderName} has supported ${checkoutLoans} to ${this.badgeCategory}`;
			}

			let title = `Lender > ${this.lenderName}`;
			if (this.lenderWhereAbouts) title += ` from ${this.lenderWhereAbouts}`;
			return title;
		},
		pageDescription() {
			if (this.enableBadgeContent) {
				return `Join ${this.lenderName} in celebrating this milestone`;
			}

			let description = `${this.lenderName}`;
			if (this.lenderWhereAbouts) description += ` from ${this.lenderWhereAbouts}`;
			description += ` has made ${this.loanCount} loan${this.loanCount === 1 ? '' : 's'} on Kiva.`;
			return description;
		},
		seoImageUrl() {
			return this.enableBadgeContent ? this.badgeImage : this.lenderInfo?.seoImage?.url ?? '';
		},
		completedAchievements() {
			return this.allAchievements.filter(achievement => achievement.status === 'COMPLETE');
		},
	},
	methods: {
		async loadBadgeInfo(badgeKey) {
			const data = this.apollo.readQuery({
				query: badgeQuery,
				variables: { badgeKey }
			});

			const contentfulData = data?.contentful?.entries?.items ?? null;
			if (contentfulData) {
				this.enableBadgeContent = true;
				this.badgeImage = contentfulData?.[0]?.fields?.badgeImage?.fields?.file?.url ?? null;
				this.badgeCategory = contentfulData?.[0]?.fields?.challengeName ?? '';
			}
		}
	},
	async created() {
		this.publicId = this.$route?.params?.publicId ?? '';
		let cachedLenderInfo = {};
		try {
			cachedLenderInfo = this.apollo.readQuery({
				query: lenderPublicProfileQuery,
				variables: { publicId: this.publicId }
			});
		} catch (e) {
			logReadQueryError(e, 'LenderProfile lenderPublicProfileQuery');
		}

		this.lenderInfo = cachedLenderInfo?.community?.lender ?? {};
		this.allAchievements = cachedLenderInfo?.userAchievementProgress?.achievementProgress ?? [];
		this.lenderIsPublic = !!this.lenderInfo?.id;

		const utmCampaign = this.$route?.query?.utm_campaign ?? '';
		const isUtmValid = utmCampaign.includes('badge_') && utmCampaign.includes('social_share');
		const badgeKey = utmCampaign.split('badge_')[1];
		const isBadgeKeyValid = defaultBadges.includes(badgeKey);
		if (isUtmValid && isBadgeKeyValid) {
			await this.loadBadgeInfo(`${badgeKey}`);
		}
	}
};
</script>
