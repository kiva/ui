<template>
	<div>
		<button
			class="tw-text-action tw-inline-flex tw-cursor-pointer tw-whitespace-nowrap tw-font-medium"
			@click="toggleBookmark()"
		>
			<kv-material-icon
				class="tw-text-action tw-w-3 tw-mr-0.5"
				:icon="`${!isBookmarked ? mdiBookmarkOutline : mdiBookmark}`"
			/>
			{{ bookmarkText }}
		</button>
	</div>
</template>
<script>
import { gql } from '@apollo/client';
import { mdiBookmarkOutline, mdiBookmark } from '@mdi/js';
import bookmarkLoan from '@/util/bookmarkUtil';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanBookmark',
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
		query: gql`query loanBookmarked($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						userProperties {
							favorited
						}
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan || {};
			this.isBookmarked = loan?.userProperties?.favorited || false;
		},
	},
	computed: {
		bookmarkText() {
			if (this.isBookmarked) {
				return 'Saved';
			}
			return 'Save for later';
		}
	},
	methods: {
		toggleBookmark() {
			// Set bookmark optimistically
			this.isBookmarked = !this.isBookmarked;
			bookmarkLoan(this.apollo, this.loanId, this.isBookmarked)
				.then(data => {
					if (data.errors) {
						const errors = data?.errors;
						// error occurred, change bookmark back due to failure
						this.isBookmarked = !this.isBookmarked;
						errors.forEach(error => {
							this.$showTipMsg(error, 'error');
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
							this.$showTipMsg('This loan has been added to your "Saved loans" list, which is accessible under the "Lend" menu in the header.', 'confirm');
						}
					}
					// Catch other errors
				}).catch(error => {
					// error occurred, change bookmark back due to failure
					this.isBookmarked = !this.isBookmarked;
					console.error(error);
				});
		}
	},
};
</script>
