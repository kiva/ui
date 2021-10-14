<template>
	<section>
		<!-- eslint-disable max-len -->
		<kv-text-link
			v-if="previousLoanId"
			v-kv-track-event="['Borrower profile', 'click-Loan details', 'Show previous loan details', this.loanId]"
			@click.prevent="performClick"
		>
			<!-- eslint-enable max-len -->
			Show previous loan details
			<kv-material-icon
				:icon="mdiChevronDown"
				class="tw-align-middle tw-transition tw-duration-500 tw-rotate-180"
			/>
		</kv-text-link>

		<div v-if="previousLoanDetailsOpen">
			<h2>Previous loan details</h2>

			<p
				v-for="(paragraph, index) in formatedPreviousLoanDescription"
				:key="index"
				v-html="paragraph"
			>
			</p>
		</div>
	</section>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import gql from 'graphql-tag';
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
		}
	},
	methods: {
		toParagraphs(text) {
			return String(text).replace(/\r|\n|<br\s*\/?>/g, '\n').split(/\n+/);
		},
		fetchPreviousLoanDescription() {
			this.apollo.query({
				query: previousLoanQuery,
				variables: {
					id: 2255060
					// this.previousLoanId
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
		}
	}
};

</script>
