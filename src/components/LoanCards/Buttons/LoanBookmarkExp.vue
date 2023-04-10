<template>
	<div>
		<template>
			<button
				style="border-radius: 8px;"
				class="tw-cursor-pointer tw-font-medium tw-bg-white tw-p-0.5 tw-flex tw-justify-center"
				@click="toggleBookmark()"
			>
				<kv-material-icon
					class="tw-w-3"
					:style="{ color: isBookmarked ? '#F4B539' : '' }"
					:class="{ 'tw-text-black' : !isBookmarked }"
					:icon="`${!isBookmarked ? mdiBookmarkOutline : mdiBookmark}`"
				/>
			</button>
		</template>
	</div>
</template>
<script>
import { gql } from '@apollo/client';
import { mdiBookmarkOutline, mdiBookmark } from '@mdi/js';
import bookmarkLoan from '@/util/bookmarkUtil';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanBookmarkExp',
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
