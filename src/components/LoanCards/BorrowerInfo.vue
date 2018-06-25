<template>
	<div class="borrower-info-wrapper">
		<router-link :to="`/lend/${ id }`" class="name">{{ name }}</router-link>
		<div class="country">{{ country }}</div>
		<div class="loan-use">
			<span>
				A loan of {{ amount | numeral('$0,0') }} {{ helpedLanguage }}
				{{ borrowerCountLanguage }} {{ shortenedLoanUse }}
			</span>
			<router-link :to="`/lend/${ id }`">Read more</router-link>
		</div>

		<div style="border: 2px solid red;">
			<p style="color:red; font-weight: bold;">
				Delete this temporary div
			</p>
			<p v-if="isFavorite">
				it's a favorite
			</p>
			<p v-else>
				sorry, not a favorite
			</p>
			<p v-if="isLentTo">
				you lent to this
			</p>
			<p v-else>
				you haven't lent to this yet
			</p>
			<p v-if="isVisitor">
				you're not logged in
			</p>
			<p v-else>
				you are logged in
			</p>

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
		id: {
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
		isFavorite: {
			type: Boolean,
			default: false
		},
		isLentTo: {
			type: Boolean,
			default: false
		},
		isVisitor: {
			type: Boolean,
			default: true
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
}
</style>
