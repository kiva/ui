<template>
	<article>
		<borrower-image
			class="
				tw-w-full
				tw-bg-black
				tw-rounded
				tw-mb-3.5
				md:tw-mb-4
			"
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
		<!-- {{ name }}'s story' -->
		<!-- loan description -->
	</article>
</template>

<script>
import gql from 'graphql-tag';
import BorrowerImage from './BorrowerImage';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			name: '',
			hash: '',
			description: '',
		};
	},
	apollo: {
		query: gql`query loanStory($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					name
					description
					image {
						id
						hash
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
			this.description = loan?.description ?? '';
			this.hash = loan?.image?.hash ?? '';
			this.name = loan?.name ?? '';
		},
	},
};
</script>
