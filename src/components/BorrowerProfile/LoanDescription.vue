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
				<img
					loading="lazy"
					v-if="reviewerImageLink"
					:src="reviewerImageLink"
					:alt="reviewerName"
				>
				<p>
					Translated from {{ language }}
					<span v-if="reviewerName">
						by
						<a
							href="/work-with-us/internvolunteers"
							title="Learn more about volunteering at Kiva"
						>
							Kiva volunteer
						</a> {{ reviewerName }}
					</span>.
					<a>
						View original language description.
					</a>
				</p>
				<div>
					<p
						v-for="(paragraph, index) in descriptionInOriginalLanguageParagraphs"
						:key="`originalLanguageParagraph-${index}`"
						v-html="paragraph"
					>
					</p>
				</div>
			</section>
		</div>
	</section>
</template>

<script>
import previousLoanDescription from '@/components/BorrowerProfile/PreviousLoanDescription';

export default {
	components: {
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
		reviewer: { // LoanPartner.reviewer with { bylineName, image: { url } }
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
		}
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
			return this.toParagraphs(this.storyDescription);
		},
		descriptionInOriginalLanguageParagraphs() {
			return this.toParagraphs(this.descriptionInOriginalLanguage);
		},
		isAnonymizationLevelFull() {
			return this.anonymizationLevel === 'full';
		},
		storyTranslation() {
			// TODO: Temporarily removing for MVP
			return false;
			// return this.isPartnerLoan && parseInt(this.originalLanguage?.id ?? 0, 10) !== 1;
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
		reviewerImageLink() {
			return this.reviewer?.image?.url ?? '';
		},
	},
	methods: {
		toParagraphs(text) {
			return String(text).replace(/\r|\n|<br\s*\/?>/g, '\n').split(/\n+/);
		}
	}
};

</script>
