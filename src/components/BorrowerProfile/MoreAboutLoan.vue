<template>
	<section class="tw-prose">
		<h2>
			More about this loan
		</h2>
		<div
			v-if="partnerName"
		>
			<div>
				{{ moreInfoAboutLoan }}
			</div>
			<div
				v-if="loanAlertText"
			>
				<h3>
					About {{ partnerName }}:
				</h3>
				<p
					v-for="(paragraph, index) in loanAlertTextParagraphs"
					:key="`storyDescription-${index}`"
				>
					{{ paragraph }}
				</p>
			</div>
			<div
				v-if="dualStatementNote"
			>
				<h3>
					Important Note About This Loan
				</h3>
				<p>
					{{ dualStatementNote }}
				</p>
			</div>
		</div>
		<div
			v-if="!partnerName"
		>
			<h3>
				Business Description
			</h3>
			<p
				v-for="(paragraph, index) in businessDescriptionParagraphs"
				:key="`businessDescription-${index}`"
			>
				{{ paragraph }}
			</p>
			<h3>
				What is the purpose of this loan?
			</h3>
			<p
				v-for="(paragraph, index) in purposeParagraphs"
				:key="`purpose-${index}`"
			>
				{{ paragraph }}
			</p>
		</div>
	</section>
</template>

<script>
import gql from 'graphql-tag';

export default {
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			businessDescription: '',
			dualStatementNote: '',
			loanAlertText: '',
			moreInfoAboutLoan: '',
			partnerName: '',
			purpose: '',
		};
	},
	computed: {
		loanAlertTextParagraphs() {
			return this.toParagraphs(this.loanAlertText);
		},
		businessDescriptionParagraphs() {
			return this.toParagraphs(this.businessDescription);
		},
		purposeParagraphs() {
			return this.toParagraphs(this.purpose);
		}
	},
	apollo: {
		query: gql`query moreAboutLoan($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					... on LoanDirect {
						businessDescription
						purpose
					}
					... on LoanPartner {
						dualStatementNote
						moreInfoAboutLoan
						partnerName
						partner {
							id
							loanAlertText
						}
					}
				}
			}
		}`,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.businessDescription = loan?.businessDescription ?? '';
			this.dualStatementNote = loan?.dualStatementNote ?? '';
			this.loanAlertText = loan?.partner?.loanAlertText ?? '';
			this.moreInfoAboutLoan = loan?.moreInfoAboutLoan ?? '';
			this.partnerName = loan?.partnerName ?? '';
			this.purpose = loan?.purpose ?? '';
		},
	},
	methods: {
		toParagraphs(text) {
			return String(text).replace(/\r|\n|<br\s*\/?>/g, '\n').split(/\n+/);
		}
	}
};

</script>
