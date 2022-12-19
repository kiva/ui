<template>
	<www-page
		class="email-settings"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					Email Settings
				</h1>
			</div>
			<form @submit.prevent>
				<div class="row">
					<kv-settings-card class="columns small-12 large-8">
						<template #content>
							<p class="tw-mb-4">
								To customize the communications you receive select specific emails
								from the list below. You can also disable most email communication
								but
								<strong>Kiva is still legally required to send a few emails</strong>
								about your account status and activity.
							</p>
							<label for="global-unsubscribed-input" class="tw-block tw-mb-1">
								Do you want to receive emails from Kiva?
							</label>
							<kv-select
								id="global-unsubscribed-input"
								v-model="form.globalUnsubscribed"
							>
								<option :value="false">
									Yes, send me emails
								</option>
								<option :value="true">
									Send only legally required emails
								</option>
							</kv-select>
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
								<button class="tw-text-link tw-font-medium tw-mb-2" @click="generalToggleAll()">
									{{ generalAllSelected ? "Deselect" : "Select" }} All
								</button>
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
								<kv-checkbox
									v-if="isMonthlyGoodSubscriber"
									id="monthlyGood"
									name="monthlyGood"
									v-model="form.monthlyGood"
									class="email-settings__checkbox"
								>
									Monthly Good updates
								</kv-checkbox>

								<label
									class="tw-block tw-mt-4 tw-mb-1"
									for="repayment-updates-input"
								>Repayment notifications</label>
								<kv-select
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
								</kv-select>

								<push-repayment-updates
									class="email-settings__notifications tw-mt-2"
									v-show="form.repaymentUpdates !== 'none'"
								/>

								<label
									for="autolend-updates-input"
									class=" tw-block tw-mt-4 tw-mb-1"
								>Autolending notifications</label>
								<kv-select
									id="autolend-updates-input"
									v-model="form.autolendUpdates"
									class="tw-mb-4"
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
								</kv-select>
								<a href="/lend/saved-search" class="tw-font-medium">Saved searches notifications</a>
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
								<button class="tw-text-link tw-font-medium tw-mb-2" @click="lendingToggleAll()">
									{{ lendingAllSelected ? "Deselect" : "Select" }} All
								</button>
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
								<label for="team-digests-input" class="tw-block tw-mb-1 tw-mt-4">Team digests</label>
								<kv-select
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
								</kv-select>
							</fieldset>

							<!-- User per team preferences -->
							<fieldset
								class="email-settings__per-team-prefs tw-mt-4"
								v-if="hasTeams && form.teamDigests !== 'no'"
							>
								<button
									class="tw-text-link tw-font-medium tw-mb-2"
									@click="teamsShown = !teamsShown"
								>
									{{ teamsShown ? "Hide" : "Show" }} per-team preferences
								</button>
								<div v-if="teamsShown">
									<template v-for="(team, index) in form.teamMessageFrequencies">
										<label
											for="single-team-digest-input"
											:key="`team${index}-label`"
											class="tw-block tw-mb-1"
										>{{ team.name }}</label>
										<kv-select
											:key="`team${index}-select`"
											id="single-team-digest-input"
											v-model="team.frequency"
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
											<option value="default">
												Use my default for teams
											</option>
										</kv-select>
									</template>
								</div>
							</fieldset>
						</template>
					</kv-settings-card>
				</div>

				<div class="row" v-if="isBorrower">
					<!-- Borrower Settings -->
					<kv-settings-card
						class="columns small-12 large-8"
						title="Entrepreneur tips"
						:disabled="form.globalUnsubscribed"
					>
						<template #content>
							<fieldset>
								<button class="tw-text-link tw-font-medium" @click="borrowerToggleAll()">
									{{ borrowerAllSelected ? "Deselect" : "Select" }} All
								</button>
								<kv-checkbox
									id="leadNurturing"
									name="leadNurturing"
									v-model="form.leadNurturing"
									class="email-settings__checkbox"
								>
									Getting started with Kiva
								</kv-checkbox>
								<kv-checkbox
									id="onboardingSupport"
									name="onboardingSupport"
									v-model="form.onboardingSupport"
									class="email-settings__checkbox"
								>
									Loan success guide
								</kv-checkbox>
								<kv-checkbox
									id="borrowerNews"
									name="borrowerNews"
									v-model="form.borrowerNews"
									class="email-settings__checkbox"
								>
									Entrepreneur community updates
								</kv-checkbox>
							</fieldset>
						</template>
					</kv-settings-card>
				</div>

				<div class="row" v-if="isTrustee">
					<!-- Trustee Settings -->
					<kv-settings-card
						class="columns small-12 large-8"
						title="Trustee updates"
						:disabled="form.globalUnsubscribed"
					>
						<template #content>
							<fieldset>
								<button class="tw-text-link tw-font-medium" @click="trusteeToggleAll()">
									{{ trusteeAllSelected ? "Deselect" : "Select" }} All
								</button>
								<kv-checkbox
									id="networkTransactions"
									name="networkTransactions"
									v-model="form.networkTransactions"
									class="email-settings__checkbox"
								>
									Borrower network transactions
								</kv-checkbox>
								<kv-checkbox
									id="networkDigest"
									name="networkDigest"
									v-model="form.networkDigest"
									class="email-settings__checkbox"
								>
									Borrower network digest
								</kv-checkbox>
								<kv-checkbox
									id="trusteeNews"
									name="trusteeNews"
									v-model="form.trusteeNews"
									class="email-settings__checkbox"
								>
									Trustee news and tips
								</kv-checkbox>
							</fieldset>
						</template>
					</kv-settings-card>
				</div>

				<div class="row">
					<div class="columns small-12 large-8">
						<kv-button
							class="smallest"
							@click.native="saveSettings"
							:disabled="!isChanged || isProcessing"
						>
							Save email settings <kv-loading-spinner v-if="isProcessing" />
						</kv-button>
						<button
							v-if="isChanged"
							class="tw-text-link tw-font-medium email-settings__reset-button"
							@click="resetForm"
						>
							Reset
						</button>
					</div>
				</div>
			</form>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
