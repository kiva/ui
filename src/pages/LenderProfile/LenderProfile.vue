<template>
	<www-page>
		<kv-page-container
			class="tw-py-2"
		>
			<lender-summary
				:public-id="publicId"
				:lender-info="lenderInfo"
			/>

			<lender-loans-list
				:public-id="publicId"
				:lender-info="lenderInfo"
			/>

			<lender-badges
				:total-possible-badges="allAchievements.length"
				:completed-achievements="completedAchievements"
				:lender-info="lenderInfo"
			/>

			<lender-dedications-list
				:public-id="publicId"
				:lender-info="lenderInfo"
			/>

			<lender-teams-list
				:public-id="publicId"
				:lender-info="lenderInfo"
			/>

			<lender-invitees-list
				:public-id="publicId"
				:lender-info="lenderInfo"
			/>

			<lender-stats
				:lender-info="lenderInfo"
			/>
		</kv-page-container>
	</www-page>
</template>

<script>
import logReadQueryError from '#src/util/logReadQueryError';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import LenderSummary from '#src/components/LenderProfile/LenderSummary';
import lenderPublicProfileQuery from '#src/graphql/query/lenderPublicProfile.graphql';
import LenderLoansList from '#src/components/LenderProfile/LenderLoansList';
import LenderStats from '#src/components/LenderProfile/LenderStats';
import LenderTeamsList from '#src/components/LenderProfile/LenderTeamsList';
import LenderBadges from '#src/components/LenderProfile/LenderBadges';
import LenderInviteesList from '#src/components/LenderProfile/LenderInviteesList';
import LenderDedicationsList from '#src/components/LenderProfile/LenderDedicationsList';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'LenderProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		LenderSummary,
		LenderLoansList,
		LenderStats,
		LenderTeamsList,
		LenderBadges,
		LenderInviteesList,
		LenderDedicationsList,
	},
	metaInfo() {
		return {
			title: this.pageTitle,
			meta: [
				{ property: 'og:title', vmid: 'og:title', content: this.pageTitle },
				{ property: 'og:description', vmid: 'og:description', content: this.pageDescription },
				{ property: 'og:site_name', vmid: 'og:site_name', content: 'Kiva' },
				{
					vmid: 'description',
					name: 'description',
					content: this.pageDescription,
				}
			].concat([
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: `Kiva - Lender > ${this.lenderName} from ${this.lenderWhereAbouts}`
				},
			]).concat([
				{
					vmid: 'robots',
					name: 'robots',
					content: 'noindex, nofollow',
				},
			]),
		};
	},
	data() {
		return {
			lenderInfo: {},
			publicId: '',
			allAchievements: [],
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const currentRoute = route.value ?? {};
			const publicId = currentRoute.params?.publicId ?? '';

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
			return `Lender > ${this.lenderName} from ${this.lenderWhereAbouts}`;
		},
		pageDescription() {
			return `${this.lenderName} from ${this.lenderWhereAbouts} has made ${this.loanCount} loans on Kiva.`;
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
		this.lenderInfo = cachedLenderInfo.community?.lender ?? {};
		this.allAchievements = cachedLenderInfo.userAchievementProgress?.achievementProgress ?? [];
	}
};
</script>
