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

export default {
	name: 'LoanStory',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanDescription,
		LoanFigureCarousel,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			anonymizationLevel: '',
			borrowerCount: 0,
			borrowers: [],
			name: '',
			figures: [],
			description: '',
			descriptionInOriginalLanguage: '',
			originalLanguage: {},
			partnerName: '',
			reviewer: {},
			previousLoanId: 0,
		};
	},
	apollo: {
		preFetch: true,
		query: gql`query loanStory($loanId: Int!) {
			lend {
				loan(id: $loanId) {
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
							id
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
				}
			}
		}`,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.anonymizationLevel = loan?.anonymizationLevel ?? '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.borrowers = loan?.borrowers ?? [];
			this.description = loan?.description ?? '';
			this.descriptionInOriginalLanguage = loan?.descriptionInOriginalLanguage ?? '';
			this.figures = loan?.figures ?? [];
			this.name = loan?.name ?? '';
			this.originalLanguage = loan?.originalLanguage ?? {};
			this.partnerName = loan?.partnerName ?? '';
			this.reviewer = loan?.reviewer ?? {};
			this.previousLoanId = loan?.previousLoanId ?? 0;
		},
	},
};
</script>
