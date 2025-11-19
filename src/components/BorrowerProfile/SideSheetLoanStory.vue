<template>
	<div v-if="!loading">
		<iframe
			v-if="youtubeId" class="tw-aspect-video tw-mx-auto tw-rounded tw-w-full tw--mb-1.5 md:tw--mb-1"
			width="560" height="315" :src="`https://www.youtube.com/embed/${youtubeId}?rel=0`"
			title="YouTube video player" frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
			allowfullscreen
		>
		</iframe>
		<div class="tw-prose">
			<section v-if="description">
				<!-- eslint-disable vue/no-v-html -->
				<p
					v-for="(paragraph, index) in storyDescriptionParagraphs" :key="`storyDescription-${index}`"
					v-html="paragraph"
				>
				</p>
				<!-- eslint-enable vue/no-v-html -->
			</section>

			<section v-if="borrowersList">
				<p>
					{{ borrowersList }}
				</p>
			</section>

			<PreviousLoanDescription
				v-if="previousLoanId" :loan-id="loanId"
				:previous-loan-id="previousLoanId" :borrower-or-group-name="name"
			/>

			<section v-if="storyTranslation">
				<p>
					<em>
						Translated from {{ language }}
						<span v-if="reviewerName">
							by
							<span v-if="!showReviewersName">a</span>
							<!-- eslint-disable max-len -->
							<a
								v-kv-track-event="['borrower-profile', 'click-Kiva review volunteer', 'Kiva volunteer', loanId]"
								class="tw-text-primary" href="/work-with-us/reviewers"
								title="Learn more about volunteering at Kiva" target="_blank"
							>
								Kiva volunteer<span v-if="!showReviewersName">.</span>
							</a>
							<span v-if="showReviewersName">
								&nbsp;{{ reviewerName }}.
							</span>
						</span>

						<a
							v-if="descriptionInOriginalLanguage !== ''"
							v-kv-track-event="['borrower-profile', 'click-Original language lightbox', 'View original language description', loanId]"
							class="tw-cursor-pointer tw-text-primary" @click="openLightbox"
						>
							<!-- eslint-enable max-len -->
							View original language description.
						</a>
					</em>
				</p>
			</section>
		</div>
		<KvLightbox :visible="isLightboxVisible" :title="lightboxTitle" @lightbox-closed="closeLightbox">
			<!-- eslint-disable vue/no-v-html -->
			<p
				v-for="(paragraph, index) in descriptionInOriginalLanguageParagraphs"
				:key="`originalLanguageParagraph-${index}`" class="tw-prose" v-html="paragraph"
			></p>
			<!-- eslint-enable vue/no-v-html -->
		</KvLightbox>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue';
import { toParagraphs } from '#src/util/loanUtils';
import { KvLightbox } from '@kiva/kv-components';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import PreviousLoanDescription from './PreviousLoanDescription';

const borrowerProfile = inject('borrowerProfile');

const {
	anonymizationLevel,
	borrowerCount,
	borrowers,
	description,
	descriptionInOriginalLanguage,
	loading,
	loanId,
	name,
	originalLanguage,
	partnerName,
	previousLoanId,
	reviewer,
	video,
} = borrowerProfile;

const isLightboxVisible = ref(false);

const storyDescriptionParagraphs = computed(() => {
	const story = description.value.replaceAll('<a', '<a target="_blank"');
	return toParagraphs(story);
});

const borrowersList = computed(() => {
	if (borrowerCount.value <= 1) {
		return '';
	}
	const names = borrowers.value?.map(b => b?.firstName ?? '');
	return `In this group: ${names?.join(', ')}.`;
});

const storyTranslation = computed(() => {
	const isPartnerLoan = partnerName.value !== '';
	return isPartnerLoan && (originalLanguage.value?.id ?? 0) !== 1;
});

const language = computed(() => originalLanguage.value?.name ?? '');

const reviewerName = computed(() => reviewer.value?.bylineName ?? '');

const showReviewersName = computed(() => reviewer.value?.showName ?? false);

const youtubeId = computed(() => video.value?.youtubeId ?? '');

const borrowerPossessiveName = computed(() => formatPossessiveName(name.value));

const lightboxTitle = computed(() => {
	return anonymizationLevel.value === 'full' ? 'Story' : `${borrowerPossessiveName.value} story`;
});

const descriptionInOriginalLanguageParagraphs = computed(() => toParagraphs(descriptionInOriginalLanguage.value));

const openLightbox = () => {
	isLightboxVisible.value = true;
};

const closeLightbox = () => {
	isLightboxVisible.value = false;
};
</script>
