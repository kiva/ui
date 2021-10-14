<template>
	<section>
		<kv-text-link
			v-if="previousLoanId"
			v-kv-track-event="['Borrower profile', 'click-Loan details', 'Show previous loan details', this.loanId]"
			@click.prevent="performClick"
		>
			Show previous loan details
			<kv-material-icon
				:icon="mdiChevronDown"
				class="tw-align-middle tw-mb-0.5 tw-transition-transform tw-ease-in-out tw-duration-500"
				:class="{'tw-rotate-180' : previousLoanDetailsOpen}"
			/>
		</kv-text-link>
		<kv-expandable
			v-show="previousLoanDetailsOpen"
			easing="ease-in-out"
		>
			<div>
				<h2>Previous loan details</h2>

				<p
					v-for="(paragraph, index) in formatedPreviousLoanDescription"
					:key="index"
					v-html="paragraph"
				>
				</p>
			</div>
		</kv-expandable>
	</section>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import gql from 'graphql-tag';
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
		}
	},
	computed: {
		formatedPreviousLoanDescription() {
			return this.toParagraphs(this.previousLoanDescription);
		},
	},
	methods: {
		toParagraphs(text) {
			return String(text).replace(/\r|\n|<br\s*\/?>/g, '\n').split(/\n+/);
		},
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
