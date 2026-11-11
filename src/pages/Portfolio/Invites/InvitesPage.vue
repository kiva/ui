<template>
	<PortfolioShell>
		<div class="tw-rounded md:tw-bg-primary tw-p-2 tw-py-3 md:tw-p-3" data-hj-suppress>
			<h1 class="tw-text-headline tw-mb-1">
				Invite your friends to Kiva!
			</h1>
			<p class="tw-mb-3">
				Maximize your impact by inviting more people to join Kiva and make loans to alleviate poverty worldwide.
			</p>

			<div class="tw-grid tw-grid-cols-12 tw-gap-3">
				<div class="tw-col-span-12 lg:tw-col-span-8 tw-min-w-0 tw-flex tw-flex-col tw-gap-3">
					<section class="tw-pb-3" data-testid="invites-composer">
						<InviteComposerTabs
							:personal-url="personalUrl"
							:loading="loading"
							:load-error="loadError"
							@shared="refreshActivity"
						>
							<template #email>
								<InviteComposer
									:first-name="firstName"
									:is-public="isPublic"
									:disabled="loading || loadError"
									@sent="refreshActivity"
								/>
							</template>
						</InviteComposerTabs>
					</section>

					<section class="tw-pb-3" data-testid="invites-activity">
						<h2 class="tw-text-h3 tw-mb-1">
							My invite activity
						</h2>
						<p class="tw-mb-2">
							Here is a record of the invitations you sent to join Kiva or to join a team.
						</p>
						<InviteActivityTable ref="activityTable" />
					</section>

					<section class="tw-pb-3" data-testid="invites-accepted">
						<h2 class="tw-text-h3 tw-mb-1">
							Accepted invites
						</h2>
						<p class="tw-mb-2">
							Listed below are users who joined Kiva thanks to you!
						</p>
						<AcceptedInvitesTable />
					</section>
				</div>

				<aside
					class="tw-col-span-12 lg:tw-col-span-4 tw-min-w-0 tw-flex tw-flex-col tw-gap-3"
					:aria-busy="loading"
				>
					<span v-if="loading" class="tw-sr-only" role="status">Loading invite details</span>
					<div v-if="loadError" role="alert" data-testid="invites-load-error">
						<p>{{ errorMessage }}</p>
						<KvButton
							class="tw-mt-2"
							@click="fetchInvites"
							v-kv-track-event="['portfolio', 'click', 'Invites retry load']"
						>
							Try again
						</KvButton>
					</div>

					<template v-else>
						<section data-testid="invites-personal-url">
							<h2 class="tw-text-h4 tw-mb-1">
								Your personal invite page
							</h2>
							<div v-if="loading" class="tw-mb-1" data-testid="invites-personal-url-loading">
								<KvLoadingText />
							</div>
							<input
								v-else
								class="tw-w-full tw-rounded tw-border tw-border-tertiary tw-p-1 tw-mb-1 tw-text-small"
								type="text"
								readonly
								aria-label="Your personal invite page"
								:value="personalUrl"
								@click="$event.target.select()"
								v-kv-track-event="['portfolio', 'click', 'Invites personal url']"
							>
							<p class="tw-text-small">
								Share the link above (click, copy and paste) to invite your friends to join Kiva.
							</p>
						</section>

						<section data-testid="invites-stats">
							<h2 class="tw-text-h4 tw-mb-1">
								Invite stats
							</h2>
							<div class="tw-flex tw-gap-3">
								<div>
									<div class="tw-text-h2" data-testid="invites-accepted-count">
										<KvLoadingText v-if="loading" class="tw-w-4" />
										<template v-else>
											{{ invitesAccepted }}
										</template>
									</div>
									<p class="tw-text-small">
										Successful invites
									</p>
								</div>
								<div>
									<div class="tw-text-h2" data-testid="invitee-loan-count">
										<KvLoadingText v-if="loading" class="tw-w-4" />
										<template v-else>
											{{ inviteeLoanCount }}
										</template>
									</div>
									<p class="tw-text-small">
										loans made by invitees
									</p>
								</div>
							</div>
						</section>

						<!-- The heading depends on whether there is an inviter, so it loads with the box -->
						<section v-if="loading" data-testid="invites-inviter-loading">
							<div class="tw-text-h4 tw-mb-1">
								<KvLoadingText class="tw-w-16" />
							</div>
							<KvLoadingText class="tw-w-16" />
						</section>
						<!-- Focused once the inviter is credited, when the button that opened the form is gone -->
						<section
							v-else
							ref="inviterSection"
							class="focus:tw-outline-none"
							tabindex="-1"
							data-testid="invites-inviter"
						>
							<template v-if="!inviter">
								<h2 class="tw-text-h4 tw-mb-1">
									Invited to Kiva by a friend?
								</h2>
								<button
									type="button"
									class="tw-text-link"
									ref="ackButton"
									data-testid="invites-ack-inviter"
									@click="ackOpen = true"
									v-kv-track-event="['portfolio', 'click', 'Invites open acknowledge inviter']"
								>
									Give your friend credit.
								</button>
							</template>
							<template v-else>
								<h2 class="tw-text-h4 tw-mb-1">
									Invited by
								</h2>
								<div class="tw-flex tw-items-center tw-gap-2">
									<KvUserAvatar
										class="tw-shrink-0 tw-w-10 tw-h-10"
										:lender-name="inviterName"
										:lender-image-url="inviterImageUrl"
									/>
									<div class="tw-min-w-0">
										<a
											v-if="inviterLender"
											:href="`/lender/${inviterLender.publicId}`"
											class="tw-block tw-truncate"
											data-testid="invites-inviter-name"
											v-kv-track-event="['portfolio', 'click', 'Invites inviter profile']"
										>{{ inviterName }}</a>
										<p v-else data-testid="invites-inviter-name">
											{{ inviterName }}
										</p>
										<p
											v-if="inviterLocation"
											class="tw-text-small"
											data-testid="invites-inviter-location"
										>
											{{ inviterLocation }}
										</p>
									</div>
								</div>
							</template>
						</section>
					</template>
				</aside>
			</div>
		</div>
		<AcknowledgeInviterModal
			:visible="ackOpen"
			@close="closeAck"
			@acknowledged="onInviterAcknowledged"
			@not-found="refreshInviter"
		/>
	</PortfolioShell>
