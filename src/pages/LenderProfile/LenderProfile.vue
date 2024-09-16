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
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import lenderPublicProfileQuery from '@/graphql/query/lenderPublicProfile.graphql';
import LenderProfileWrapper from '@/components/LenderProfile/LenderProfileWrapper';
import NotFoundWrapper from '@/components/NotFound/NotFoundWrapper';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'LenderProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		LenderProfileWrapper,
		NotFoundWrapper,
	},
	metaInfo() {
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
			]).concat([
				{
					vmid: 'robots',
					name: 'robots',
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
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const publicId = route.params?.publicId ?? '';

			return client.query({
				query: lenderPublicProfileQuery,
				variables: { publicId }
			});
		},
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
			let title = `Lender > ${this.lenderName}`;
			if (this.lenderWhereAbouts) title += ` from ${this.lenderWhereAbouts}`;
			return title;
		},
		pageDescription() {
			let description = `${this.lenderName}`;
			if (this.lenderWhereAbouts) description += ` from ${this.lenderWhereAbouts}`;
			description += ` has made ${this.loanCount} loan${this.loanCount === 1 ? '' : 's'} on Kiva.`;
			return description;
		},
		seoImageUrl() {
			return this.lenderInfo?.seoImage?.url ?? '';
		},
		completedAchievements() {
			return this.allAchievements.filter(achievement => achievement.status === 'COMPLETE');
		},
	},
	created() {
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
	}
};
</script>
