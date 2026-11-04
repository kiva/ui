<template>
	<div :aria-busy="loading">
		<template v-if="loading">
			<span class="tw-sr-only" role="status">Loading accepted invites</span>
			<KvLoadingText :lines="4" data-testid="accepted-invites-loading" />
		</template>
		<div v-else-if="loadError" role="alert" data-testid="accepted-invites-error">
			<p>An error occurred. Please try again.</p>
			<KvButton
				class="tw-mt-2"
				@click="fetchFirstPage"
				v-kv-track-event="['portfolio', 'click', 'Accepted invites retry load']"
			>
				Try again
			</KvButton>
		</div>
		<p v-else-if="!rows.length" data-testid="accepted-invites-empty">
			You don't have any accepted invites
		</p>
		<template v-else>
			<div class="tw-overflow-x-auto">
				<table
					class="tw-w-full tw-text-left tw-text-small md:tw-text-base"
					aria-label="Accepted invites"
					data-testid="accepted-invites-table"
				>
					<thead>
						<tr class="tw-bg-gray-200">
							<th class="tw-p-1 tw-w-1/4">
								Date
							</th>
							<th class="tw-p-1 tw-w-1/2">
								User
							</th>
							<th class="tw-p-1 tw-w-1/4">
								No. of loans made
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, i) in rows"
							:key="row.id"
							class="tw-bg-primary"
							:class="{ '!tw-bg-gray-50': i % 2 === 1 }"
							data-testid="accepted-invites-row"
						>
							<td class="tw-p-1 tw-align-top tw-whitespace-nowrap">
								{{ formatDate(row.date) }}
							</td>
							<td class="tw-p-1 tw-align-top tw-break-words">
								<a
									v-if="row.invitee"
									:href="`/lender/${row.invitee.publicId}`"
									v-kv-track-event="['portfolio', 'click', 'Accepted invites invitee profile']"
								>{{ row.invitee.name }}</a>
								<template v-else>
									Anonymous
								</template>
								<span v-if="viaLabel(row)" class="tw-block">{{ viaLabel(row) }}</span>
							</td>
							<td class="tw-p-1 tw-align-top">
								<template v-if="row.invitee">
									{{ row.loanCount ?? 0 }}
								</template>
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
				data-testid="accepted-invites-toggle"
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
import myAcceptedInvitesQuery from '#src/graphql/query/portfolio/myAcceptedInvites.graphql';

export default {
	name: 'AcceptedInvitesTable',
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
		// Resolves to the accepted collection, or rejects when the response is missing it
		async fetchPage(offset, limit) {
			const { data, errors } = await this.apollo.query({
				query: myAcceptedInvitesQuery,
				variables: { offset, limit },
				fetchPolicy: 'network-only',
			});
			const accepted = data?.my?.userAccount?.invites?.accepted;
			if (errors?.length || !Array.isArray(accepted?.values)) {
				throw new Error(JSON.stringify(errors ?? 'missing fields'));
			}
			return accepted;
		},
		async fetchFirstPage() {
			this.loading = true;
			this.loadError = false;
			try {
				const accepted = await this.fetchPage(0, INVITES_TABLE_INITIAL_SIZE);
				this.rows = accepted.values;
				this.totalCount = accepted.totalCount;
			} catch (error) {
				this.loadError = true;
				logFormatter(`Error fetching accepted invites: ${error}`, 'error');
			} finally {
				this.loading = false;
			}
		},
		async toggleMore() {
			// The label changes with the button, so track here rather than with the directive
			this.$kvTrackEvent('portfolio', 'click', `Accepted invites ${this.hasMore ? 'more' : 'less'}`);
			if (!this.hasMore) {
				this.rows = this.rows.slice(0, INVITES_TABLE_INITIAL_SIZE);
				return;
			}
			this.loadingMore = true;
			try {
				const accepted = await this.fetchPage(this.rows.length, INVITES_TABLE_PAGE_SIZE);
				this.rows = [...this.rows, ...accepted.values];
				this.totalCount = accepted.totalCount;
			} catch (error) {
				// The rows already shown stay, and "More" can be clicked again
				logFormatter(`Error fetching more accepted invites: ${error}`, 'error');
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
