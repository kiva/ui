<template>
	<div :aria-busy="loading" tabindex="-1">
		<template v-if="loading">
			<span class="tw-sr-only" role="status">Loading invite activity</span>
			<KvLoadingText :lines="4" data-testid="invite-activity-loading" />
		</template>
		<div v-else-if="loadError" role="alert" data-testid="invite-activity-error">
			<p>{{ errorMessage }}</p>
			<KvButton
				class="tw-mt-2"
				@click="fetchFirstPage"
				v-kv-track-event="['portfolio', 'click', 'Invite activity retry load']"
			>
				Try again
			</KvButton>
		</div>
		<p v-else-if="!rows.length && !hasMore" data-testid="invite-activity-empty">
			You don't have any invites on record.
		</p>
		<template v-else>
			<div class="tw-overflow-x-auto">
				<table
					class="tw-w-full tw-text-left tw-text-small md:tw-text-base"
					ref="table"
					tabindex="-1"
					aria-label="My invite activity"
					data-testid="invite-activity-table"
				>
					<thead>
						<tr class="tw-bg-gray-200">
							<th class="tw-p-1 tw-w-1/4">
								Date
							</th>
							<th class="tw-p-1 tw-w-1/2">
								Activity
							</th>
							<th class="tw-p-1 tw-w-1/4">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, i) in rows"
							:key="row.id"
							class="tw-bg-primary"
							:class="{ '!tw-bg-gray-50': i % 2 === 1 }"
							data-testid="invite-activity-row"
						>
							<td class="tw-p-1 tw-align-top tw-whitespace-nowrap">
								{{ formatDate(row.date) }}
							</td>
							<td class="tw-p-1 tw-align-top tw-break-words">
								<span v-if="viaLabel(row)" class="tw-block">{{ viaLabel(row) }}</span>
								<a
									v-if="row.invitee"
									:href="`/lender/${row.invitee.publicId}`"
									v-kv-track-event="['portfolio', 'click', 'Invite activity invitee profile']"
								>{{ row.invitee.name }}</a>
								<template v-else-if="isAccepted(row)">
									-anonymous-
								</template>
								<span v-else-if="row.toEmailAddress" class="tw-break-all">
									{{ row.toEmailAddress }}
								</span>
							</td>
							<td class="tw-p-1 tw-align-top" data-testid="invite-activity-status">
								<template v-if="showsCounts(row)">
									<span class="tw-block">{{ row.clickCount ?? 0 }} clicks</span>
									<span class="tw-block">{{ row.acceptedCount ?? 0 }} accepted</span>
								</template>
								<template v-else-if="row.status === inviteStatus.ACCEPTED">
									Accepted!
								</template>
								<template v-else-if="row.status === inviteStatus.JOINED_TEAM">
									Joined Team!
								</template>
								<template v-else-if="row.status === inviteStatus.PENDING">
									Pending
								</template>
								<div v-else-if="row.status === inviteStatus.SENT" class="tw-flex tw-flex-col tw-gap-1">
									<KvButton
										v-if="canRemind(row)"
										class="tw-w-full"
										variant="secondary"
										size="small"
										:state="actionState(row, 'remind')"
										data-testid="invite-activity-remind"
										:data-row-id="row.id"
										@click="runAction(row, 'remind')"
									>
										Remind
									</KvButton>
									<span v-else class="tw-block">Sent {{ formatDate(row.date) }}</span>
									<KvButton
										class="tw-w-full"
										variant="secondary"
										size="small"
										:state="actionState(row, 'clear')"
										data-testid="invite-activity-clear"
										:data-row-id="row.id"
										@click="runAction(row, 'clear')"
									>
										Clear
									</KvButton>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<KvButton
				v-if="hasMore || rows.length > initialSize"
				class="tw-mt-2"
				variant="secondary"
				:state="toggleState"
				data-testid="invite-activity-toggle"
				@click="toggleMore"
			>
				{{ hasMore ? 'More' : 'Less' }}
			</KvButton>
		</template>
	</div>
</template>

