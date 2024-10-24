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
import logReadQueryError from '#src/util/logReadQueryError';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import LenderProfileWrapper from '#src/components/LenderProfile/LenderProfileWrapper';
import NotFoundWrapper from '#src/components/NotFound/NotFoundWrapper';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';
import useBadgeContentfulData from '#src/composables/useBadgeContentfulData';

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
			badgeTarget: 0,
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const currentRoute = route.value ?? route ?? {};
			const publicId = currentRoute.params?.publicId ?? '';
			const { isBadgeKeyValid, badgeQuery, badgeKey } = useBadgeContentfulData(client, currentRoute);

			return Promise.all([
				client.query({ query: lenderPublicProfileQuery, variables: { publicId } }),
				isBadgeKeyValid ? client.query({ query: badgeQuery, variables: { badgeKey } }) : null,
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
				return `${this.lenderName} has supported ${this.badgeTarget} to ${this.badgeCategory}`;
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

		const { isBadgeKeyValid, loadBadgeInfo } = useBadgeContentfulData(this.apollo, this.$route);

		if (isBadgeKeyValid) {
			const { badgeImage, badgeCategory, badgeTarget } = await loadBadgeInfo();
			this.badgeImage = badgeImage;
			this.badgeCategory = badgeCategory;
			this.badgeTarget = badgeTarget;
			this.enableBadgeContent = true;
		}
	}
};
</script>
