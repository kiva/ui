<template>
	<www-page>
		<kv-page-container
			class="tw-pt-4 tw-pb-8"
		>
			<lender-profile-wrapper
				v-if="lenderIsPublic"
				:public-id="publicId"
				:lender-info="lenderInfo"
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
import useBadgeData from '#src/composables/useBadgeData';

import { useRoute } from 'vue-router';

import {
	ref,
	computed,
	inject,
	onMounted,
	watch,
} from 'vue';

export default {
	name: 'LenderProfile',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		LenderProfileWrapper,
		NotFoundWrapper,
	},
	setup() {
		const apollo = inject('apollo');

		const {
			isBadgeKeyValid, fetchAchievementData, fetchContentfulData, badgeData, getTierBadgeDataByLevel
		} = useBadgeData();

		const route = useRoute();

		const utmCampaign = route.query?.utm_campaign ?? '';
		const badgeLevel = route.query?.badge_level ?? 0;
		const badgeKey = utmCampaign.split('badge_')[1];
		const enableBadgeContent = ref(false);

		onMounted(async () => {
			if (isBadgeKeyValid(utmCampaign)) {
				await fetchAchievementData(apollo);
				await fetchContentfulData(apollo);
			}
		});

		const badge = computed(() => {
			const sharedBadge = badgeData.value?.find(data => data.id === badgeKey);
			return getTierBadgeDataByLevel(sharedBadge, Number(badgeLevel));
		});

		const badgeImage = computed(() => {
			return badge.value?.contentfulData?.imageUrl ?? '';
		});

		const badgeCategory = computed(() => {
			return badge.value?.contentfulData?.challengeName ?? '';
		});

		const badgeTarget = computed(() => {
			return badge.value?.achievementData?.target ?? '';
		});

		watch(() => badge.value, () => {
			enableBadgeContent.value = true;
		});

		return {
			badgeImage,
			badgeCategory,
			badgeTarget,
			enableBadgeContent,
		};
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
			lenderIsPublic: false,
		};
	},
	apollo: {
		preFetch(config, client, { route }) {
			const currentRoute = route.value ?? route ?? {};
			const publicId = currentRoute.params?.publicId ?? '';

			return Promise.all([
				client.query({ query: lenderPublicProfileQuery, variables: { publicId } }),
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
		this.lenderIsPublic = !!this.lenderInfo?.id;
	}
};
</script>