<script>
import { KvButton, KvLoadingText } from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import { formatInviteDate, inviteViaLabel } from '#src/util/invites/inviteFormat';
import focusIfDropped from '#src/util/invites/focusIfDropped';
import {
	INVITE_ACTION_STATUS,
	INVITE_ERROR_MESSAGE,
	INVITE_STATUS,
	INVITES_TABLE_INITIAL_SIZE,
	INVITES_TABLE_PAGE_SIZE,
} from '#src/util/invites/invitesConstants';
import myInviteActivityQuery from '#src/graphql/query/portfolio/myInviteActivity.graphql';
import remindInviteMutation from '#src/graphql/mutation/invites/remindInvite.graphql';
import clearInviteMutation from '#src/graphql/mutation/invites/clearInvite.graphql';

// The mutation behind each row action, the InviteActionStatusEnum value it returns on success, and the question
// asked before running it
const ROW_ACTIONS = {
	remind: {
		mutation: remindInviteMutation,
		field: 'remindInvite',
		success: INVITE_ACTION_STATUS.SENT,
		confirm: 'Are you sure you want to send a reminder?',
	},
	clear: {
		mutation: clearInviteMutation,
		field: 'clearInvite',
		success: INVITE_ACTION_STATUS.CLEARED,
		confirm: 'Are you sure you want to remove this invitation?',
	},
};

// The share link sources whose rows show their click and accept counts
const SHARE_COUNT_SOURCES = ['TWITTER', 'FACEBOOK', 'FACEBOOK_SHARE'];

// The sources whose rows say how they were sent; rows from other share links leave it out
const ACTIVITY_VIA_SOURCES = ['EMAIL', ...SHARE_COUNT_SOURCES];

// An invite can be reminded again 24 hours after it was sent or last reminded
const REMIND_WAIT_MS = 24 * 60 * 60 * 1000;

