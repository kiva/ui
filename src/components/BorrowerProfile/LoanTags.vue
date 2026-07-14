<template>
	<section class="tw-mb-4">
		<div v-if="loading" class="tw-w-full">
			<kv-loading-placeholder class="tw-w-1/5 tw-mb-2" :style="{height: '1.5rem'}" />
			<kv-loading-placeholder class="tw-w-4/5 md:tw-w-2/5 tw-mb-1" :style="{height: '1rem'}" />
			<kv-loading-placeholder class="tw-w-3/5 md:tw-w-1/4" :style="{height: '1rem'}" />
		</div>

		<div v-else class="tw-prose">
			<h2 class="tw-text-headline">
				Tags
			</h2>
			<!-- Applied tags -->
			<p v-if="visibleTags.length > 0">
				<span v-for="(tag, index) in visibleTags" :key="tag.id || 0">
					<router-link
						:to="`/lend/filter?tag=${tag.id}`"
						class="tw-no-underline tw-font-medium"
						data-testid="bp-loan-tag"
					>
						{{ tag.name }}
					</router-link>{{ getTagDivider(index) }}
				</span>
			</p>

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
		</div>
	</section>
</template>

<script>
import loanTagsQuery from '#src/graphql/query/borrowerProfileLoanTags.graphql';
import availableTagsQuery from '#src/graphql/query/availableTags.graphql';
import addOrRemoveTagOnLoan from '#src/graphql/mutation/addOrRemoveTagOnLoan.graphql';
import logFormatter from '#src/util/logFormatter';
import { KvCheckbox, KvLoadingPlaceholder } from '@kiva/kv-components';

// Exclude automated tag that users shouldn't select
const excludedTagIds = [28]; // #Repeat Borrower - automated tag

export default {
	name: 'LoanTags',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvCheckbox,
		KvLoadingPlaceholder,
	},
	emits: ['hide-section'],
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
	apollo: [
		{
			lazy: true,
			query: availableTagsQuery,
			result({ data }) {
				if (data?.lend?.tag) {
					this.availableTags = data.lend.tag
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
				this.availableTagsLoaded = true;
				this.emitHideSectionIfEmpty();
			},
		},
		{
			lazy: true,
			query: loanTagsQuery,
			fetchPolicy: 'network-only',
			variables() {
				return { loanId: this.loanId };
			},
			result({ data }) {
				const loan = data?.lend?.loan;
				if (loan?.tags) {
					this.loanTagNames = loan.tags;
				}
				this.userTagNames = loan?.userProperties?.appliedTags ?? [];
				this.loanTagsLoaded = true;
				this.emitHideSectionIfEmpty();
			},
		},
	],
	data() {
		return {
			availableTags: [],
			loanTagNames: [],
			userTagNames: [],
			selectorVisible: false,
			availableTagsLoaded: false,
			loanTagsLoaded: false,
		};
	},
	computed: {
		loading() {
			return !this.availableTagsLoaded || !this.loanTagsLoaded;
		},
		tagStates() {
			const states = {};
			this.availableTags.forEach(tag => {
				if (tag.id != null && tag.name != null) {
					states[tag.id] = this.userTagNames.includes(tag.name);
				}
			});
			return states;
		},
		// Tags this user personally applied.
		selectedTags() {
			return this.availableTags.filter(tag => this.tagStates[tag.id] === true);
		},
		// The displayed list: every tag applied to the loan (by anyone) plus this user's own.
		visibleTags() {
			return this.availableTags.filter(tag => tag.name != null
				&& (this.loanTagNames.includes(tag.name) || this.userTagNames.includes(tag.name)));
		},
	},
	methods: {
		emitHideSectionIfEmpty() {
			if (!this.loading && this.visibleTags.length === 0 && !this.isLoggedIn) {
				this.$emit('hide-section');
			}
		},
		getTagDivider(index) {
			return index < this.visibleTags.length - 1 ? ' | ' : '';
		},
		async handleTagToggle(tagId, checked) {
			const tag = this.availableTags.find(t => t.id === tagId);
			if (!tag?.name) return;

			if (checked && this.selectedTags.length >= 5) {
				return;
			}

			// Optimistically update this user's own tags only; the loan-level list is a
			// server-side aggregate over all users, so the network-only refetch reconciles it.
			if (checked) {
				this.userTagNames = [...this.userTagNames, tag.name];
			} else {
				this.userTagNames = this.userTagNames.filter(n => n !== tag.name);
			}

			try {
				const { data } = await this.apollo.mutate({
					mutation: addOrRemoveTagOnLoan,
					variables: {
						loanId: this.loanId,
						tagId,
						checked,
					},
					refetchQueries: [{ query: loanTagsQuery, variables: { loanId: this.loanId } }],
				});
				if (!data?.addOrRemoveTagOnLoan) {
					this.$showTipMsg('There was a problem saving the tag change', 'error');
				}
			} catch (e) {
				logFormatter(e, 'error');
				// Revert the optimistic update
				if (checked) {
					this.userTagNames = this.userTagNames.filter(n => n !== tag.name);
				} else {
					this.userTagNames = [...this.userTagNames, tag.name];
				}
				this.$showTipMsg('There was a problem saving the tag change', 'error');
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
