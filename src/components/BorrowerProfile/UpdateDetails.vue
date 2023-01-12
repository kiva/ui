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
					class="tw-text-link tw-mt-1"
					@click="readMoreClicked = true"
					v-show="truncateBody && !readMoreClicked"
					v-kv-track-event="['borrower-profile', 'click', 'more-about-loan', 'read-more']"
				>
					read more
				</button>
			</p>
			<p v-else v-html="htmlSafeBody"></p>
		</div>

		<div>
			<div class="tw-flex tw-justify-between tw-align-baseline">
				<div>
					<!-- TODO Share component goes here -->
					<!-- <span class="tw-text-small tw-text-secondary">Share this Update</span> -->
				</div>
				<div>
					<!-- eslint-disable-next-line max-len -->
					<span class="tw-text-small tw-text-secondary">Update #{{ index }}</span>
					<span class="tw-text-small tw-text-secondary tw-px-1.5">&#x2022;</span>
					<span class="tw-text-small tw-text-secondary">{{ formattedJournalDate }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';

export default {
	name: 'UpdateDetails',
	components: {
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
			readMoreClicked: false
		};
	},
	computed: {
		formattedJournalDate() {
			return format(parseISO(this.date), 'MMMM dd, yyyy');
		},
		truncateBody() {
			const bodyLength = this.htmlSafeBody?.length ?? 0;
			return bodyLength > 210;
		},
		shortBody() {
			return `${this.htmlSafeBody?.substring(0, 210)}... `;
		},
		htmlSafeBody() {
			// eslint-disable-next-line max-len
			return DOMPurify.sanitize(this.body, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'h4'] });
		}
	},
};
</script>
