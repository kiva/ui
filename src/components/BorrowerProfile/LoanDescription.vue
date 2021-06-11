<template>
	<section>
		<h2
			class="tw-text-h2"
		>
			{{ firstName }}'s story
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
				<h3
					class="tw-text-h3"
				>
					About {{ partnerName }}:
				</h3>
				<p
					v-for="(paragraph, index) in loanAlertTextParagraphs"
					:key="index"
					class="tw-text-base"
				>
					{{ paragraph }}
				</p>
			</div>
			<div
				v-if="dualStatementNote"
			>
				<h3
					class="tw-text-h3"
				>
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
			<h3
				class="tw-text-h3"
			>
				Business Description
			</h3>
			<p
				v-for="(paragraph, index) in businessDescriptionParagraphs"
				:key="index"
				class="tw-text-base"
			>
				{{ paragraph }}
			</p>
			<h3
				class="tw-text-h3"
			>
				What is the purpose of this loan?
			</h3>
			<p
				v-for="(paragraph, index) in purposeParagraphs"
				:key="index"
				class="tw-text-base"
			>
				{{ paragraph }}
			</p>
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
		moreInfoAboutLoan: { // LoanPartner.moreInfoAboutLoan
			type: String,
			default: '',
		},
		dualStatementNote: { // LoanPartner.dualStatementNote
			type: String,
			default: '',
		},
		businessDescription: { // LoanDirect.businessDescription
			type: String,
			default: '',
		},
		purpose: { // LoanDirect.purpose
			type: String,
			default: '',
		},
		loanAlertText: { // Partner.loanAlertText
			type: String,
			default: '',
		},
		firstName: { // Borrower.firstName
			type: String,
			default: '',
		},
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
	methods: {
		toParagraphs(text) {
			return String(text).split(/(\r\n\r\n|\n\n|\n \n|<br>)/);
		}
	}
};

</script>
