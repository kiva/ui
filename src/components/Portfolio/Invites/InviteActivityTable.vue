<template>
	<div :aria-busy="loading">
		<template v-if="loading">
			<span class="tw-sr-only" role="status">Loading invite activity</span>
			<KvLoadingText :lines="4" data-testid="invite-activity-loading" />
		</template>
		<div v-else-if="loadError" role="alert" data-testid="invite-activity-error">
			<p>An error occurred. Please try again.</p>
			<KvButton
				class="tw-mt-2"
				@click="fetchFirstPage"
				v-kv-track-event="['portfolio', 'click', 'Invite activity retry load']"
			>
				Try again
			</KvButton>
		</div>
		<p v-else-if="!rows.length" data-testid="invite-activity-empty">
			You don't have any invites on record.
		</p>
		<template v-else>
			<div class="tw-overflow-x-auto">
				<table
					class="tw-w-full tw-text-left tw-text-small md:tw-text-base"
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
									Anonymous
								</template>
								<template v-else-if="row.toEmailAddress">
									{{ row.toEmailAddress }}
								</template>
							</td>
							<td class="tw-p-1 tw-align-top" data-testid="invite-activity-status">
								<template v-if="row.clickCount != null || row.acceptedCount != null">
									<span class="tw-block">{{ row.clickCount ?? 0 }} clicks</span>
									<span class="tw-block">{{ row.acceptedCount ?? 0 }} accepted</span>
								</template>
								<template v-else-if="row.status === 'ACCEPTED'">
									Accepted!
								</template>
								<template v-else-if="row.status === 'JOINED_TEAM'">
									Joined Team!
								</template>
								<template v-else-if="row.status === 'PENDING'">
									Pending
								</template>
								<div v-else-if="row.status === 'SENT'" class="tw-flex tw-flex-wrap tw-gap-1">
									<!-- Placeholder: Remind and Clear need the invite mutations -->
									<KvButton
										v-if="canRemind(row)"
										variant="secondary"
										state="disabled"
										data-testid="invite-activity-remind"
									>
										Remind
									</KvButton>
									<span v-else class="tw-block">Sent {{ formatDate(row.date) }}</span>
									<KvButton
										variant="secondary"
										state="disabled"
										data-testid="invite-activity-clear"
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
				v-if="totalCount > initialSize"
				class="tw-mt-2"
				variant="secondary"
				:state="loadingMore ? 'loading' : ''"
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
import {
	INVITE_LABELS,
	INVITES_TABLE_INITIAL_SIZE,
	INVITES_TABLE_PAGE_SIZE,
} from '#src/util/invites/invitesConstants';
import myInviteActivityQuery from '#src/graphql/query/portfolio/myInviteActivity.graphql';

export default {
	name: 'InviteActivityTable',
	components: {
		KvButton,
		KvLoadingText,
	},
	inject: ['apollo'],
	data() {
		return {
			loading: true,
			loadError: false,
			loadingMore: false,
			rows: [],
			totalCount: 0,
			initialSize: INVITES_TABLE_INITIAL_SIZE,
		};
	},
	computed: {
		hasMore() {
			return this.rows.length < this.totalCount;
		},
	},
	methods: {
		formatDate(date) {
			const parsed = new Date(date);
			if (Number.isNaN(parsed.getTime())) {
				return '';
			}
			return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		},
		viaLabel(row) {
			const labels = [INVITE_LABELS[row.source], INVITE_LABELS[row.createdAsType]].filter(Boolean);
			if (!labels.length) {
				return '';
			}
			const team = row.team?.name ? ` (${row.team.name})` : '';
			return `via ${labels.join(', ')}${team}`;
		},
		isAccepted(row) {
			return row.status === 'ACCEPTED' || row.status === 'JOINED_TEAM';
		},
		canRemind(row) {
			const availableAt = new Date(row.remindAvailableAt).getTime();
			return !Number.isNaN(availableAt) && Date.now() > availableAt;
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
			this.loading = true;
			this.loadError = false;
			try {
				const activity = await this.fetchPage(0, INVITES_TABLE_INITIAL_SIZE);
				this.rows = activity.values;
				this.totalCount = activity.totalCount;
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching invite activity: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		async toggleMore() {
			// The label changes with the button, so track here rather than with the directive
			this.$kvTrackEvent('portfolio', 'click', `Invite activity ${this.hasMore ? 'more' : 'less'}`);
			if (!this.hasMore) {
				this.rows = this.rows.slice(0, INVITES_TABLE_INITIAL_SIZE);
				return;
			}
			this.loadingMore = true;
			try {
				const activity = await this.fetchPage(this.rows.length, INVITES_TABLE_PAGE_SIZE);
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
