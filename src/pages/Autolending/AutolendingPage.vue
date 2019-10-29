<template>
	<www-page class="autolending" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<div class="row column">
			<main-toggle />
		</div>
		<div class="row column settings-area" :class="{ obscure: !isEnabled }">
			<!-- main toggles -->
			<div class="setting-group">
				<!-- timing dropdown -->
				<donation-dropdown />
				<!-- kiva chooses for me -->
			</div>
			<!-- basic criteria -->
			<div class="setting-group">
				<h2 class="criteria-title">
					Auto-lending criteria
				</h2>
				<floating-counter class="show-for-large" />
				<!-- row for criteria components -->
				<div class="row">
					<div class="small-12 large-6 columns setting-column">
						<gender-radios />
					</div>
					<div class="small-12 large-6 columns setting-column">
						<group-radios />
					</div>
					<div class="small-12 large-6 columns setting-column">
						<country-filter />
					</div>
					<div class="small-12 large-6 columns setting-column">
						<sector-filter />
					</div>
				</div>
			</div>
			<!-- advanced settings -->
			<div class="row column">
				<button @click="showAdvanced = !showAdvanced" class="advanced-settings-toggle">
					{{ showAdvanced ? 'Hide' : 'Show' }} advanced settings
				</button>
			</div>
			<kv-expandable>
				<div class="row" v-show="showAdvanced">
					<div class="small-12 large-6 columns setting-column">
						<!-- <loan-increment /> -->
					</div>
					<div class="small-12 large-6 columns setting-column">
						<attribute-filter />
					</div>
					<div class="small-12 large-6 columns setting-column">
						<!-- loan term -->
					</div>
					<div class="small-12 large-6 columns setting-column">
						<partner-filter />
					</div>
					<div class="small-12 large-6 columns setting-column">
						<!-- delinquency -->
					</div>
					<div class="small-12 large-6 columns setting-column">
						<!-- risk rating -->
					</div>
					<div class="small-12 large-6 columns setting-column">
						<!-- default rate -->
					</div>
				</div>
			</kv-expandable>
		</div>
		<div class="row column save-button-area">
			<!-- save button -->
			<save-button class="show-for-large" />
		</div>
		<!-- mobile-only footer -->
		<div class="mobile-footer hide-for-large" v-show="isEnabled || isChanged">
			<mobile-counter />
			<save-button :show-warning="false" />
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import KvExpandable from '@/components/Kv/KvExpandable';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import AttributeFilter from './AttributeFilter';
import CountryFilter from './CountryFilter';
import DonationDropdown from './DonationDropdown';
import FloatingCounter from './FloatingCounter';
import MainToggle from './MainToggle';
import GenderRadios from './GenderRadios';
import MobileCounter from './MobileCounter';
import PartnerFilter from './PartnerFilter';
import SaveButton from './SaveButton';
import SectorFilter from './SectorFilter';
import GroupRadios from './GroupRadios';
// import LoanIncrement from './LoanIncrementFilter';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		KvExpandable,
		AttributeFilter,
		CountryFilter,
		DonationDropdown,
		FloatingCounter,
		MainToggle,
		GenderRadios,
		MobileCounter,
		PartnerFilter,
		SaveButton,
		SectorFilter,
		GroupRadios,
		// LoanIncrement,
	},
	data() {
		return {
			isChanged: false,
			isEnabled: false,
			showAdvanced: false,
		};
	},
	apollo: {
		query: autolendingQuery,
		preFetch(config, client, { route }) {
			return new Promise((resolve, reject) => {
				client.mutate({ mutation: initAutolending })
					.then(() => client.query({ query: autolendingQuery }))
					.then(resolve)
					.catch(e => {
						// Redirect to login upon authentication error
						if (e.message.indexOf('api.authenticationRequired') > -1) {
							reject({
								path: '/ui-login',
								query: { force: true, doneUrl: route.fullPath }
							});
						} else {
							console.error(e);
							resolve();
						}
					});
			});
		},
		result({ data }) {
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

$autolending-font-size: rem-calc(18.8);

.autolending {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.settings-area.obscure {
		opacity: 0.2;
		pointer-events: none;
	}

	label {
		font-size: $autolending-font-size;
	}

	.setting-group {
		position: relative;
		margin: 2rem 0;
		border-bottom: 1px solid $kiva-stroke-gray;
	}

	.criteria-title {
		margin-bottom: 2rem;
	}

	.setting-column {
		margin-bottom: 1.25rem;
	}

	.advanced-settings-toggle {
		color: $kiva-textlink;
		font-weight: 300;
		margin-bottom: 2rem;
	}

	.save-button-area {
		margin-bottom: 5rem;
	}

	.mobile-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: $white;
		box-shadow: 0 -2px 9px 0 rgba(0, 0, 0, 0.1);

		.save-button-wrapper {
			padding: 0 1rem 0.5rem;

			.button {
				width: 100%;
			}
		}
	}
}
</style>
