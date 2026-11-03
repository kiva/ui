<template>
	<article
		class="borrower-message-row tw-grid tw-gap-x-1 tw-gap-y-1 tw-items-center tw-px-2.5 tw-py-2.5
			md:tw-gap-x-4 md:tw-items-start md:tw-px-3 md:tw-py-3 tw-cursor-pointer"
		@click="openMessage"
	>
		<div
			class="borrower-message-row__thumbnail tw-w-8 tw-h-8 md:tw-w-15 md:tw-h-15 tw-rounded-md tw-overflow-hidden"
		>
			<img
				v-if="thumbnail"
				class="tw-w-full tw-h-full tw-object-cover"
				:src="thumbnail.default"
				:srcset="thumbnail.retina ? `${thumbnail.retina} 2x` : undefined"
				:alt="thumbnail.alt"
				loading="lazy"
			>
			<div
				v-else
				class="tw-w-full tw-h-full tw-bg-brand tw-flex tw-items-center tw-justify-center"
				data-testid="borrower-message-placeholder"
			>
				<img :src="kivaKUrl" alt="Kiva logo">
			</div>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-0.5 md:tw-gap-1 tw-min-w-0">
			<h2 ref="subjectHeading" class="tw-text-title tw-break-words">
				<router-link
					:to="`/portfolio/borrower-messages/${message.id}`"
					class="borrower-message-row__subject tw-text-action hover:tw-text-action tw-no-underline"
					v-kv-track-event="['portfolio', 'click', 'Borrower messages row', message.id]"
				>
					{{ subject }}
				</router-link>
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
	</article>
</template>

<script setup>
import { computed, ref } from 'vue';
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

const subjectHeading = ref(null);

const openMessage = event => {
	const selection = window.getSelection();
	if (event.target.closest('a') || (selection && !selection.isCollapsed)) {
		return;
	}
	subjectHeading.value?.querySelector('a')?.click();
};

const loan = computed(() => props.message.loan ?? {});

const thumbnail = computed(() => {
	const { name } = loan.value;
	if (props.message.image?.default) {
		return { ...props.message.image, alt: name ? `Photo from ${name}'s message` : 'Photo from this message' };
	}
	if (loan.value.image?.default) {
		return { ...loan.value.image, alt: name ? `Photo of ${name}` : 'Borrower photo' };
	}
	return null;
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