// import * as Sentry from "@sentry/vue";
import { gql } from '@apollo/client';
import logFormatter from '@/util/logFormatter';

import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvSelect from '@/components/Kv/KvSelect';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import PushRepaymentUpdates from '@/components/Settings/PushRepaymentUpdates';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';

const pageQuery = gql`
	query communicationPreferences {
		my {
			autoDeposit {
				id
				isSubscriber
			}
			trustee {
				id
			}
			teams {
				totalCount
				values {
					id
					team {
						id
						name
					}
					sendTeamMessages
				}
			}
			isBorrower
			communicationSettings {
				accountUpdates
				autolendUpdates
				borrowerNews
				commentsMessages
				globalUnsubscribed
				leadNurturing
				lenderNews
				loanUpdates
				monthlyGood
				networkDigest
				networkTransactions
				onboardingSupport
				repaymentUpdates
				teamDigests
				trusteeNews
			}
		}
	}
`;

/**
 * Takes raw data.teams.values array and returns array of objects
 * in the format expected for teamMessageFrequencies
 * Sample:
 * [{teamId: 18077, frequency: "yes"}]
 * @param {Array}
 * @returns {Array}
 */
const generateTeamMessageFrequencies = teamValues => {
	try {
		return teamValues.map(teamValue => {
			return {
				teamId: teamValue.team.id,
				frequency: teamValue.sendTeamMessages,
				name: teamValue.team.name
			};
		});
	} catch {
		return [];
	}
};

