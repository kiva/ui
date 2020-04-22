<template>
	<div>
		<autolending-status />

		<!-- When your balance will be lent -->
		<div class="row when-area" :class="{ obscure: !isEnabled }">
			<div class="column large-8 settings-card">
				<div class="icon-wrapper">
					<kv-icon
						class="icon"
						title="When your balance will be lent"
						name="auto-icon-when"
					/>
				</div>
				<div class="title-wrapper">
					<h3>When your balance will be lent</h3>
				</div>
				<div class="content-wrapper">
					<div class="row column">
						<span v-if="isEnabled" class="toggle-sub-text">
							Kiva will automatically lend my balance
						</span>
						<span v-else class="toggle-sub-text">
							I’ll lend my balance myself
						</span>
					</div>
					<div class="row column">
						<!-- main toggles -->
						<lend-timing-dropdown />
						<donation-dropdown />
					</div>
				</div>
			</div>
		</div>

		<!-- Who you'll support-->
		<div class="row who-area" :class="{ obscure: !isEnabled }">
			<div class="column large-8 settings-card">
				<div class="icon-wrapper">
					<kv-icon
						class="icon"
						title="Who you’ll support"
						name="auto-icon-who"
					/>
				</div>
				<div class="title-wrapper">
					<h3>Who you’ll support</h3>
				</div>
				<div class="content-wrapper">
					<kiva-chooses-radios />

					<!-- basic criteria -->
					<div class="row" v-show="!kivaChooses">
						<div class="column">
							<inline-counter class="show-for-large" />

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
							<div class="row column">
								<button @click="showAdvanced = !showAdvanced" class="advanced-settings-toggle">
									{{ showAdvanced ? 'Hide' : 'Show' }} advanced settings
								</button>
							</div>
							<kv-expandable>
								<div class="row" v-show="showAdvanced">
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
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import AttributeFilter from './AttributeFilter';
import CountryFilter from './CountryFilter';
import DonationDropdown from './DonationDropdown';
import LendTimingDropdown from './LendTimingDropdown';
import InlineCounter from './InlineCounter';
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
		InlineCounter,
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
		KvIcon
	},
	data() {
		return {
			isChanged: false,
			isEnabled: false,
			showAdvanced: false,
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
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
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

.autolending {
	.basket-bar {
		display: none;
	}

	.button {
		.loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;

			& >>> .line {
				background-color: $white;
			}
		}
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

<style lang="scss" scoped>
@import 'settings';

$autolending-font-size: rem-calc(18.8);

.toggle-sub-text {
	font-size: $normal-text-font-size;
	display: block;
	color: $kiva-text-light;
}

.obscure {
	opacity: 0.4;
	pointer-events: none;
}

label {
	font-size: $autolending-font-size;
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

[class*="-area"] {
	margin-bottom: 1.5rem;
}

::v-deep .settings-card {
	background: $white;
	padding: 1.95rem;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	gap: 1rem 1rem;
	grid-template-areas: "icon-wrapper title-wrapper" "icon-wrapper content-wrapper";
}

::v-deep .icon-wrapper {
	grid-area: icon-wrapper;

	.icon {
		margin-top: 1px;
		height: 1.75rem;
		width: 1.75rem;
	}
}

::v-deep .title-wrapper {
	grid-area: title-wrapper;

	h3 {
		font-weight: $global-weight-bold;
	}
}

::v-deep .content-wrapper { grid-area: content-wrapper; }
</style>
