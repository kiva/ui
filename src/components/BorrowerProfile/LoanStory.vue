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
		<div
			v-if="loanImpactStatements.length && userContextExpVariant === 'a'"
			class="tw-rounded tw-bg-white tw-p-3 md:tw-p-4 tw-my-5"
		>
			<p class="tw-text-h2 tw-mb-3">
				How this loans supports {{ name }}
			</p>
			<div
				v-for="statement in loanImpactStatements"
				:key="statement.id" class="tw-flex tw-justify-around tw-mb-3 tw-gap-2"
			>
				<img class="tw-w-10 tw-h-10" alt="High five" :src="imageRequire(`./${statement.image}.svg`)">
				<div>
					<p class="tw-text-h3">
						{{ statement.headline }}
					</p>
					<p>{{ statement.body }}</p>
				</div>
			</div>
		</div>
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
import logReadQueryError from '@/util/logReadQueryError';
import BorrowerImage from './BorrowerImage';
import LoanDescription from './LoanDescription';

const imageRequire = require.context('@/assets/images/borrower-loan-impact/', true);

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
			previousLoanId: 0,
			isoCode: '',
			partnerCountry: '',
			imageRequire,
			tags: [],
			sector: {
				name: ''
			}
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
					geocode {
						country {
							isoCode
						}
					}
					tags
					gender
					sector {
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
						partner {
							id
							countries {
								name
							}
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
			this.isoCode = loan?.geocode?.country?.isoCode ?? '';
			this.tags = loan?.tags ?? [];
			this.gender = loan?.gender ?? '';
			this.sector = loan?.sector ?? '';
		},
	},
	mounted() {
		const query = gql`query loanStoryContextExp($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					geocode {
						country {
							isoCode
						}
					}
					tags
					gender
					sector {
						id
						name
					}
					... on LoanPartner {
						partner {
							id
							countries {
								name
							}
						}
					}
				}
			}
		}`;

		try {
			const data = this.apollo.readQuery({
				query,
				variables: {
					loanId: this.loanId,
				},
			});
			const loan = data?.lend?.loan;
			this.isoCode = loan?.geocode?.country?.isoCode ?? '';
			this.tags = loan?.tags ?? [];
			this.gender = loan?.gender ?? '';
			this.sector = loan?.sector ?? '';
		} catch (e) {
			logReadQueryError(e, 'LoanStory userContextExperiment');
		}
	},
	computed: {
		loanImpactStatements() {
			const statements = [];
			const loanStatements = [{
				id: '1',
				headline: 'Improved livelihood',
				// eslint-disable-next-line max-len
				body: '88% of borrowers said their quality of life has improved since accessing loans and other financial services',
			},
			{
				id: '2',
				headline: 'Access to funding',
				body: 'Kiva loans give access to funding that would not be available to many borrowers elsewhere',
			},
			{
				id: '3',
				headline: 'Increased household income',
				body: '73% of borrowers interviewed said they had increased their household income',
			},
			{
				id: '4',
				headline: 'Better household outcomes',
				body: 'Borrowers who used loans to grow their businesses reported better household outcomes',
			}
			];
			const firstStatement = loanStatements[Math.floor(Math.random() * loanStatements.length)];
			statements.push({ ...firstStatement, image: 'orange' });
			statements.push(this.calculateStatementRank);

			return statements.filter(x => !!x);
		},
		calculateStatementRank() {
			if (this.tags.includes('#Eco-friendly') || this.tags.includes('#Sustainable Ag')) {
				return {
					id: '5',
					headline: 'Supports climate action',
					// eslint-disable-next-line max-len
					body: 'Loans enable borrowers to use clean energy, partake in recycling, and adopt sustainable practices',
					image: 'leafheart'
				};
			}
			if (this.sector?.name.toLowerCase() === 'education') {
				return {
					id: '6',
					headline: 'Increases earning potential',
					body: 'Higher education graduates are able to earn 17% more',
					image: 'water'
				};
			}
			if (this.sector?.name.toLowerCase() === 'arts') {
				return {
					id: '7',
					headline: 'Invest in their craft',
					// eslint-disable-next-line max-len
					body: 'Borrowers who use loans to fund their businesses report better financial management and more resilience',
					image: 'water'
				};
			}
			if (this.sector?.name.toLowerCase() === 'agriculture') {
				return {
					id: '8',
					headline: 'Supports their family',
					// eslint-disable-next-line max-len
					body: 'More than 75% of people living in poverty depend on agricultural activity to feed their families',
					image: 'water'
				};
			}
			if (this.loan?.gender === 'female') {
				return {
					id: '9',
					headline: 'Promotes gender equality',
					// eslint-disable-next-line max-len
					body: 'Lending to women leads to positive improvement on quality of life, driving a cycle of increased innovation and growth',
					image: 'highfive'
				};
			}
			if (this.isoCode === 'US') {
				return {
					id: '10',
					headline: 'Promotes financial equity',
					// eslint-disable-next-line max-len
					body: 'Kiva offers interest-free loans to US-based borrowers who have been excluded from traditional financial services',
					image: 'highfive'
				};
			}
			return null;
		}
	}
};
</script>
