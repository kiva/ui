<template>
	<www-page main-class="tw-bg-secondary tw-pb-3">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-1.5 md:tw-pt-3">
					<div class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 tw-bg-primary">
						<h1 class="tw-text-display tw-mb-2">
							My loans
						</h1>
						<loans-first-loan-cta v-if="showFirstLoanCta" />
						<div v-else class="tw-mb-2">
							<div
								class="tw-flex tw-justify-end tw-text-tertiary tw-text-small tw-mb-1 tw-min-h-2.5"
							>
								<span v-if="lastUpdated">*Updated as of {{ lastUpdated }}</span>
								<kv-loading-placeholder
									v-else-if="!statsLoaded"
									class="tw-self-center"
									style="width: 11rem; height: 0.875rem;"
								/>
							</div>
							<loan-stats-table @updated-as-of="handleUpdatedAsOf" />
						</div>
					</div>
					<div
						v-if="!showFirstLoanCta"
						class="tw-rounded-none md:tw-rounded tw-py-3 tw-px-2 md:tw-px-3 md:tw-mt-3 tw-bg-primary"
					>
						<loan-filter-bar
							:countries="filterOptions.countries"
							:filters="loanState.filters"
							:keyword-search="loanState.keywordSearch"
							:partners="filterOptions.partners"
							:total-loans="totalLoans"
							@filters-changed="handleFiltersChanged"
						/>
						<div ref="loanTableTop">
							<loan-list
								:loans="loans"
								:loading="loading"
								:has-error="loadError"
								:lending-teams="lendingTeams"
								:reassigning-loan-ids="reassigningLoanIds"
								:reassign-nonce="reassignNonce"
								@reassign-team="handleReassignTeam"
							/>
						</div>
						<kv-pagination
							v-if="showPagination"
							class="tw-mt-3"
							:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
							:limit="loanState.limit"
							:offset="loanState.offset"
							:aria-disabled="loading ? 'true' : undefined"
							:scroll-to-top="false"
							:total="totalLoans"
							@page-changed="handlePageChange"
						/>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import {
	KvPageContainer, KvGrid, KvPagination, KvLoadingPlaceholder
} from '@kiva/kv-components';

import logFormatter from '#src/util/logFormatter';
import LoanStatsTable from '#src/components/Portfolio/LoanStatsTable';
import LoanFilterBar from '#src/components/Portfolio/LoanFilterBar';
import LoanList from '#src/components/Portfolio/LoanList';
import LoansFirstLoanCta from '#src/components/Portfolio/LoansFirstLoanCta';
import myLoansQuery from '#src/graphql/query/portfolio/myLoans.graphql';
import reassignLoanTeamMutation from '#src/graphql/mutation/reassignLoanTeam.graphql';

const PAGE_LIMIT = 20;

const sortByName = values => [...(values || [])].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

