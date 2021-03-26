<template>
	<www-page class="email-settings" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="email-settings__title-area">
			<div class="row column">
				<h1>Email Settings</h1>
			</div>
		</div>
		<form @submit.prevent>
			<div class="row">
				<kv-settings-card class="columns small-12 large-8" title="">
					<template #content>
						<p>
							To customize the communications you receive select specific emails
							from the list below. You can also disable most email communication
							but
							<strong>Kiva is still legally required to send a few emails</strong>
							about your account status and activity.
						</p>
						<label for="global-unsubscribed-input">
							<strong>Do you want to receive emails from Kiva?</strong>
						</label>
						<kv-dropdown-rounded
							id="global-unsubscribed-input"
							v-model="form.globalUnsubscribed"
						>
							<option :value="false">
								Yes, send me emails
							</option>
							<option :value="true">
								Send only legally required emails
							</option>
						</kv-dropdown-rounded>
					</template>
				</kv-settings-card>
			</div>
			<div class="row">
				<!-- General Settings -->
				<kv-settings-card
					class="columns small-12 large-8"
					title="General Kiva / account updates"
					:disabled="form.globalUnsubscribed"
				>
					<template #content>
						<fieldset>
							<kv-button class="text-link" @click.native="generalToggleAll()">
								{{ generalAllSelected ? "Deselect" : "Select" }} All
							</kv-button>
							<kv-checkbox
								id="lenderNews"
								name="lenderNews"
								v-model="form.lenderNews"
								class="email-settings__checkbox"
							>
								News, inspiration and promotions
							</kv-checkbox>
							<kv-checkbox
								id="accountUpdates"
								name="accountUpdates"
								v-model="form.accountUpdates"
								class="email-settings__checkbox"
							>
								Portfolio and balance updates
							</kv-checkbox>
							<label for="repayment-updates-input">Repayment notifications</label>
							<kv-dropdown-rounded
								id="repayment-updates-input"
								v-model="form.repaymentUpdates"
							>
								<option value="none">
									Do not send
								</option>
								<option value="nightly">
									Send a nightly digest
								</option>
								<option value="monthly">
									Send a monthly digest
								</option>
							</kv-dropdown-rounded>
							<!-- TODO Implement Service Worker for push notifications -->
							<!-- When repaymentUpdates == 'none' this should be hidden -->
							<!-- <div class="input-wrapper nested">
								<input id="push-repayment-updates-input" type="checkbox">
								<label for="push-repayment-updates-input">
									Receive notifications on this device
								</label>
							</div> -->
							<label for="autolend-updates-input">Autolending notifications</label>
							<kv-dropdown-rounded
								id="autolend-updates-input"
								v-model="form.autolendUpdates"
							>
								<option value="none">
									Do not send
								</option>
								<option value="nightly">
									Send a nightly digest
								</option>
								<option value="monthly">
									Send a monthly digest
								</option>
							</kv-dropdown-rounded>
							<a href="/lend/saved-search">Saved searches notifications</a>
						</fieldset>
					</template>
				</kv-settings-card>
			</div>

			<div class="row">
				<!-- Loan Settings -->
				<kv-settings-card
					class="columns small-12 large-8"
					title="Lending activity updates"
					:disabled="form.globalUnsubscribed"
				>
					<template #content>
						<fieldset>
							<kv-button class="text-link" @click.native="lendingToggleAll()">
								{{ lendingAllSelected ? "Deselect" : "Select" }} All
							</kv-button>
							<kv-checkbox
								id="loanUpdates"
								name="loanUpdates"
								v-model="form.loanUpdates"
								class="email-settings__checkbox"
							>
								Loan and borrower updates
							</kv-checkbox>
							<kv-checkbox
								id="commentsMessages"
								name="commentsMessages"
								v-model="form.commentsMessages"
								class="email-settings__checkbox"
							>
								Loan comments, lender to lender messages
							</kv-checkbox>
							<label for="team-digests-input">Team digests</label>
							<kv-dropdown-rounded
								id="team-digests-input"
								v-model="form.teamDigests"
							>
								<option value="no">
									Do not send
								</option>
								<option value="yes">
									Send as they arrive
								</option>
								<option value="nightly">
									Send a nightly digest
								</option>
								<option value="weekly">
									Send a weekly digest
								</option>
							</kv-dropdown-rounded>
						</fieldset>
					</template>
				</kv-settings-card>
			</div>

			<!-- !TODO Add Trustee email settings section  -->
			<!-- !TODO Add Borrower email settings section  -->
			<div class="row">
				<div class="columns small-12 large-8">
					<kv-button
						class="smallest"
						@click.native="saveSettings"
						:disabled="!isChanged || isProcessing"
					>
						Save email settings <kv-loading-spinner v-if="isProcessing" />
					</kv-button>
					<kv-button
						v-if="isChanged"
						class="text-link email-settings__reset-button"
						@click.native="resetForm"
					>
						Reset
					</kv-button>
				</div>
			</div>
		</form>
	</www-page>
