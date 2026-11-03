<template>
	<www-page main-class="tw-bg-secondary">
		<kv-page-container class="tw-pt-3 tw-pb-5 md:tw-pt-4 md:tw-pb-8">
			<router-link
				v-if="isLoggedIn"
				:to="BORROWER_MESSAGES_LIST_PATH"
				class="tw-inline-flex tw-gap-0.5 tw-items-center tw-mb-2"
				v-kv-track-event="['portfolio', 'click', 'Borrower message back to list']"
			>
				<kv-material-icon :icon="mdiChevronLeft" />
				Back to message list
			</router-link>
			<template v-if="message">
				<div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3 md:tw-mb-4">
					<h1 class="tw-text-headline tw-break-words">
						{{ subject }}
					</h1>
					<p v-if="headerByline" class="tw-text-gray-600">
						{{ headerByline }}
					</p>
				</div>
				<kv-grid class="tw-grid-cols-12">
					<div v-if="photo" class="tw-col-span-12 md:tw-col-span-4 lg:tw-col-span-3">
						<img
							class="borrower-message__photo tw-w-full tw-object-cover tw-rounded-md"
							:src="photo.default"
							:alt="photo.alt"
						>
					</div>
					<div
						class="tw-col-span-12 tw-flex tw-flex-col tw-gap-2 md:tw-gap-3"
						:class="photo ? 'md:tw-col-span-8 lg:tw-col-span-7' : 'lg:tw-col-span-10'"
					>
						<div
							class="borrower-message__body tw-text-gray-600 tw-break-words"
							data-testid="borrower-message-body"
							v-html="body"
						></div>
						<div class="tw-flex tw-flex-col tw-gap-1">
							<p v-if="partnerName" class="tw-text-label">
								{{ partnerName }}
							</p>
							<p class="tw-text-caption tw-text-secondary">
								{{ signature }}
							</p>
						</div>
						<div
							v-if="showTranslationNotice"
							class="tw-flex tw-flex-col tw-gap-1 tw-pt-2 tw-border-t tw-border-tertiary"
							data-testid="borrower-message-translation"
						>
							<p class="tw-text-small tw-text-secondary tw-italic">
								{{ translationNotice }}
							</p>
							<p class="tw-text-label tw-break-words" :dir="originalTextDirection">
								{{ originalSubject }}
							</p>
							<div
								class="borrower-message__body tw-text-gray-600 tw-break-words"
								:dir="originalTextDirection"
								v-html="originalBody"
							></div>
						</div>
					</div>
				</kv-grid>
				<kv-text-link
					v-if="showCommentLink"
					class="tw-mt-3 md:tw-mt-4"
					:to="`/lend/${loan.id}#loanComments`"
					:icon="mdiChevronRight"
					v-kv-track-event="['portfolio', 'click', 'Borrower message post a comment', message.id]"
				>
					Post a comment on the loan page
				</kv-text-link>
			</template>
			<div v-else class="tw-flex tw-flex-col tw-gap-3" data-testid="borrower-message-loading">
				<div class="tw-text-headline tw-w-1/2">
					<kv-loading-placeholder class="!tw-inline-block !tw-h-[1em] tw-align-middle" />
				</div>
				<kv-loading-text :lines="4" />
			</div>
		</kv-page-container>
	</www-page>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import {
	KvGrid,
	KvLoadingPlaceholder,
	KvLoadingText,
	KvMaterialIcon,
	KvPageContainer,
	KvTextLink,
} from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import useBorrowerMessage, { BORROWER_MESSAGES_LIST_PATH } from '#src/composables/useBorrowerMessage';
import {
	getBorrowerMessageAuthor,
	getBorrowerMessageSubject,
	getBorrowerMessageTitle,
} from '#src/util/borrowerMessage';
import { htmlToText, sanitizeLimitedHtml } from '#src/util/limitedHtml';
import { formatInKivaServerTimezone } from '#src/util/dateUtils';

defineOptions({ name: 'BorrowerMessagePage' });

const RTL_LANGUAGES = ['Arabic', 'Hebrew'];
const SHARE_DESCRIPTION_WORDS = 60;

const $appConfig = inject('$appConfig', {});
const route = useRoute();
const { message, isLoggedIn } = useBorrowerMessage();

