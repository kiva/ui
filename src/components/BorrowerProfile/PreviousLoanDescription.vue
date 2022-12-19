<template>
	<section data-testid="bp-story-previous-loan">
		<kv-text-link
			v-kv-track-event="['Borrower profile', 'click-Loan details', 'Show previous loan details', this.loanId]"
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
					v-if="previousLoanId && this.borrowerOrGroupName !== ''"
					:to="`/lend/${previousLoanId}`"
					:data-testid="`bp-story-previous-loan-link`"
					v-kv-track-event="[
						'Borrower profile',
						'Loan details',
						'Borrower\'s previous loan',
						previousLoanId
					]"
				>
					{{ this.borrowerOrGroupName }}'s previous loan
				</router-link>
			</div>
		</kv-expandable>
	</section>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import { toParagraphs } from '@/util/loanUtils';
import { gql } from '@apollo/client';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

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
