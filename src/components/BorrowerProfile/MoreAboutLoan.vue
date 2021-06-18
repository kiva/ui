<template>
	<section>
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
			return String(text).replace(/\r|\n|<br\s*\/?>/g, '\n').split(/\n+/);
		}
	}
};

</script>