const loan = computed(() => message.value?.loan ?? {});

const subject = computed(() => getBorrowerMessageSubject(message.value));

const body = computed(() => sanitizeLimitedHtml(message.value?.bodyTranslated || message.value?.body));

const author = computed(() => getBorrowerMessageAuthor(message.value));

const date = computed(() => formatInKivaServerTimezone(message.value?.date, {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
}));

const headerByline = computed(() => {
	if (author.value && date.value) {
		return `Posted by ${author.value} on ${date.value}`;
	}
	return author.value ? `Posted by ${author.value}` : date.value;
});

const partnerName = computed(() => loan.value.partner?.name ?? '');

const location = computed(() => {
	const { city, country } = loan.value.geocode ?? {};
	if (!city && !country?.name) {
		return 'San Francisco, United States';
	}
	return [city, country?.name].filter(Boolean).join(', ');
});

const signature = computed(() => {
	const postedBy = author.value ? `Posted by ${author.value} from ${location.value}` : `From ${location.value}`;
	return [postedBy, date.value].filter(Boolean).join(' · ');
});

const photo = computed(() => {
	const { name } = loan.value;
	if (message.value?.image?.default) {
		return { ...message.value.image, alt: name ? `Photo from ${name}'s message` : 'Photo from this message' };
	}
	if (loan.value.image?.default) {
		return { ...loan.value.image, alt: name ? `Photo of ${name}` : 'Borrower photo' };
	}
	return null;
});

const originalLanguage = computed(() => message.value?.originalLanguage ?? '');

const showTranslationNotice = computed(() => !!message.value?.bodyTranslated
	&& !!originalLanguage.value
	&& originalLanguage.value !== 'English');

const translationNotice = computed(() => {
	const partner = partnerName.value ? ` by Kiva field partner ${partnerName.value}` : '';
	return `This update was written in ${originalLanguage.value}${partner}. `
		+ 'We machine-translated it into English for your convenience. The original text is below.';
});

const originalTextDirection = computed(() => (RTL_LANGUAGES.includes(originalLanguage.value) ? 'rtl' : undefined));

const originalSubject = computed(() => htmlToText(message.value?.subject));

const originalBody = computed(() => sanitizeLimitedHtml(message.value?.body));

const showCommentLink = computed(() => !!loan.value.id && !!loan.value.userProperties?.lentTo);

const pageTitle = computed(() => getBorrowerMessageTitle(message.value));

const shareDescription = computed(() => {
	const words = htmlToText(body.value).split(' ').filter(Boolean);
	const teaser = words.slice(0, SHARE_DESCRIPTION_WORDS).join(' ');
	return words.length > SHARE_DESCRIPTION_WORDS ? `${teaser}…` : teaser;
});

const shareImage = computed(() => {
	if (loan.value.anonymizationLevel !== 'none') {
		return undefined;
	}
	return message.value?.image?.share || loan.value.image?.share || undefined;
});

useHead(computed(() => (message.value ? {
	title: pageTitle.value,
	meta: [
		{ property: 'og:title', content: pageTitle.value },
		{ property: 'og:description', content: shareDescription.value },
		{ name: 'description', content: shareDescription.value },
		{ property: 'og:url', content: `https://${$appConfig.host}${route.path}` },
		...(shareImage.value ? [{ property: 'og:image', content: shareImage.value }] : []),
	],
} : { title: 'Borrower Message' })));
</script>

<style lang="postcss" scoped>
.borrower-message__body :deep(:is(p, ul, ol, blockquote):not(:last-child)) {
	@apply tw-mb-2;
}

.borrower-message__body :deep(ul) {
	@apply tw-list-disc tw-pl-3;
}

.borrower-message__body :deep(ol) {
	@apply tw-list-decimal tw-pl-3;
}

.borrower-message__body :deep(li:not(:last-child)) {
	@apply tw-mb-0.5;
}

.borrower-message__body :deep(blockquote) {
	@apply tw-pl-2 tw-border-l-4 tw-border-tertiary;
}

.borrower-message__photo {
	height: 17.5rem;
}

@screen md {
	.borrower-message__photo {
		height: auto;
		aspect-ratio: 264 / 320;
	}
}
</style>