export default {
	name: 'EmailSettings',
	components: {
		KvButton,
		KvCheckbox,
		KvDefaultWrapper,
		KvSelect,
		KvLoadingSpinner,
		KvSettingsCard,
		PushRepaymentUpdates,
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
				monthlyGood: false,
				lenderNews: false,
				repaymentUpdates: 'monthly',
				autolendUpdates: 'monthly',
				loanUpdates: false,
				commentsMessages: false,
				teamDigests: 'weekly',
				leadNurturing: false,
				onboardingSupport: false,
				borrowerNews: false,
				networkTransactions: false,
				networkDigest: false,
				trusteeNews: false,
				teamMessageFrequencies: []
			},
			// Component Data
			initialValues: {},
			generalAllSelected: false,
			lendingAllSelected: false,
			borrowerAllSelected: false,
			trusteeAllSelected: false,
			isProcessing: false,
			isBorrower: false,
			isTrustee: false,
			hasTeams: false,
			teamsShown: false,
			isMonthlyGoodSubscriber: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isBorrower = data?.my?.isBorrower ?? false;
			this.isTrustee = !!data?.my?.trustee?.id;
			this.hasTeams = data?.my?.teams?.totalCount && data?.my?.teams?.totalCount > 0;
			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

			// Get user email settings or set to default
			// Global setting
			this.form.globalUnsubscribed = data?.my?.communicationSettings?.globalUnsubscribed ?? false;

			// General settings
			this.form.accountUpdates = data?.my?.communicationSettings?.accountUpdates ?? false;
			this.form.lenderNews = data?.my?.communicationSettings?.lenderNews ?? false;
			this.form.repaymentUpdates = data?.my?.communicationSettings?.repaymentUpdates ?? 'monthly';
			this.form.autolendUpdates =	data?.my?.communicationSettings?.autolendUpdates ?? 'monthly';
			this.form.monthlyGood = data?.my?.communicationSettings?.monthlyGood ?? false;
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
			// Lending team settings
			if (this.hasTeams) {
				this.form.teamMessageFrequencies = generateTeamMessageFrequencies(data?.my?.teams?.values);
			}

			// Borrower settings
			this.form.leadNurturing = data?.my?.communicationSettings?.leadNurturing ?? false;
			this.form.onboardingSupport = data?.my?.communicationSettings?.onboardingSupport ?? false;
			this.form.borrowerNews = data?.my?.communicationSettings?.borrowerNews ?? false;
			// Borrower select toggle
			if (this.form.leadNurturing && this.form.onboardingSupport && this.form.borrowerNews) {
				this.borrowerAllSelected = true;
			}

			// Trustee settings
			this.form.networkTransactions = data?.my?.communicationSettings?.networkTransactions ?? false;
			this.form.networkDigest = data?.my?.communicationSettings?.networkDigest ?? false;
			this.form.trusteeNews = data?.my?.communicationSettings?.trusteeNews ?? false;
			// Trustee select toggle
			if (this.form.networkTransactions && this.form.networkDigest && this.form.trusteeNews) {
				this.trusteeAllSelected = true;
			}

			// Make a deep copy of initial values for reset functionality
			this.initialValues = JSON.parse(JSON.stringify(this.form));
		},
	},
	computed: {
		isChanged() {
			// Quickly deep compare 2 objects
			return JSON.stringify(this.initialValues) !== JSON.stringify(this.form);
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
				this.form.monthlyGood = true;
				this.form.lenderNews = true;
				this.form.repaymentUpdates = 'monthly';
				this.form.autolendUpdates = 'monthly';
			} else {
				this.form.accountUpdates = false;
				this.form.monthlyGood = false;
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
		borrowerToggleAll() {
			// Toggle select flag
			this.borrowerAllSelected = !this.borrowerAllSelected;
			// Set borrower values to their default values
			if (this.borrowerAllSelected) {
				this.form.leadNurturing = true;
				this.form.onboardingSupport = true;
				this.form.borrowerNews = true;
			} else {
				this.form.leadNurturing = false;
				this.form.onboardingSupport = false;
				this.form.borrowerNews = false;
			}
		},
		trusteeToggleAll() {
			// Toggle select flag
			this.trusteeAllSelected = !this.trusteeAllSelected;
			// Set trustee values to their default values
			if (this.trusteeAllSelected) {
				this.form.networkTransactions = true;
				this.form.networkDigest = true;
				this.form.trusteeNews = true;
			} else {
				this.form.networkTransactions = false;
				this.form.networkDigest = false;
				this.form.trusteeNews = false;
			}
		},
		async saveSettings() {
			this.isProcessing = true;
			try {
				// globalUnsubscribed is true, fire unsubscribe all mutation
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

				// globalUnsubscribed is false, fire mutation with itemized subscribe settings
				if (!this.form.globalUnsubscribed) {
					// remove name property from team frequencies
					const cleanedTeamFrequencies = this.form.teamMessageFrequencies.map(teamValue => {
						return {
							teamId: teamValue.teamId,
							frequency: teamValue.frequency
						};
					});

					const updateCommunicationSettings = this.apollo.mutate({
						mutation: gql`
							mutation updateCommunicationSettings(
								$globalUnsubscribed: Boolean
								$lenderNews: Boolean
								$accountUpdates: Boolean
								$monthlyGood: Boolean
								$repaymentUpdates: MessageFrequencyEnum
								$autolendUpdates: MessageFrequencyEnum
								$loanUpdates: Boolean
								$commentsMessages: Boolean
								$teamDigests: TeamMessageFrequencyEnum,
								$leadNurturing: Boolean,
								$onboardingSupport: Boolean,
								$borrowerNews: Boolean,
								$networkTransactions: Boolean,
								$networkDigest: Boolean,
								$trusteeNews: Boolean,
								$teamMessageFrequencies: [TeamMessageFrequencyInput]
							) {
								my {
									updateCommunicationSettings(
										communicationSettings: {
											globalUnsubscribed: $globalUnsubscribed
											lenderNews: $lenderNews
											accountUpdates: $accountUpdates
											monthlyGood: $monthlyGood
											repaymentUpdates: $repaymentUpdates
											autolendUpdates: $autolendUpdates
											loanUpdates: $loanUpdates
											commentsMessages: $commentsMessages
											teamDigests: $teamDigests,
											leadNurturing: $leadNurturing,
											onboardingSupport: $onboardingSupport,
											borrowerNews: $borrowerNews,
											networkTransactions: $networkTransactions,
											networkDigest: $networkDigest,
											trusteeNews: $trusteeNews
										}
									)
									updateTeamMessageFrequencies (frequencies: $teamMessageFrequencies)
								}
							}
						`,
						variables: {
							globalUnsubscribed: this.form.globalUnsubscribed,
							lenderNews: this.form.lenderNews,
							accountUpdates: this.form.accountUpdates,
							monthlyGood: this.form.monthlyGood,
							repaymentUpdates: this.form.repaymentUpdates,
							autolendUpdates: this.form.autolendUpdates,
							loanUpdates: this.form.loanUpdates,
							commentsMessages: this.form.commentsMessages,
							teamDigests: this.form.teamDigests,
							leadNurturing: this.form.leadNurturing,
							onboardingSupport: this.form.onboardingSupport,
							borrowerNews: this.form.borrowerNews,
							networkTransactions: this.form.networkTransactions,
							networkDigest: this.form.networkDigest,
							trusteeNews: this.form.trusteeNews,
							teamMessageFrequencies: cleanedTeamFrequencies
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
			} catch (error) {
				logFormatter(error, 'error');
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
	form .row:last-child {
		margin-bottom: 3rem;
	}

	&__per-team-prefs,
	&__notifications {
		margin-left: 1rem;
	}

	&__notifications {
		margin-bottom: 0.75rem;
	}

	&__reset-button {
		margin-bottom: rem-calc(12);
		vertical-align: middle;
		margin-left: 2rem;
	}

	::v-deep .text-link.button {
		margin-bottom: 0.5rem;
	}

	&__checkbox {
		margin-bottom: 0.25rem;
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
