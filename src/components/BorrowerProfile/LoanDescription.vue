<template>
	<section>
		<div class="tw-prose" data-testid="bp-story-header">
			<h2
				v-if="isAnonymizationLevelFull"
			>
				Story
			</h2>
			<h2 v-if="!isAnonymizationLevelFull">
				{{ borrowerOrGroupName }}'s story
			</h2>
		</div>
		<div v-if="fullStoryEnabled">
			<p class="tw-my-4 tw-truncate">
				{{ storyDescription.slice(0, 260) }}...
			</p>
			<kv-text-link @click="showFullStory = true">
				Read more about {{ borrowerOrGroupName }}
			</kv-text-link>
		</div>
		<div v-else class="tw-prose">
			<section v-if="storyDescription">
				<p
					v-for="(paragraph, index) in storyDescriptionParagraphs"
					:data-testid="`bp-story-description-${index}`"
					:key="`storyDescription-${index}`"
					v-html="paragraph"
				>
				</p>
			</section>

			<section v-if="borrowersList">
				<p data-testid="bp-story-borrower-list">
					{{ borrowersList }}
				</p>
			</section>

			<previous-loan-description
				v-if="previousLoanId"
				:loan-id="loanId"
				:previous-loan-id="previousLoanId"
				:borrower-or-group-name="borrowerOrGroupName"
			/>

			<section v-if="storyTranslation">
				<p>
					<em data-testid="bp-story-translate-info">
						Translated from {{ language }}
						<span v-if="reviewerName">
							by
							<span v-if="!showReviewersName">a</span>
							<!-- eslint-disable max-len -->
							<a
								data-testid="bp-story-translate-volunteer-link"
								href="/work-with-us/reviewers"
								title="Learn more about volunteering at Kiva"
								v-kv-track-event="['Borrower profile', 'click-Kiva review volunteer', 'Kiva volunteer', this.loanId]"
							>
								Kiva volunteer<span v-if="!showReviewersName">.</span>
							</a>
							<span
								data-testid="bp-story-translate-reviewer"
								v-if="showReviewersName"
							>
								{{ reviewerName }}.
							</span>
						</span>

						<a
							data-testid="bp-story-translate-view-original-language-link"
							@click="openLightbox"
							v-if="descriptionInOriginalLanguage !== '' "
							v-kv-track-event="['Borrower profile', 'click-Original language lightbox', 'View original language description', this.loanId]"
						>
							<!-- eslint-enable max-len -->
							View original language description.
						</a>
					</em>
				</p>
			</section>
		</div>
		<kv-lightbox
			data-testid="bp-lightbox-story-translate-original-language"
			:visible="isLightboxVisible"
			:title="lightboxTitle"
			@lightbox-closed="closeLightbox"
		>
			<p
				v-for="(paragraph, index) in descriptionInOriginalLanguageParagraphs"
				:key="`originalLanguageParagraph-${index}`"
				v-html="paragraph"
				class="tw-prose"
			>
			</p>
		</kv-lightbox>
	</section>
</template>

<script>
import { toParagraphs } from '@/util/loanUtils';
import previousLoanDescription from '@/components/BorrowerProfile/PreviousLoanDescription';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	name: 'LoanDescription',
	components: {
		KvLightbox,
		previousLoanDescription,
		KvTextLink
	},
	props: {
		partnerName: { // LoanPartner.partnerName
			type: String,
			default: '',
		},
		borrowerOrGroupName: { // LoanBasic.name
			type: String,
			default: '',
		},
		anonymizationLevel: { // LoanBasic.anonymizationLevel
			type: String,
			default: '',
		},
		storyDescription: { // LoanBasic.description
			type: String,
			default: '',
		},
		descriptionInOriginalLanguage: { // LoanBasic.descriptionInOriginalLanguage
			type: String,
			default: '',
		},
		originalLanguage: { // LoanBasic.originalLanguage with { id, name }
			type: Object,
			default: () => {},
		},
		borrowerCount: { // LoanBasic.borrowerCount
			type: Number,
			default: 0,
		},
		borrowers: { // LoanBasic.borrowers with { firstName }
			type: Array,
			default: () => [],
		},
		reviewer: { // LoanPartner.reviewer with { bylineName, showName }
			type: Object,
			default: () => {},
		},
		previousLoanId: { // LoanBasic.previousLoanId
			type: Number,
			default: 0,
		},
		loanId: {
			type: Number,
			default: 0,
		},
		userContextExpVariant: {
			type: String,
			default: 'c'
		}
	},
	data() {
		return {
			isLightboxVisible: false,
			showFullStory: false
		};
	},
	computed: {
		borrowersList() {
			if (this.borrowerCount <= 1) {
				return '';
			}
			const names = this.borrowers.map(({ firstName }) => firstName);
			return `In this group: ${names.join(', ')}`;
		},
		storyDescriptionParagraphs() {
			return toParagraphs(this.storyDescription);
		},
		descriptionInOriginalLanguageParagraphs() {
			return toParagraphs(this.descriptionInOriginalLanguage);
		},
		isAnonymizationLevelFull() {
			return this.anonymizationLevel === 'full';
		},
		storyTranslation() {
			return this.isPartnerLoan && parseInt(this.originalLanguage?.id ?? 0, 10) !== 1;
		},
		language() {
			return this.originalLanguage?.name ?? '';
		},
		isPartnerLoan() {
			return this.partnerName !== '';
		},
		reviewerName() {
			return this.reviewer?.bylineName ?? '';
		},
		lightboxTitle() {
			return this.isAnonymizationLevelFull ? 'Story' : `${this.borrowerOrGroupName}'s story`;
		},
		showReviewersName() {
			return this.reviewer?.showName;
		},
		fullStoryEnabled() {
			return this.userContextExpVariant === 'a' && !this.showFullStory;
		}
	},
	methods: {
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
	}
};

</script>
