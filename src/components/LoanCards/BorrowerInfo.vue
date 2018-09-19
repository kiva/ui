<template>
	<div class="borrower-info-wrapper">
		<router-link
			:to="`/lend/${loanId}`"
			class="name"
			v-kv-track-event="['Lending', 'click-Read more', 'Name', loanId, 'true']">
			<span
				@click="$emit('trackLoanCardInteraction', {
					interactionType: 'viewBorrowerPage',
					interactionElement: 'borrowerName'
				})"
			>{{ name }}</span>
		</router-link>
		<div class="country">{{ country }}</div>
		<div class="loan-use">
			<span>
				A loan of {{ amount | numeral('$0,0') }} {{ helpedLanguage }}
				{{ borrowerCountLanguage }} {{ shortenedLoanUse }}
			</span>
			<router-link
				:to="`/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Read more', loanId, 'true']">
				<span
					@click="$emit('trackLoanCardInteraction', {
						interactionType: 'viewBorrowerPage',
						interactionElement: 'readMore'
					})"
				>Read more</span>
			</router-link>
			<div v-if="activeSort === 'loanLength'" class="loan-length">
				<strong>Loan length:</strong> {{ loanLength }} months
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		use: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: ''
		},
		country: {
			type: String,
			default: ''
		},
		amount: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: ''
		},
		borrowerCount: {
			type: Number,
			default: 1
		},
		loanLength: {
			type: Number,
			default: null
		},
		activeSort: {
			type: String,
			default: 'Popularity'
		}
	},
	computed: {
		helpedLanguage() {
			if (this.status === 'fundRaising'
			|| this.status === 'inactive'
			|| this.status === 'reviewed') {
				return 'helps';
			}
			return 'helped';
		},
		borrowerCountLanguage() {
			if (this.borrowerCount > 1) {
				return ' a member ';
			}
			return ' ';
		},
		shortenedLoanUse() {
			const maxLength = 100;
			const lowerCaseUse = this.use.toString().charAt(0).toLowerCase() + this.use.toString().slice(1);
			const convertedUse = (this.use.substring(0, this.name.length) === this.name) ? this.use : lowerCaseUse;

			if (this.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			} else if (this.use.length > maxLength) {
				return `${convertedUse.substring(0, maxLength)}...`;
			}
			return convertedUse;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-wrapper {
	text-align: center;
	margin-top: rem-calc(20);
	padding: 0 rem-calc(20);
	line-height: rem-calc(22);
	flex-grow: 1;

	.name {
		font-size: rem-calc(22);
		font-weight: 400;
	}

	.country {
		color: $kiva-text-light;
		font-weight: 400;
		margin-bottom: rem-calc(10);
	}

	.loan-length {
		display: inline-block;
		margin-top: rem-calc(15);
	}
}
</style>
