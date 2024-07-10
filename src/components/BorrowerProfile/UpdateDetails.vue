<template>
	<div class="tw-rounded tw-bg-primary tw-p-3 tw-mb-3">
		<img
			v-if="imageUrl"
			class="tw-rounded tw-mb-2"
			:src="imageUrl"
			:alt="'photo of borrower'"
		>
		<div class="tw-prose tw-pb-2">
			<p v-html="subject"></p>
			<p v-if="truncateBody && !readMoreClicked">
				<span v-html="shortBody"></span>
				<button
					class="tw-text-link"
					@click="readMoreClicked = true"
					v-show="truncateBody && !readMoreClicked"
					v-kv-track-event="['borrower-profile', 'click', 'update-read-more']"
				>
					read more
				</button>
			</p>
			<p v-else v-html="htmlSafeBody"></p>
		</div>

		<div>
			<div class="tw-flex tw-justify-between tw-align-center tw-flex-wrap">
				<div class="tw-flex tw-items-center">
					<kv-social-share-button
						modal-title="Share this loan update"
						:share-message="shareMessage"
						:share-url="$route.path + '#updates'"
						variant="link"
						utm-campaign="social_share_update"
					>
						Share this update
					</kv-social-share-button>
				</div>
				<div class="tw-flex tw-items-center tw-mt-2 md:tw-mt-0">
					<span class="tw-text-secondary">Update #{{ index }}</span>
					<span class="tw-text-secondary tw-px-1.5">&#x2022;</span>
					<span class="tw-text-secondary">{{ formattedJournalDate }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';

import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';

export default {
	name: 'UpdateDetails',
	components: {
		KvSocialShareButton,
	},
	props: {
		body: {
			type: String,
			default: '',
		},
		date: {
			type: String,
			default: '',
		},
		subject: {
			type: String,
			default: '',
		},
		index: {
			type: Number,
			default: 1,
		},
		imageUrl: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			readMoreClicked: false,
		};
	},
	computed: {
		formattedJournalDate() {
			return format(parseISO(this.date), 'MMMM dd, yyyy');
		},
		truncateBody() {
			const bodyLength = this.htmlSafeBody?.length ?? 0;
			return bodyLength > 205;
		},
		shortBody() {
			return `${this.htmlSafeBody?.substring(0, 205)}... `;
		},
		htmlSafeBody() {
			// eslint-disable-next-line max-len
			return DOMPurify.sanitize(this.body, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'h4'] });
		},
		shareMessage() {
			let shareMsgString = '';
			if (this.subject) {
				shareMsgString += `${this.subject} - `;
			}
			shareMsgString += this.shortBody;
			// remove all html for sharing
			return DOMPurify.sanitize(shareMsgString, { ALLOWED_TAGS: [] });
		}
	},
};
</script>
