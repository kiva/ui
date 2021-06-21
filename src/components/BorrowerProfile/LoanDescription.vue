<template>
	<section>
		<div>
			<h2
				class="tw-text-h2"
				v-if="isAnonymizationLevelFull"
			>
				Story
			</h2>
			<h2
				class="tw-text-h2"
				v-if="!isAnonymizationLevelFull"
			>
				{{ borrowerOrGroupName }}'s story
			</h2>
		</div>
		<div>
			<section v-if="storyDescription">
				<p
					v-for="(paragraph, index) in storyDescriptionParagraphs"
					:key="`storyDescription-${index}`"
					class="tw-text-base"
				>
					{{ paragraph }}
				</p>
			</section>

			<section v-if="borrowersList">
				<p class="tw-text-base">
					{{ borrowersList }}
				</p>
			</section>

			<section>
				<!--
				"Previous Loan sections" omitted. Needs separate ticket
				-->
			</section>

			<section v-if="storyTranslation">
				<img
					loading="lazy"
					v-if="reviewerImageLink"
					:src="reviewerImageLink"
					:alt="reviewerName"
				>
				<p class="tw-text-base">
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
						class="tw-text-base"
					>
						{{ paragraph }}
					</p>
				</div>
			</section>
		</div>
	</section>
</template>

<script>

export default {
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
