<template>
	<router-link
		:to="`/portfolio/borrower-messages/${message.id}`"
		class="borrower-message-row tw-grid tw-gap-x-1 tw-gap-y-1 tw-items-center tw-px-2.5 tw-py-2.5
			md:tw-gap-x-4 md:tw-items-start md:tw-px-3 md:tw-py-3 tw-text-primary hover:tw-text-primary
			tw-no-underline hover:tw-no-underline"
		v-kv-track-event="['portfolio', 'click', 'Borrower messages row', message.id]"
	>
		<div
			class="borrower-message-row__thumbnail tw-w-8 tw-h-8 md:tw-w-15 md:tw-h-15 tw-rounded-md tw-overflow-hidden"
		>
			<img
				v-if="thumbnail"
				class="tw-w-full tw-h-full tw-object-cover"
				:src="thumbnail.default"
				:srcset="thumbnail.retina ? `${thumbnail.retina} 2x` : undefined"
				alt=""
				loading="lazy"
			>
			<div
				v-else
				class="tw-w-full tw-h-full tw-bg-brand tw-flex tw-items-center tw-justify-center"
				data-testid="borrower-message-placeholder"
			>
				<img :src="kivaKUrl" alt="">
			</div>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-0.5 md:tw-gap-1 tw-min-w-0">
			<h2 class="borrower-message-row__subject tw-text-title tw-text-action tw-break-words">
				{{ subject }}
			</h2>
			<p class="tw-text-small tw-text-secondary">
				{{ borrower }}
			</p>
		</div>
		<p class="borrower-message-row__body tw-text-gray-600 tw-line-clamp-3 tw-break-words">
			{{ body }}
		</p>
		<p class="borrower-message-row__meta tw-text-small tw-text-secondary md:tw-text-right">
			{{ signature }}
		</p>
	</router-link>
</template>

<script setup>
import { computed } from 'vue';
import htmlToText from '#src/util/htmlToText';
import { formatInKivaServerTimezone } from '#src/util/dateUtils';
import kivaKUrl from '#src/assets/images/kiva_k.svg?url';

defineOptions({ name: 'BorrowerMessageRow' });

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},
});

const loan = computed(() => props.message.loan ?? {});

const thumbnail = computed(() => {
	const image = props.message.image?.default ? props.message.image : loan.value.image;
	return image?.default ? image : null;
});

const subject = computed(() => htmlToText(props.message.subjectTranslated || props.message.subject));

const borrower = computed(() => [loan.value.name, loan.value.geocode?.country?.name].filter(Boolean).join(' · '));

const body = computed(() => htmlToText(props.message.bodyTranslated || props.message.body));

const signature = computed(() => {
	const author = props.message.authorName || loan.value.partner?.name;
	const date = formatInKivaServerTimezone(props.message.date, { month: 'long', day: 'numeric', year: 'numeric' });
	return [author && `Posted by ${author}`, date].filter(Boolean).join(' · ');
});
</script>

<style lang="postcss" scoped>
.borrower-message-row {
	grid-template-columns: auto minmax(0, 1fr);
}

.borrower-message-row__body,
.borrower-message-row__meta {
	grid-column: 1 / -1;
}

.borrower-message-row:hover .borrower-message-row__subject {
	@apply tw-underline;
}

@screen md {
	.borrower-message-row {
		grid-template-rows: auto auto auto 1fr;
	}

	.borrower-message-row__thumbnail {
		grid-row: 1 / -1;
	}

	.borrower-message-row__body,
	.borrower-message-row__meta {
		grid-column: 2;
	}
}
</style>
