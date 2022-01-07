<template>
	<div>
		<span
			v-if="!isBookmarked"
			class="tw-text-action tw-inline-flex tw-p-1 tw-cursor-pointer tw-whitespace-nowrap"
			@click="toggleBookmark()"
		>
			<kv-material-icon
				class="tw-text-action tw-w-3 tw-mr-0.5"
				:icon="mdiBookmarkOutline"
			/>
			Save for later
		</span>
		<span
			v-if="isBookmarked"
			class="tw-text-action tw-inline-flex tw-p-1 tw-cursor-pointer"
			@click="toggleBookmark()"
		>
			<kv-material-icon
				class="tw-text-action tw-w-3 tw-mr-0.5"
				:icon="mdiBookmark"
			/>
			Saved
		</span>
	</div>
</template>
<script>
import gql from 'graphql-tag';
import { mdiBookmarkOutline, mdiBookmark } from '@mdi/js';
import { bookmarkLoan } from '@/util/bookmarkUtil';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			mdiBookmarkOutline,
			mdiBookmark,
			isBookmarked: false,
		};
	},
	apollo: {
		query: gql`
			query loanBookmarked($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						... on LoanDirect {
							businessName
							userProperties {
								favorited
							}
						}
						... on LoanPartner {
							userProperties {
								favorited
							}
						}
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables() {
			return {
				loanId: this?.loanId,
			};
		},
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.isBookmarked = loan?.userProperties?.favorited;
		},
	},
	methods: {
		toggleBookmark() {
			// set bookmark
			this.isBookmarked = !this.isBookmarked;
			bookmarkLoan(this.apollo, this.loanId, this.isBookmarked)
				.then(data => {
					if (data.errors) {
						// error occurred, flip bookmark back because bookmarking failed
						this.isBookmarked = !this.isBookmarked;
						forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
					} else {
						this.$kvTrackEvent(
							'Lending',
							'Loan Favorite Toggled',
							this.isBookmarked === true ? 'Favorite Loan Added'
								: 'Loan Favorite Removed', this.isBookmarked
						);
						if (this.isBookmarked === true) {
							// eslint-disable-next-line max-len
							this.$showTipMsg('This loan has been saved to your "Saved loans" list, which is accessible under the "Lend" menu in the header.', 'confirm');
						}
					}
					// Catch other errors
				}).catch(error => {
					this.isBookmarked = !this.isBookmarked;
					console.error(error);
				});
		}
	},
};
</script>
