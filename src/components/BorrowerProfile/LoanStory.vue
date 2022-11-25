<template>
	<article>
		<borrower-image
			class="
				tw-w-full
				tw-bg-black
				tw-rounded
				tw--mb-1.5
				md:tw--mb-1
			"
			data-testid="bp-story-borrower-image"
			:alt="name"
			:aspect-ratio="16 / 25"
			:default-image="{ width: 612 }"
			:hash="hash"
			:images="[
				{ width: 612, viewSize: 1024 },
				{ width: 580, viewSize: 768 },
				{ width: 416, viewSize: 480 },
				{ width: 374, viewSize: 414 },
				{ width: 335, viewSize: 375 },
				{ width: 280 },
			]"
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
			:user-context-exp-variant="userContextExpVariant"
		/>
	</article>
</template>

<script>
import gql from 'graphql-tag';
import BorrowerImage from './BorrowerImage';
import LoanDescription from './LoanDescription';

export default {
	name: 'LoanStory',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		LoanDescription,
	},
	props: {
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
			anonymizationLevel: '',
			borrowerCount: 0,
			borrowers: [],
			name: '',
			hash: '',
			description: '',
			descriptionInOriginalLanguage: '',
			originalLanguage: {},
			partnerName: '',
			reviewer: {},
			previousLoanId: 0
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
					image {
						id
						hash
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
			this.hash = loan?.image?.hash ?? '';
			this.name = loan?.name ?? '';
			this.originalLanguage = loan?.originalLanguage ?? {};
			this.partnerName = loan?.partnerName ?? '';
			this.reviewer = loan?.reviewer ?? {};
			this.previousLoanId = loan?.previousLoanId ?? 0;
		},
	},
};
</script>
