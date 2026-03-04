<template>
	<div
		class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
	>
		<div class="tw-flex tw-items-start tw-mb-1">
			<img
				v-if="message.sender.imageUrl"
				:src="message.sender.imageUrl"
				:alt="`${message.sender.name} avatar`"
				class="tw-w-6 tw-h-6 tw-mr-1 tw-rounded-full tw-flex-none"
				width="48"
				height="48"
			>

			<div class="tw-flex-1 tw-min-w-0">
				<div class="tw-flex tw-items-center tw-flex-wrap tw-gap-x-1">
					<router-link
						:to="`/lender/${message.sender.publicId}`"
						class="tw-font-medium"
						v-kv-track-event="['my-teams', 'click', 'message-sender', message.sender.publicId]"
					>
						{{ message.sender.name }}
					</router-link>
					<span class="tw-text-small tw-text-secondary">&middot;</span>
					<span class="tw-text-small tw-text-secondary">{{ formatDate(message.date) }}</span>
				</div>

				<div class="tw-flex tw-items-center tw-mt-0.5">
					<img
						v-if="message.team.imageUrl"
						:src="message.team.imageUrl"
						:alt="`${message.team.name} logo`"
						class="tw-w-3 tw-h-3 tw-mr-0.5 tw-rounded-xs"
						width="24"
						height="24"
					>
					<router-link
						:to="`/team/${message.team.teamPublicId}`"
						class="tw-text-small"
						v-kv-track-event="['my-teams', 'click', 'message-team-name', message.team.teamPublicId]"
					>
						{{ message.team.name }}
					</router-link>
				</div>
			</div>

			<a
				:href="getDirectMessageUrl(message.team.teamPublicId, message.id)"
				class="tw-text-small tw-text-secondary hover:tw-text-action-highlight tw-ml-1 tw-flex-none"
				v-kv-track-event="['my-teams', 'click', 'message-deep-link', message.id]"
			>
				#{{ message.id }}
			</a>
		</div>

		<div>
			<p v-html="formatMessageBody(message.body, message.team.teamPublicId)">
			</p>
		</div>
	</div>
</template>

<script>
import _escape from 'lodash/escape';
import { formatDistanceToNow } from 'date-fns';

export default {
	name: 'TeamMessageCard',
	props: {
		message: {
			type: Object,
			required: true,
		},
	},
	methods: {
		getDirectMessageUrl(teamPublicId, messageId) {
			return `/team/${teamPublicId}/messages?msgID=${messageId}#msg_${messageId}`;
		},
		formatMessageBody(body, teamPublicId) {
			const escaped = _escape(body);

			// Replace embedded plain text message IDs (e.g. #123456) with direct links
			// Use negative lookbehind / lookahead to exclude HTML entities that may have been escaped (e.g., &#39;)
			return escaped.replace(/(?<!&)#(\d+)(?!;)/g, (match, msgId) => {
				const url = this.getDirectMessageUrl(teamPublicId, msgId);
				return `<a href="${url}" class="tw-text-link hover:tw-underline">${match}</a>`;
			});
		},
		formatDate(dateString) {
			return formatDistanceToNow(new Date(dateString), { addSuffix: true });
		},
	},
};
</script>
