<template>
	<section>
		<p 
			class="tw-text-h2"
		>
			More about this loan
		</p>
		<div 
			v-if="partnerName"
		>
			<div>
				{{ moreInfoAboutLoan }}
			</div>
			<div 
				v-if="loanAlertText"
			>
				<p  
					class="tw-text-h3"
				>
					About {{ partnerName }}:
				</p>
				<p
					v-for="(paragraph, index) in loanAlertTextParagraphs"
					:key="index"
					class="tw-text"
				>
					{{ paragraph }}
				</p>
			</div>
			<div 
				v-if="dualStatementNote"
			>
				<p 
					class="tw-text-h3"
				>
					Important Note About This Loan
				</p>
				<p>
					{{ dualStatementNote }}
				</p>
			</div>
		</div>
		<div 
			v-if="!partnerName"
		>
			<p 
				class="tw-text-h3"
			>
				Business Description
			</p>
			<p
				v-for="(paragraph, index) in businessDescriptionParagraphs"
				:key="index"
				class="tw-text"
			>
				{{ paragraph }}
			</p>
			<p 
				class="tw-text-h3"
			>
				What is the purpose of this loan?
			</p>
			<p
				v-for="(paragraph, index) in purposeParagraphs"
				:key="index"
				class="tw-text"
			>
				{{ paragraph }}
			</p>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		partnerName: {
			type: String,
			default: '',
		},
		moreInfoAboutLoan: {
			type: String,
			default: '',
		},
		dualStatementNote: {
			type: String,
			default: '',
		},
		businessDescription: {//directBusinessDescription
			type: String,
			default: '',
		},
		purpose: {//directLoanPurpose
			type: String,
			default: '',
		},
		loanAlertText: {//moreAboutFieldPartner
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
		},
		toParagraphs(text) {
			return String(text).split(/(\r\n\r\n|\n\n|\n \n|<br>)/);
		}
	}
};

</script>