</template>

<script>
// import * as Sentry from "@sentry/browser";
import gql from 'graphql-tag';

import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`
	query communicationPreferences {
		my {
			communicationSettings {
				globalUnsubscribed
				accountUpdates
				lenderNews
				repaymentUpdates
				autolendUpdates
				loanUpdates
				commentsMessages
				teamDigests
			}
		}
	}
`;

/** Legacy Mutation - For reference
gqlMyUpdateCommunicationSettings: gql`
	mutation ($globalUnsubscribed: Boolean,
				$lenderNews: Boolean,
				$accountUpdates: Boolean,
				$monthlyGood: Boolean,
				$repaymentUpdates: MessageFrequencyEnum,
				$autolendUpdates: MessageFrequencyEnum,
				$loanUpdates: Boolean,
				$commentsMessages: Boolean,
				$teamDigests: TeamMessageFrequencyEnum,
				$leadNurturing: Boolean,
				$onboardingSupport: Boolean,
				$borrowerNews: Boolean,
				$networkTransactions: Boolean,
				$networkDigest: Boolean,
				$trusteeNews: Boolean,
				$loansToSubscribe: [Int],
				$loansToUnsubscribe: [Int],
				$teamMessageFrequencies: [TeamMessageFrequencyInput]
	) {
	my {
		updateCommunicationSettings (communicationSettings: {
			globalUnsubscribed: $globalUnsubscribed
			lenderNews: $lenderNews
			accountUpdates: $accountUpdates
			monthlyGood: $monthlyGood
			repaymentUpdates: $repaymentUpdates
			autolendUpdates: $autolendUpdates
			loanUpdates: $loanUpdates
			commentsMessages: $commentsMessages
			teamDigests: $teamDigests
			leadNurturing: $leadNurturing
			onboardingSupport: $onboardingSupport
			borrowerNews: $borrowerNews
			networkTransactions: $networkTransactions
			networkDigest: $networkDigest
			trusteeNews: $trusteeNews
		})
		updateTeamMessageFrequencies (frequencies: $teamMessageFrequencies)
	}
}`
* */

