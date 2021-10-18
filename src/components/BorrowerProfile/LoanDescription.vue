<template>
	<section class="tw-prose">
		<div>
			<h2 v-if="isAnonymizationLevelFull">
				Story
			</h2>
			<h2 v-if="!isAnonymizationLevelFull">
				{{ borrowerOrGroupName }}'s story
			</h2>
		</div>
		<div>
			<section v-if="storyDescription">
				<p
					v-for="(paragraph, index) in storyDescriptionParagraphs"
					:key="`storyDescription-${index}`"
					v-html="paragraph"
				>
				</p>
			</section>

			<section v-if="borrowersList">
				<p>
					{{ borrowersList }}
				</p>
			</section>

			<previous-loan-description
				v-if="previousLoanId"
				:loan-id="loanId"
				:previous-loan-id="previousLoanId"
			/>

			<section v-if="storyTranslation">
				<i>
					<p>
						Translated from {{ language }}
						<span v-if="reviewerName">
							by
							<span v-if="!showReviewersName">a</span>
							<!-- eslint-disable max-len -->
							<a
								href="/work-with-us/internvolunteers"
								title="Learn more about volunteering at Kiva"
								v-kv-track-event="['Borrower profile', 'click-Kiva review volunteer', 'Kiva volunteer', this.loanId]"
							>
								Kiva volunteer
							</a>
							<span v-if="showReviewersName">
								{{ reviewerName }}
							</span>.
						</span>

						<a
							@click="openLightbox"
							v-if="descriptionInOriginalLanguage !== '' "
							v-kv-track-event="['Borrower profile', 'click-Original language lightbox', 'View original language description', this.loanId]"
						>
							<!-- eslint-enable max-len -->
							View original language description.
						</a>

						<kv-lightbox
							:visible="isLightboxVisible"
							:title="lightboxTitle"
							@lightbox-closed="closeLightbox"
						>
							<div>
								<p
									v-for="(paragraph, index) in descriptionInOriginalLanguageParagraphs"
									:key="`originalLanguageParagraph-${index}`"
									v-html="paragraph"
								>
								</p>
							</div>
						</kv-lightbox>
					</p>
				</i>
			</section>
		</div>
	</section>
</template>

<script>
import { toParagraphs } from '@/util/loanUtils';
import previousLoanDescription from '@/components/BorrowerProfile/PreviousLoanDescription';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	components: {
		KvLightbox,
		previousLoanDescription,
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
			type: String,
			default: '',
		},
		loanId: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			isLightboxVisible: false,
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
