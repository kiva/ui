<template>
	<article>
		<loan-figure-carousel
			class="tw--mb-1.5 md:tw--mb-1"
			:figures="figures"
			:name="name"
		/>
		<loan-description
			class="tw-pt-4"
			:loan-id="loanId"
			:anonymization-level="anonymizationLevel"
			:borrower-count="borrowerCount"
			:borrower-or-group-name="name"
			:borrowers="borrowers"
			:description-in-original-language="descriptionInOriginalLanguage"
			:original-language="originalLanguage"
			:partner-name="partnerName"
			:reviewer="reviewer"
			:story-description="description"
			:previous-loan-id="previousLoanId"
		/>
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import LoanDescription from './LoanDescription';
import LoanFigureCarousel from './LoanFigureCarousel';

export const loanStoryFragment = gql`fragment loanStoryFields on LoanBasic {
	id
	anonymizationLevel
	borrowerCount
	borrowers {
		id
		firstName
	}
	description
	previousLoanId
	descriptionInOriginalLanguage
	figures {
		__typename
		... on Image {
			id
			hash
		}
		... on Video {
			youtubeId
		}
	}
	name
	originalLanguage {
		id
		name
	}
	... on LoanPartner {
		partnerName
		reviewer {
			id
			bylineName
			showName
		}
	}
}`;

export default {
	name: 'LoanStory',
	components: {
		LoanDescription,
		LoanFigureCarousel,
	},
	props: {
		loan: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		loanId() {
			return this.loan?.id ?? 0;
		},
		anonymizationLevel() {
			return this.loan?.anonymizationLevel ?? '';
		},
		borrowerCount() {
			return this.loan?.borrowerCount ?? 0;
		},
		borrowers() {
			return this.loan?.borrowers ?? [];
		},
		description() {
			return this.loan?.description ?? '';
		},
		descriptionInOriginalLanguage() {
			return this.loan?.descriptionInOriginalLanguage ?? '';
		},
		figures() {
			return this.loan?.figures ?? [];
		},
		name() {
			return this.loan?.name ?? '';
		},
		originalLanguage() {
			return this.loan?.originalLanguage ?? {};
		},
		partnerName() {
			return this.loan?.partnerName ?? '';
		},
		reviewer() {
			return this.loan?.reviewer ?? {};
		},
		previousLoanId() {
			return this.loan?.previousLoanId ?? 0;
		},
	},
};
</script>
