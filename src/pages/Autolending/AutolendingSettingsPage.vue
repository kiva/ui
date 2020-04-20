<template>
	<div>
		<autolending-status>
			<!-- TODO remove this slot when content has been incorporated into new design -->
			<div slot="tempContentWrapper" class="tempContentWrapper">
				<div class="row column">
					<span v-if="isEnabled" class="toggle-sub-text">
						Kiva will automatically lend my balance
					</span>
					<span v-else class="toggle-sub-text">
						I’ll lend my balance myself
					</span>
				</div>
				<div class="row column settings-area" :class="{ obscure: !isEnabled }">
					<!-- main toggles -->
					<div class="main-settings setting-group">
						<lend-timing-dropdown />
						<donation-dropdown />
						<kiva-chooses-radios />
					</div>
					<hr>
				</div>
			</div>
		</autolending-status>
		<div class="row column">
			<!-- basic criteria -->
			<div class="setting-group" v-show="!kivaChooses">
				<floating-counter class="show-for-large" />
				<div class="row">
					<div class="criteria-wrapper column large-8">
						<h3 class="criteria-title">
							Auto-lending criteria
						</h3>
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
						<!-- advanced settings -->
						<div class="row column" v-show="!kivaChooses">
							<button @click="showAdvanced = !showAdvanced" class="advanced-settings-toggle">
								{{ showAdvanced ? 'Hide' : 'Show' }} advanced settings
							</button>
							<hr>
						</div>
						<kv-expandable>
							<div class="row" v-show="showAdvanced && !kivaChooses">
								<div class="small-12 large-6 columns setting-column">
									<loan-increment-radios />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<attribute-filter />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<loan-term-dropdown />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<partner-filter />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<partner-del-rate-dropdown />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<risk-rating-dropdown />
								</div>
								<div class="small-12 large-6 columns setting-column">
									<default-rate-dropdown />
								</div>
							</div>
						</kv-expandable>
					</div>
				</div>
			</div>
		</div>

		<div class="row column save-button-area">
			<save-button class="show-for-large" />
		</div>
		<!-- mobile-only footer -->
		<div class="mobile-footer hide-for-large" v-show="isEnabled || isChanged">
			<mobile-counter />
			<save-button :show-warning="false" />
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { settingEnabled } from '@/util/settingsUtils';
import KvExpandable from '@/components/Kv/KvExpandable';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import contentful from '@/graphql/query/contentful.graphql';
import AttributeFilter from './AttributeFilter';
import CountryFilter from './CountryFilter';
import DonationDropdown from './DonationDropdown';
import LendTimingDropdown from './LendTimingDropdown';
import FloatingCounter from './FloatingCounter';
import GenderRadios from './GenderRadios';
import MobileCounter from './MobileCounter';
import PartnerFilter from './PartnerFilter';
import SaveButton from './SaveButton';
import SectorFilter from './SectorFilter';
import RiskRatingDropdown from './RiskRatingDropdown';
import LoanTermDropdown from './LoanTermDropdown';
import GroupRadios from './GroupRadios';
import PartnerDelRateDropdown from './PartnerDelRateDropdown';
import LoanIncrementRadios from './LoanIncrementRadios';
import DefaultRateDropdown from './DefaultRateDropdown';
import KivaChoosesRadios from './KivaChoosesRadios';
import AutolendingStatus from './AutolendingStatus';


const pageQuery = gql`{
	autolending @client {
		profileChanged
		currentProfile {
			isEnabled
			idleCreditOptIn
			kivaChooses
		}
	}
}`;

export default {
	inject: ['apollo', 'federation'],
	components: {
		AttributeFilter,
		AutolendingStatus,
		CountryFilter,
		DonationDropdown,
		FloatingCounter,
		GenderRadios,
		GroupRadios,
		KvExpandable,
		LendTimingDropdown,
		MobileCounter,
		PartnerFilter,
		SaveButton,
		SectorFilter,
		RiskRatingDropdown,
		LoanTermDropdown,
		PartnerDelRateDropdown,
		LoanIncrementRadios,
		DefaultRateDropdown,
		KivaChoosesRadios,
	},
	data() {
		return {
			isChanged: false,
			isEnabled: false,
			showAdvanced: false,
			idleCreditOptIn: false,
			showOptOutControls: false,
			kivaChooses: true,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client, { route, kvAuth0 }) {
			return new Promise((resolve, reject) => {
				client.query({ query: autolendingQuery })
					.then(({ data }) => {
						const lastLogin = _get(data, 'my.lastLoginTimestamp', 0);
						const duration = 1000 * (parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600);
						if (kvAuth0.getKivaId() && Date.now() > lastLogin + duration) {
							throw new Error('activeLoginRequired');
						}
						const isSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
						if (isSubscriber) {
							throw new Error('monthlyGoodSubscriber');
						}
					})
					.then(() => client.mutate({ mutation: initAutolending }))
					.then(() => client.query({ query: pageQuery }))
					.then(resolve)
					.catch(e => {
						if (e.message.indexOf('activeLoginRequired') > -1) {
							// Force a login when active login is required
							reject({
								path: '/ui-login',
								query: { force: true, doneUrl: route.fullPath }
							});
						} else if (e.message.indexOf('api.authenticationRequired') > -1) {
							// Redirect to login upon authentication error
							reject({
								path: '/ui-login',
								query: { doneUrl: route.fullPath }
							});
						} else if (e.message.indexOf('monthlyGoodSubscriber') > -1) {
							// Redirect to legacy Monthly Good Settins page
							reject({
								path: '/settings/credit'
							});
						} else {
							// Log other errors
							console.error(e);
							resolve();
						}
					});
			});
		},
		result({ data }) {
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.idleCreditOptIn = !!_get(data, 'autolending.currentProfile.idleCreditOptIn');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
		// fetch opt out setting
		this.getSetOptOutSetting();
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
		getSetOptOutSetting() {
			// get contentful setting for opt-out toggle visibility
			this.federation.query({
				query: contentful,
				variables: {
					contentType: 'uiSetting',
					contentKey: 'ui-autolend-opt-out-toggle',
				}
			}).then(({ data }) => {
				const uiOptOutSetting = _get(
					data,
					'contentful.entries.items',
					[]
				).find(item => item.fields.key === 'ui-autolend-opt-out-toggle');

				// set opt out control visibility based on it's properties
				this.showOptOutControls = settingEnabled(
					uiOptOutSetting.fields,
					'active',
					'startDate',
					'endDate'
				);
			});
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

$autolending-font-size: rem-calc(18.8);

.tempContentWrapper {
	padding-top: 1rem;
}

.toggle-sub-text {
	font-size: $normal-text-font-size;
	display: block;
	color: $kiva-text-light;
}

.autolending {
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

		&.main-settings {
			margin-top: 0;
		}
	}

	.criteria-title {
		margin-bottom: 2rem;
		font-weight: $global-weight-bold;
	}

	.setting-column {
		margin-bottom: 1.25rem;
	}

	.advanced-settings-toggle {
		color: $kiva-textlink;
		font-weight: 300;
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

	.basket-bar {
		display: none;
	}

	//NEW
	.settings-card {
		background: $white;
		padding: 1.95rem;
	}

	.criteria-wrapper {
		background: $white;
		padding: 1.95rem 1.95rem 1.95rem 4.7rem;
	}

	.status-area {
		margin-bottom: 1.5rem;
	}
}
</style>