export default {
	components: {
		KvButton,
		KvCheckbox,
		KvDropdownRounded,
		KvLoadingSpinner,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	metaInfo: {
		title: 'Email settings',
	},
	data() {
		return {
			// Email Settings Values
			form: {
				globalUnsubscribed: false,
				accountUpdates: false,
				lenderNews: false,
				repaymentUpdates: 'monthly',
				autolendUpdates: 'monthly',
				loanUpdates: false,
				commentsMessages: false,
				teamDigests: 'weekly'
			},
			// Component Data
			initialValues: {},
			generalAllSelected: false,
			lendingAllSelected: false,
			isProcessing: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			// Get user email settings or set to default
			// Global setting
			this.form.globalUnsubscribed = data?.my?.communicationSettings?.globalUnsubscribed ?? false;
			// General settings
			this.form.accountUpdates = data?.my?.communicationSettings?.accountUpdates ?? false;
			this.form.lenderNews = data?.my?.communicationSettings?.lenderNews ?? false;
			this.form.repaymentUpdates = data?.my?.communicationSettings?.repaymentUpdates ?? 'monthly';
			this.form.autolendUpdates =	data?.my?.communicationSettings?.autolendUpdates ?? 'monthly';
			// General select toggle
			if (this.form.accountUpdates
			&& this.form.lenderNews
			&& this.form.repaymentUpdates === 'monthly'
			&& this.form.autolendUpdates === 'monthly') {
				this.generalAllSelected = true;
			}
			// Lending settings
			this.form.loanUpdates =	data?.my?.communicationSettings?.loanUpdates ?? false;
			this.form.commentsMessages = data?.my?.communicationSettings?.commentsMessages ?? false;
			this.form.teamDigests = data?.my?.communicationSettings?.teamDigests ?? 'weekly';
			// Lending select toggle
			if (this.form.loanUpdates && this.form.commentsMessages && this.form.teamDigests === 'weekly') {
				this.lendingAllSelected = true;
			}
			// Make a copy of initial values for reset functionality
			this.initialValues = { ...this.form };
		},
	},
	computed: {
		isChanged() {
			// Shallow compare 2 objects
			return Object.entries(this.initialValues).toString() !== Object.entries(this.form).toString();
		},
	},
	methods: {
		resetForm() {
			this.form = { ...this.initialValues };
		},
		generalToggleAll() {
			// Toggle select flag
			this.generalAllSelected = !this.generalAllSelected;
			// Set general values to their default values
			if (this.generalAllSelected) {
				this.form.accountUpdates = true;
				this.form.lenderNews = true;
				this.form.repaymentUpdates = 'monthly';
				this.form.autolendUpdates = 'monthly';
			} else {
				this.form.accountUpdates = false;
				this.form.lenderNews = false;
				this.form.repaymentUpdates = 'none';
				this.form.autolendUpdates = 'none';
			}
		},
		lendingToggleAll() {
			// Toggle select flag
			this.lendingAllSelected = !this.lendingAllSelected;
			// Set lending values to their default values
			if (this.lendingAllSelected) {
				this.form.loanUpdates = true;
				this.form.commentsMessages = true;
				this.form.teamDigests = 'weekly';
			} else {
				this.form.loanUpdates = false;
				this.form.commentsMessages = false;
				this.form.teamDigests = 'no';
			}
		},
		async saveSettings() {
			this.isProcessing = true;
			try {
				// If globalUnsubscribed is true, fire unsubscribe all mutation
				if (this.form.globalUnsubscribed) {
					const unsubscribeFromAllCommunications = this.apollo.mutate({
						mutation: gql`
							mutation unsubscribeFromAllCommunications {
								my {
									unsubscribeFromAllCommunications
								}
							}
						`,
						awaitRefetchQueries: true,
						refetchQueries: [{ query: pageQuery }],
					});
					const unsubscribeResponse = await unsubscribeFromAllCommunications;
					if (unsubscribeResponse.errors) {
						throw new Error(
							unsubscribeResponse.errors[0].extensions.code
								|| unsubscribeResponse.errors[0].message
						);
					}
				}

				// If globalUnsubscribed is false, fire mutation with itemized subscribe settings
				if (!this.form.globalUnsubscribed) {
					const updateCommunicationSettings = this.apollo.mutate({
						mutation: gql`
							mutation updateCommunicationSettings(
								$globalUnsubscribed: Boolean
								$lenderNews: Boolean
								$accountUpdates: Boolean
								$repaymentUpdates: MessageFrequencyEnum
								$autolendUpdates: MessageFrequencyEnum
								$loanUpdates: Boolean
								$commentsMessages: Boolean
								$teamDigests: TeamMessageFrequencyEnum,
							) {
								my {
									updateCommunicationSettings(
										communicationSettings: {
											globalUnsubscribed: $globalUnsubscribed
											lenderNews: $lenderNews
											accountUpdates: $accountUpdates
											repaymentUpdates: $repaymentUpdates
											autolendUpdates: $autolendUpdates
											loanUpdates: $loanUpdates
											commentsMessages: $commentsMessages
											teamDigests: $teamDigests
										}
									)
								}
							}
						`,
						variables: {
							globalUnsubscribed: this.form.globalUnsubscribed,
							lenderNews: this.form.lenderNews,
							accountUpdates: this.form.accountUpdates,
							repaymentUpdates: this.form.repaymentUpdates,
							autolendUpdates: this.form.autolendUpdates,
							loanUpdates: this.form.loanUpdates,
							commentsMessages: this.form.commentsMessages,
							teamDigests: this.form.teamDigests
						},
						awaitRefetchQueries: true,
						refetchQueries: [{ query: pageQuery }],
					});
					const subscribeResponse = await updateCommunicationSettings;
					if (subscribeResponse.errors) {
						throw new Error(
							subscribeResponse.errors[0].extensions.code
								|| subscribeResponse.errors[0].message
						);
					}
				}
				this.$showTipMsg('Your email settings have been saved');
			} catch (err) {
				this.$showTipMsg('There was a problem saving your settings', 'error');
			} finally {
				this.isProcessing = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.email-settings {
	.row:last-child {
		margin-bottom: 3rem;
	}

	&__reset-button {
		margin-bottom: rem-calc(12);
		vertical-align: middle;
		margin-left: 2rem;
	}

	&__title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	::v-deep .text-link.button {
		margin-bottom: 0.5rem;
	}

	&__checkbox {
		margin-bottom: 0.25rem;
	}

	label {
		font-size: 1rem;
	}

	#accountUpdates {
		// hacky additional spacing between elements
		margin-bottom: 5rem;
	}

	// style in button loading spinner
	::v-deep .loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	::v-deep .loading-spinner .line {
		background-color: $white;
	}
}
</style>
