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
			<p v-html="body"></p>
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
	computed: {
		formattedJournalDate() {
			return format(parseISO(this.date), 'MMMM dd, yyyy');
		}
	},
};
</script>
