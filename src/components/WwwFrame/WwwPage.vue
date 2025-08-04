<template>
	<div class="www-page">
		<global-promo-contentful v-show="!isKivaAppReferral" />
		<the-new-header v-if="isNavUpdateExp" />
		<the-header
			v-else
			v-show="!isKivaAppReferral"
			:hide-search-in-header="hideSearchInHeader"
		/>
		<slot name="secondary" v-if="!isKivaAppReferral"></slot>

		<main :class="mainClasses">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer	/>
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script>
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import { userHasEverLoggedInBefore } from '#src/util/optimizelyUserMetrics';
import logReadQueryError from '#src/util/logReadQueryError';
import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';
import TheNewHeader from './TheNewHeader';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';

const NAV_UPDATE_EXP_KEY = 'kiva_nav_update';

export default {
	name: 'WwwPage',
	inject: [
		'apollo',
		'cookieStore',
	],
	components: {
		CookieBanner,
		GlobalPromoContentful,
		TheBasketBar,
		TheFooter,
		TheHeader,
		TheNewHeader,
	},
	props: {
		grayBackground: {
			type: Boolean,
			default: false,
		},
		hideSearchInHeader: {
			type: Boolean,
			default: false,
		},
		mainClass: {
			type: [Object, String],
			default: '',
		},
	},
	data() {
		return {
			isKivaAppReferral: false,
			isNavUpdateExp: false,
		};
	},
	created() {
		this.isKivaAppReferral = this.$route?.query?.kivaAppReferral === 'true';

		const cachedData = this.apollo.readQuery({
			query: experimentAssignmentQuery,
			variables: { id: NAV_UPDATE_EXP_KEY }
		});
		if (cachedData?.experiment) {
			this.isNavUpdateExp = cachedData.experiment.version === 'b';
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'event-tracking',
				NAV_UPDATE_EXP_KEY,
				'EXP-MP-1696-Aug2025'
			);
		}
	},
	mounted() {
		try {
			const data = this.apollo.readQuery({
				query: hasEverLoggedInQuery,
			});

			userHasEverLoggedInBefore(data?.hasEverLoggedIn);
		} catch (e) {
			logReadQueryError(e, 'User has ever logged in');
		}
	},
	computed: {
		mainClasses() {
			return [
				this.mainClass,
				{ 'tw-bg-secondary': this.grayBackground },
			];
		},
	}
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.www-page {
	display: flex;
	flex-flow: column nowrap;
	min-height: 100vh;

	@media print {
		display: block;
	}

	& > * {
		flex-shrink: 0; // Handle IE defaulting flex-shrink to 1
	}

	main {
		flex-grow: 1;
	}
}
</style>
