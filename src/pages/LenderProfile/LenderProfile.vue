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
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LenderSummary from '@/components/LenderProfile/LenderSummary';
import lenderPublicProfileQuery from '@/graphql/query/lenderPublicProfile.graphql';
import LenderLoansList from '@/components/LenderProfile/LenderLoansList';
import LenderStats from '@/components/LenderProfile/LenderStats';
import LenderTeamsList from '@/components/LenderProfile/LenderTeamsList';
import LenderInviteesList from '@/components/LenderProfile/LenderInviteesList';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

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
		LenderInviteesList,
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
			return `Lender > ${this.lenderName} from ${this.lenderWhereAbouts}`;
		},
		pageDescription() {
			return `${this.lenderName} from ${this.lenderWhereAbouts} has made ${this.loanCount} loans on Kiva.`;
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
	}
};
</script>
