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
				<div class="tw-flex tw-items-center">
					<h2 data-testid="bp-story-previous-loan-header">
						Previous loan details
					</h2>
					<kv-icon-button
						:icon="mdiInformationOutline"
						size="small"
						class="tw-ml-0.5 tw-shrink-0"
						data-testid="bp-story-successive-concurrent-info"
						aria-label="Learn more about successive and concurrent loans"
						@click="showSuccessiveConcurrentDefinition"
						v-kv-track-event="[
							'Borrower profile',
							'click-successive-concurrent-info',
							'Learn more about successive and concurrent loans',
							loanId
						]"
					/>
				</div>

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
import { mdiChevronDown, mdiInformationOutline } from '@mdi/js';
import { toParagraphs } from '#src/util/loanUtils';
import { gql } from 'graphql-tag';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import KvExpandable from '#src/components/Kv/KvExpandable';
import { KvTextLink, KvMaterialIcon, KvIconButton } from '@kiva/kv-components';

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
		KvIconButton,
		KvExpandable,
	},
	data() {
		return {
			mdiChevronDown,
			mdiInformationOutline,
			previousLoanDetailsOpen: false,
			previousLoanDescription: '',
		};
	},
	inject: {
		apollo: { from: 'apollo' },
		openDefinition: { from: 'openDefinition', default: () => () => {} },
	},
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
		showSuccessiveConcurrentDefinition() {
			this.openDefinition({
				cid: 'bp-def-successive-concurrent-loans',
				sfid: '50150000000cckn',
				track: [
					'Borrower Profile',
					'click-Loan-Details-tab-definition-link',
					'Learn more about successive and concurrent loans',
				],
			});
		},
	}
};

</script>
