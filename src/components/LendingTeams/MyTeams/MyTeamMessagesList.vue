<template>
	<div>
		<h3 class="tw-text-title tw-mb-2">
			Team Messages
		</h3>

		<template v-if="loading && messages.length === 0">
			<div
				v-for="n in 3"
				:key="n"
				class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-shadow-lg tw-h-min-12"
			>
				<div class="tw-flex tw-items-start tw-mb-1">
					<kv-loading-placeholder class="!tw-h-6 !tw-w-6 tw-flex-none tw-mr-1 !tw-rounded-full" />
					<div class="tw-flex-1">
						<kv-loading-placeholder class="!tw-h-2 !tw-w-1/2 tw-mb-1" />
						<kv-loading-placeholder class="!tw-h-1.5 !tw-w-1/3" />
					</div>
				</div>
				<kv-loading-placeholder class="!tw-h-2 !tw-w-4/5 tw-mb-1" />
				<kv-loading-placeholder class="!tw-h-2 !tw-w-9/10 tw-mb-1" />
				<kv-loading-placeholder class="!tw-h-2 !tw-w-3/5" />
			</div>
		</template>

		<div
			v-if="!loading && messages.length === 0"
			class="tw-text-center tw-py-4"
		>
			<h3 class="tw-text-title tw-mb-2 tw-text-secondary">
				No team messages yet.
			</h3>
			<p class="tw-text-secondary">
				Messages from your teams will appear here.
			</p>
		</div>

		<team-message-card
			v-for="message in messages"
			:key="message.id"
			:message="message"
		/>

		<div
			v-if="messages.length < totalCount"
			class="tw-mb-3 tw-text-center"
		>
			<kv-button
				variant="secondary"
				@click="loadMore"
				:state="loading ? 'loading' : ''"
				v-kv-track-event="['my-teams', 'click', 'load-more-messages']"
			>
				Show More Messages
			</kv-button>
		</div>
	</div>
</template>

<script>
import { KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import myTeamMessagesQuery from '#src/graphql/query/myTeamMessages.graphql';
import teamDefaultImage from '#src/assets/images/team_s135.png';
import TeamMessageCard from '#src/components/LendingTeams/MyTeams/TeamMessageCard';

export default {
	name: 'MyTeamMessagesList',
	components: {
		KvButton,
		KvLoadingPlaceholder,
		TeamMessageCard,
	},
	inject: ['apollo'],
	data() {
		return {
			messages: [],
			offset: 0,
			limit: 20,
			totalCount: 0,
			loading: true,
			teamDefaultImage,
		};
	},
	mounted() {
		this.fetchMessages();
	},
	methods: {
		fetchMessages() {
			this.loading = true;
			this.apollo.query({
				query: myTeamMessagesQuery,
				variables: {
					offset: this.offset,
					limit: this.limit,
				},
			}).then(({ data }) => {
				const messagesData = data?.my?.teamMessages;
				this.totalCount = messagesData?.totalCount ?? 0;
				const newMessages = (messagesData?.values ?? []).map(msg => ({
					id: msg.id,
					body: msg.body,
					date: msg.date,
					sender: {
						id: msg.sender.id,
						name: msg.sender.name,
						publicId: msg.sender.publicId,
						imageUrl: msg.sender.image?.url,
					},
					team: {
						id: msg.team.id,
						name: msg.team.name,
						teamPublicId: msg.team.teamPublicId,
						imageUrl: msg.team.image?.url ?? this.teamDefaultImage,
					},
				}));
				this.messages = [...this.messages, ...newMessages];
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		loadMore() {
			this.offset += this.limit;
			this.fetchMessages();
		},
	},
};
</script>
