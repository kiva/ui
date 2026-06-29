<template>
	<section data-testid="bp-story-previous-loan">
		<kv-text-link
			v-kv-track-event="['Borrower profile', 'click-Loan details', 'Show previous loan details', loanId]"
			@click.prevent="performClick"
		>
			Show previous loan details
			<kv-material-icon
				:icon="mdiChevronDown"
				class="tw-w-3 tw-h-3 tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500"
				:class="{'tw-rotate-180' : previousLoanDetailsOpen}"
			/>
		</kv-text-link>
		<kv-expandable
			v-show="previousLoanDetailsOpen"
			easing="ease-in-out"
		>
			<div>
				<h2 data-testid="bp-story-previous-loan-header">
					Previous loan details
				</h2>

				<p
					v-for="(paragraph, index) in formattedPreviousLoanDescription"
					:data-testid="`bp-story-previous-loan-text-${index}`"
					:key="index"
					v-html="paragraph"
				>
				</p>

				<router-link
					v-if="previousLoanId && borrowerOrGroupName !== ''"
					:to="`/lend/${previousLoanId}`"
					:data-testid="`bp-story-previous-loan-link`"
					v-kv-track-event="[
						'Borrower profile',
						'Loan details',
						'Borrower\'s previous loan',
						previousLoanId
					]"
				>
					{{ borrowerPossessiveName }} previous loan
				</router-link>
			</div>
		</kv-expandable>
	</section>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import { toParagraphs } from '#src/util/loanUtils';
import { gql } from 'graphql-tag';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import KvExpandable from '#src/components/Kv/KvExpandable';
import { KvTextLink, KvMaterialIcon } from '@kiva/kv-components';

const previousLoanQuery = gql`query previousLoanQuery($id: Int!) {
	lend {
		loan(id: $id) {
			id
			description
		}
	}
}`;

export default {
	name: 'PreviousLoanDescription',
	components: {
		KvTextLink,
		KvMaterialIcon,
		KvExpandable,
	},
	data() {
		return {
			mdiChevronDown,
			previousLoanDetailsOpen: false,
			previousLoanDescription: '',
		};
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		previousLoanId: {
			type: Number,
			default: 0,
		},
		borrowerOrGroupName: {
			type: String,
			default: ''
		}
	},
	computed: {
		formattedPreviousLoanDescription() {
			return toParagraphs(this.previousLoanDescription);
		},
		borrowerPossessiveName() {
			return formatPossessiveName(this.borrowerOrGroupName);
		},
	},
	methods: {
		fetchPreviousLoanDescription() {
			this.apollo.query({
				query: previousLoanQuery,
				variables: {
					id: this.previousLoanId
				}
			}).then(({ data }) => {
				this.previousLoanDescription = data.lend?.loan?.description;
			});
		},
		togglePreviousLoanDetails() {
			this.previousLoanDetailsOpen = !this.previousLoanDetailsOpen;
		},
		performClick() {
			this.togglePreviousLoanDetails();
			if (this.previousLoanDescription === '') {
				this.fetchPreviousLoanDescription();
			}
		},
	}
};

</script>