</template>

<script>
import {
	KvButton, KvLoadingText, KvUserAvatar,
} from '@kiva/kv-components';
import PortfolioShell from '#src/components/WwwFrame/PortfolioShell';
import AcceptedInvitesTable from '#src/components/Portfolio/Invites/AcceptedInvitesTable';
import InviteActivityTable from '#src/components/Portfolio/Invites/InviteActivityTable';
import AcknowledgeInviterModal from '#src/components/Portfolio/Invites/AcknowledgeInviterModal';
import InviteComposer from '#src/components/Portfolio/Invites/InviteComposer';
import InviteComposerTabs from '#src/components/Portfolio/Invites/InviteComposerTabs';
import logFormatter from '#src/util/logFormatter';
import focusIfDropped from '#src/util/invites/focusIfDropped';
import { INVITE_ERROR_MESSAGE } from '#src/util/invites/invitesConstants';
import myInvitesQuery from '#src/graphql/query/portfolio/myInvites.graphql';

const ANONYMOUS_NAME = 'Anonymous';

export default {
	name: 'InvitesPage',
	head() {
		return {
			title: 'Invite friends',
		};
	},
	components: {
		PortfolioShell,
		AcceptedInvitesTable,
		AcknowledgeInviterModal,
		InviteActivityTable,
		InviteComposer,
		InviteComposerTabs,
		KvButton,
		KvLoadingText,
		KvUserAvatar,
	},
	inject: ['apollo'],
	data() {
		return {
			errorMessage: INVITE_ERROR_MESSAGE,
			loading: true,
			loadError: false,
			inviterNameForUrl: null,
			firstName: '',
			isPublic: false,
			// null = no inviter; { lender: null } = anonymous inviter
			inviter: null,
			ackOpen: false,
			invitesAccepted: 0,
			inviteeLoanCount: 0,
		};
	},
	computed: {
		personalUrl() {
			if (!this.inviterNameForUrl) {
				return '';
			}
			return `https://${this.$appConfig.host}/invitedby/${this.inviterNameForUrl}`;
		},
		inviterLender() {
			return this.inviter?.lender ?? null;
		},
		inviterName() {
			return this.inviterLender?.name ?? ANONYMOUS_NAME;
		},
		inviterImageUrl() {
			return this.inviterLender?.image?.url ?? '';
		},
		inviterLocation() {
			const lenderPage = this.inviterLender?.lenderPage;
			if (!lenderPage) {
				return '';
			}
			const country = lenderPage.country?.name === 'United States' ? 'USA' : lenderPage.country?.name;
			return [lenderPage.city, lenderPage.state, country].filter(Boolean).join(', ');
		},
	},
	methods: {
		// New invites show at the top of the activity list
		refreshActivity() {
			this.$refs.activityTable?.fetchFirstPage();
		},
		// Focus goes back to the button that opened the form, since the control that closed it is now hidden
		async closeAck() {
			this.ackOpen = false;
			await this.$nextTick();
			this.$refs.ackButton?.focus();
		},
		// The inviter card replaces the form, and focus moves to it from the form, or from the page when the button
		// that opened the form is gone. Focus the viewer moved elsewhere is left alone.
		async showInviter(inviter) {
			const wasOpen = this.ackOpen;
			this.ackOpen = false;
			this.inviter = inviter;
			await this.$nextTick();
			if (wasOpen) {
				this.$refs.inviterSection?.focus();
			} else {
				focusIfDropped(this.$refs.inviterSection);
			}
		},
		onInviterAcknowledged({ inviter, lines }) {
			this.$showTipMsg(lines.join(' '));
			// An inviter credited without details shows as anonymous
			this.showInviter(inviter ?? { lender: null });
		},
		// An inviter credited since the page loaded, such as in another tab, replaces the form
		async refreshInviter() {
			try {
				const { data } = await this.apollo.query({ query: myInvitesQuery, fetchPolicy: 'network-only' });
				const inviter = data?.my?.userAccount?.invites?.inviter;
				if (inviter && !this.inviter) {
					await this.showInviter(inviter);
				}
			} catch (error) {
				logFormatter(`Error refreshing inviter: ${error}`, 'error');
			}
		},
		async fetchInvites() {
			this.loading = true;
			this.loadError = false;
			try {
				const { data, errors } = await this.apollo.query({
					query: myInvitesQuery,
					fetchPolicy: 'network-only',
				});
				const userAccount = data?.my?.userAccount;
				const userStats = data?.my?.userStats;
				// A failed field comes back as null alongside errors, which would read as "no inviter"
				if (errors?.length || !userAccount?.invites || !userStats) {
					this.loadError = true;
					logFormatter(`Error fetching invites: ${JSON.stringify(errors ?? 'missing fields')}`, 'error');
					return;
				}
				this.inviterNameForUrl = userAccount.inviterName ?? null;
				this.firstName = userAccount.firstName ?? '';
				this.isPublic = !!userAccount.public;
				this.inviter = userAccount.invites.inviter ?? null;
				this.invitesAccepted = userStats.number_of_invites ?? 0;
				this.inviteeLoanCount = userStats.number_of_loans_by_invitees ?? 0;
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching invites: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
	},
	mounted() {
		this.fetchInvites();
	},
};
</script>