export default {
	name: 'InviteActivityTable',
	components: {
		KvButton,
		KvLoadingText,
	},
	inject: ['apollo'],
	data() {
		return {
			errorMessage: INVITE_ERROR_MESSAGE,
			loading: true,
			loadError: false,
			loadingMore: false,
			// The row action in flight, as { id, action }; one runs at a time
			pendingAction: null,
			// Counts first-page loads, so a response that arrives after a reload is dropped
			loadCount: 0,
			rows: [],
			totalCount: 0,
			initialSize: INVITES_TABLE_INITIAL_SIZE,
			inviteStatus: INVITE_STATUS,
		};
	},
	computed: {
		hasMore() {
			return this.rows.length < this.totalCount;
		},
		// Paging and row actions both replace the rows, so only one runs at a time
		busy() {
			return this.loadingMore || !!this.pendingAction;
		},
		toggleState() {
			if (this.loadingMore) {
				return 'loading';
			}
			return this.pendingAction ? 'disabled' : '';
		},
	},
	methods: {
		formatDate: formatInviteDate,
		viaLabel(row) {
			return inviteViaLabel(row, ACTIVITY_VIA_SOURCES);
		},
		showsCounts(row) {
			return SHARE_COUNT_SOURCES.includes(row.source);
		},
		isAccepted(row) {
			return row.status === INVITE_STATUS.ACCEPTED || row.status === INVITE_STATUS.JOINED_TEAM;
		},
		canRemind(row) {
			const availableAt = new Date(row.remindAvailableAt).getTime();
			return !Number.isNaN(availableAt) && Date.now() > availableAt;
		},
		actionState(row, action) {
			if (!this.busy) {
				return '';
			}
			const isThis = this.pendingAction?.id === row.id && this.pendingAction?.action === action;
			return isThis ? 'loading' : 'disabled';
		},
		async runAction(row, action) {
			const {
				mutation, field, success, confirm,
			} = ROW_ACTIONS[action];
			// eslint-disable-next-line no-alert
			if (this.busy || !window.confirm(confirm)) {
				return;
			}
			// Tracked once confirmed, so the events count actions rather than prompts
			this.$kvTrackEvent('portfolio', 'click', `Invite activity ${action}`);
			this.pendingAction = { id: row.id, action };
			try {
				const { data, errors } = await this.apollo.mutate({ mutation, variables: { id: row.id } });
				const result = data?.my?.[field];
				if (errors?.length || !result) {
					throw new Error(JSON.stringify(errors ?? 'missing result'));
				}
				if (result.status !== success) {
					this.$showTipMsg(result.message || INVITE_ERROR_MESSAGE, 'error');
					return;
				}
				this.$showTipMsg(result.message);
				// The rows update in place: a re-read could come from a replica that hasn't seen the change yet. A
				// reload while the action ran may have already left the row out.
				if (!this.rows.some(({ id }) => id === row.id)) {
					return;
				}
				if (action === 'clear') {
					this.rows = this.rows.filter(({ id }) => id !== row.id);
					this.totalCount = Math.max(this.totalCount - 1, 0);
				} else {
					// A reminder makes the invite the newest, and the list is newest first. Moving it keeps the rows
					// the start of the list, which paging relies on.
					const now = Date.now();
					const reminded = {
						...row,
						date: new Date(now).toISOString(),
						remindAvailableAt: new Date(now + REMIND_WAIT_MS).toISOString(),
					};
					this.rows = [reminded, ...this.rows.filter(({ id }) => id !== row.id)];
				}
			} catch (error) {
				this.$showTipMsg(INVITE_ERROR_MESSAGE, 'error');
				logFormatter(`Error running invite activity ${action}: ${error}`, 'error');
			} finally {
				this.pendingAction = null;
				this.restoreFocus(row.id, action);
			}
		},
		// The clicked button is disabled while its action runs and can leave with its row, either of which drops
		// focus to the page. Focus returns to the button, else to its row's other button, else to the table.
		async restoreFocus(id, action) {
			await this.$nextTick();
			const rowButtons = [...this.$el.querySelectorAll('[data-row-id]')].filter(el => el.dataset.rowId === id);
			const button = rowButtons.find(el => el.dataset.testid === `invite-activity-${action}`) ?? rowButtons[0];
			focusIfDropped(button ?? this.$refs.table ?? this.$el);
		},
		// Resolves to the activity collection, or rejects when the response is missing it
		async fetchPage(offset, limit) {
			const { data, errors } = await this.apollo.query({
				query: myInviteActivityQuery,
				variables: { offset, limit },
				fetchPolicy: 'network-only',
			});
			const activity = data?.my?.userAccount?.invites?.activity;
			if (errors?.length || !Array.isArray(activity?.values)) {
				throw new Error(JSON.stringify(errors ?? 'missing fields'));
			}
			return activity;
		},
		async fetchFirstPage() {
			this.loadCount += 1;
			const { loadCount } = this;
			this.loading = true;
			this.loadError = false;
			try {
				const activity = await this.fetchPage(0, INVITES_TABLE_INITIAL_SIZE);
				if (loadCount !== this.loadCount) {
					return;
				}
				this.rows = activity.values;
				this.totalCount = activity.totalCount;
			} catch (error) {
				if (loadCount !== this.loadCount) {
					return;
				}
				this.loadError = true;
				logFormatter(`Error fetching invite activity: ${error}`, 'error');
			} finally {
				if (loadCount === this.loadCount) {
					this.loading = false;
				}
			}
		},
		async toggleMore() {
			if (this.busy) {
				return;
			}
			// The label changes with the button, so track here rather than with the directive
			this.$kvTrackEvent('portfolio', 'click', `Invite activity ${this.hasMore ? 'more' : 'less'}`);
			if (!this.hasMore) {
				this.rows = this.rows.slice(0, INVITES_TABLE_INITIAL_SIZE);
				return;
			}
			this.loadingMore = true;
			const { loadCount } = this;
			try {
				const activity = await this.fetchPage(this.rows.length, INVITES_TABLE_PAGE_SIZE);
				// The page was read at an offset into rows a reload has since replaced
				if (loadCount !== this.loadCount) {
					return;
				}
				this.rows = [...this.rows, ...activity.values];
				this.totalCount = activity.totalCount;
			} catch (error) {
				// The rows already shown stay, and "More" can be clicked again
				logFormatter(`Error fetching more invite activity: ${error}`, 'error');
			} finally {
				this.loadingMore = false;
			}
		},
	},
	mounted() {
		this.fetchFirstPage();
	},
};
</script>