export default {
	name: 'LoansPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvGrid,
		KvPageContainer,
		KvPagination,
		KvLoadingPlaceholder,
		LoanStatsTable,
		LoanFilterBar,
		LoanList,
		LoansFirstLoanCta
	},
	data() {
		return {
			lastUpdated: '',
			// Set once the stats table has reported its updated-as-of (with or without a value), so
			// the "Updated as of" line shows a loading placeholder only while stats are in flight
			// rather than lingering when there is legitimately no timestamp.
			statsLoaded: false,
			loans: [],
			lendingTeams: [],
			reassigningLoanIds: [],
			reassignNonce: {},
			totalLoans: 0,
			loading: true,
			// Set when a loans fetch rejects so the list can show a distinct error state
			// instead of the "no loans match this search" empty copy.
			loadError: false,
			// null until the first unfiltered fetch resolves; false only when the lender has
			// never lent (lifetime loan count is 0), which swaps the page for the first-loan CTA.
			// Set only from unfiltered requests so a filtered no-results page keeps the
			// no-match empty state ("You haven't made any loans that match this search.").
			hasEverLent: null,
			loanState: {
				offset: 0,
				limit: PAGE_LIMIT,
				filters: {},
				keywordSearch: null,
			},
			filterOptions: {
				countries: [],
				partners: [],
			},
			filterOptionsLoaded: false,
			loanRequestSequence: 0,
			stats: {
				loanStatuses: {
					fundraising: 0,
					funded: 0,
					payingBack: 0,
					payingBackDelinquent: 0,
					repaid: 0,
					repaidWithCurrencyLoss: 0,
					defaulted: 0,
					refunded: 0,
					expired: 0
				}
			}
		};
	},
	computed: {
		showPagination() {
			return this.totalLoans > this.loanState.limit;
		},
		showFirstLoanCta() {
			return this.hasEverLent === false;
		},
	},
	mounted() {
		this.fetchLoans();
	},
	methods: {
		buildLoanQueryVariables() {
			const variables = {
				offset: this.loanState.offset,
				limit: this.loanState.limit,
				includeFilterOptions: !this.filterOptionsLoaded,
			};

			if (Object.keys(this.loanState.filters).length) {
				variables.filters = this.loanState.filters;
			}

			if (this.loanState.keywordSearch) {
				variables.keywordSearch = this.loanState.keywordSearch;
			}

			return variables;
		},
		fetchLoans({ clearLoans = false } = {}) {
			const requestSequence = this.loanRequestSequence + 1;
			this.loanRequestSequence = requestSequence;
			this.loading = true;
			this.loadError = false;
			if (clearLoans) {
				this.loans = [];
			}
			const variables = this.buildLoanQueryVariables();
			// An unfiltered request returns the lender's lifetime loan count, so it's the only
			// request allowed to set the never-lent signal (filtered no-results must not).
			const isUnfilteredRequest = !variables.filters && !variables.keywordSearch;
			return this.apollo.query({
				query: myLoansQuery,
				variables,
				fetchPolicy: 'network-only'
			}).then(({ data }) => {
				if (requestSequence !== this.loanRequestSequence) {
					return;
				}
				if (data?.my?.lendingStats) {
					this.filterOptions = {
						countries: sortByName(data.my.lendingStats.countriesLentTo),
						partners: sortByName(data.my.lendingStats.partnersLentTo),
					};
					this.filterOptionsLoaded = true;
				}
				if (data?.my?.teams?.values) {
					// my.teams is the user's active team memberships (TeamLender records);
					// the reassignment picker only needs each underlying team.
					this.lendingTeams = sortByName(
						data.my.teams.values.map(member => member.team).filter(Boolean)
					);
				}
				if (data?.my?.loans) {
					this.loans = data.my.loans.values || [];
					this.totalLoans = data.my.loans.totalCount;
					if (isUnfilteredRequest) {
						this.hasEverLent = (data.my.loans.totalCount || 0) > 0;
					}
				}
			}).catch(error => {
				if (requestSequence !== this.loanRequestSequence) {
					return;
				}
				this.loadError = true;
				logFormatter(`Error fetching loans: ${error}`, 'error');
			}).finally(() => {
				if (requestSequence === this.loanRequestSequence) {
					this.loading = false;
				}
			});
		},
		handlePageChange({ pageOffset }) {
			if (this.loading) {
				return undefined;
			}
			this.loanState = {
				...this.loanState,
				offset: pageOffset,
			};
			this.scrollToLoanTable();
			return this.fetchLoans({ clearLoans: true });
		},
		handleUpdatedAsOf(iso) {
			this.statsLoaded = true;
			if (!iso) {
				this.lastUpdated = '';
				return;
			}
			const d = new Date(iso);
			if (Number.isNaN(d.getTime())) {
				this.lastUpdated = '';
				return;
			}
			const datePart = d.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
			const timePart = d.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			}).toLowerCase();
			this.lastUpdated = `${datePart} ${timePart}`;
		},
		handleReassignTeam({ loanId, teamId }) {
			// Disable this row's control until its mutation settles. Tracked per loan id so a
			// second row's reassignment can't lift this one's disabled state.
			this.reassigningLoanIds.push(loanId);
			return this.apollo.mutate({
				mutation: reassignLoanTeamMutation,
				variables: { loanId, teamId },
			}).then(({ data }) => {
				const numChanged = data?.my?.reassignLoanTeam ?? 0;
				if (numChanged > 0) {
					// Update just this row's attributed team in place (legacy parity) rather
					// than refetching the page: a reassignment can't change eligibility
					// (status + 14-day window are unaffected), so a full reload would only
					// flash the loading skeleton over the whole table for no new data.
					this.applyTeamAssignment(loanId, teamId);
					this.$showTipMsg('Team updated.');
					return;
				}
				// The backend rejected the change — eligibility lapsed between render
				// and submit (status, window, or ownership). Leave the row untouched.
				this.$showTipMsg('That loan can no longer be reassigned.', 'error');
			}).catch(error => {
				logFormatter(`Error reassigning loan team: ${error}`, 'error');
				this.$showTipMsg('Something went wrong updating the team. Please try again.', 'error');
			}).finally(() => {
				this.reassigningLoanIds = this.reassigningLoanIds.filter(id => id !== loanId);
				// Remount only this row's select so it re-syncs to the attributed team — this
				// reverts the visible selection if the change was rejected or failed.
				this.reassignNonce = {
					...this.reassignNonce,
					[loanId]: (this.reassignNonce[loanId] || 0) + 1,
				};
			});
		},
		applyTeamAssignment(loanId, teamId) {
			const index = this.loans.findIndex(item => String(item.id) === String(loanId));
			if (index === -1) {
				return;
			}
			const loan = this.loans[index];
			const team = this.lendingTeams.find(item => String(item.id) === String(teamId));
			// Apollo freezes query results, so the loan and its userProperties are read-only.
			// Replace the row with a fresh object instead of mutating the frozen one in place.
			const updatedLoan = {
				...loan,
				userProperties: {
					...loan.userProperties,
					userAttributedTeam: team
						? { id: team.id, name: team.name, image: team.image ?? null }
						: null,
				},
			};
			this.loans = [
				...this.loans.slice(0, index),
				updatedLoan,
				...this.loans.slice(index + 1),
			];
		},
		handleFiltersChanged({ filters = {}, keywordSearch = null }) {
			this.loanState = {
				...this.loanState,
				offset: 0,
				filters,
				keywordSearch,
			};
			return this.fetchLoans({ clearLoans: true });
		},
		scrollToLoanTable() {
			this.$refs.loanTableTop?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		},
	}
};
</script>
