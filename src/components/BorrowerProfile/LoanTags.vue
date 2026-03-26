<template>
	<section v-if="selectedTags.length > 0 || isLoggedIn" class="tw-mb-4">
		<h2>
			Tags
		</h2>
		<!-- Applied tags -->
		<div v-if="selectedTags.length > 0" class="tw-mb-2">
			<span v-for="(tag, index) in selectedTags" :key="tag.id || 0">
				<router-link
					:to="`/lend/filter?tag=${tag.id}`"
					class="tw-no-underline tw-font-medium"
					data-testid="bp-loan-tag"
				>
					{{ tag.name }}
				</router-link>{{ getTagDivider(index) }}
			</span>
		</div>

		<p>
			Loan tags help lenders find loans that match certain areas of interest.
		</p>

		<!-- Toggle link for logged-in users -->
		<p v-if="isLoggedIn">
			<span class="tw-text-secondary">
				Select the tags below to add up to 5 of your own tags for this loan.
			</span>
			<button
				class="tw-text-action tw-font-medium"
				data-testid="bp-loan-tag-toggle"
				@click="selectorVisible = !selectorVisible"
			>
				Add {{ selectedTags.length > 0 ? 'more ' : '' }}tags
			</button>
		</p>

		<!-- Tag selector (toggled) -->
		<div v-if="selectorVisible" class="tw-mt-2">
			<div class="tw-grid tw-grid-cols-2 tw-gap-x-6 tw-gap-y-4">
				<div
					v-for="tag in availableTags"
					:key="tag.id || 0"
					class="tw-flex tw-items-start tw-space-x-3"
				>
					<kv-checkbox
						:model-value="tagStates[tag.id || 0]"
						class="tag-checkbox"
						data-testid="bp-loan-tag-checkbox"
						@update:model-value="handleTagToggle(tag.id || 0, $event)"
					>
						<div class="tw-font-medium -tw-mt-1">
							{{ tag.name }}
						</div>
						<div class="tw-text-sm">
							{{ tag.description }}
						</div>
					</kv-checkbox>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import loanTagsQuery from '#src/graphql/query/borrowerProfileLoanTags.graphql';
import availableTagsQuery from '#src/graphql/query/availableTags.graphql';
import addOrRemoveTagOnLoan from '#src/graphql/mutation/addOrRemoveTagOnLoan.graphql';
import { KvCheckbox } from '@kiva/kv-components';

// Exclude automated tag that users shouldn't select
const excludedTagIds = [28]; // #Repeat Borrower - automated tag

export default {
	name: 'LoanTags',
	inject: ['apollo'],
	components: {
		KvCheckbox,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		isLoggedIn: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			tagStates: {},
			availableTags: [],
			selectorVisible: false,
		};
	},
	computed: {
		selectedTags() {
			return this.availableTags.filter(tag => this.tagStates[tag.id] === true);
		},
		selectedTagCount() {
			return this.selectedTags.length;
		},
	},
	mounted() {
		this.loadTags();
	},
	methods: {
		async loadTags() {
			if (!this.loanId) return;
			try {
				const availableResult = await this.apollo.query({
					query: availableTagsQuery,
				});

				if (availableResult?.data?.lend?.tag) {
					this.availableTags = availableResult.data.lend.tag
						.filter(tag => tag != null
							&& tag.vocabularyId === 2
							&& tag.status === 'active'
							&& tag.id != null
							&& !excludedTagIds.includes(tag.id))
						.sort((a, b) => {
							if (!a.name || !b.name) return 0;
							if (a.name < b.name) return -1;
							if (a.name > b.name) return 1;
							return 0;
						});
				}

				const result = await this.apollo.query({
					query: loanTagsQuery,
					variables: { loanId: this.loanId },
					fetchPolicy: 'network-only',
				});

				if (result?.data?.lend?.loan?.tags) {
					const currentTagNames = result.data.lend.loan.tags;
					const newTagStates = {};
					this.availableTags.forEach(tag => {
						if (tag.id != null && tag.name != null) {
							newTagStates[tag.id] = currentTagNames.includes(tag.name);
						}
					});
					this.tagStates = newTagStates;
				}
			} catch {
				// Tag loading failure is non-critical
			}
		},
		getTagDivider(index) {
			return index < this.selectedTagCount - 1 ? ' | ' : '';
		},
		async handleTagToggle(tagId, checked) {
			try {
				if (checked && this.selectedTagCount >= 5) {
					this.tagStates = { ...this.tagStates, [tagId]: false };
					return;
				}

				await this.apollo.mutate({
					mutation: addOrRemoveTagOnLoan,
					variables: {
						loanId: this.loanId,
						tagId,
						checked,
					},
				});

				this.tagStates = { ...this.tagStates, [tagId]: checked };
			} catch {
				this.tagStates = { ...this.tagStates, [tagId]: !checked };
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.tag-checkbox :deep(label) {
	align-items: start;
}
</style>
