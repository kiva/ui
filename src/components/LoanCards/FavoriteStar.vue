<template>
	<button
		v-kv-track-event="['Lending', 'click-Favorite star', 'Favorite', loanId, true]"
		@click.prevent.stop='toggleFavorite'
	>
		<kv-icon name="star" :class="{ 'is-favorite': isFavorite }" />
	</button>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import updateLoanFavorite from '@/graphql/mutation/updateLoanFavorite.graphql';
import _forEach from 'lodash/forEach';
// import numeral from 'numeral';

export default {
	components: {
		KvIcon
	},
	inject: ['apollo'],
	props: {
		isFavorite: {
			type: Boolean,
			default: false
		},
		loanId: {
			type: Number,
			default: null
		},
	},
	methods: {
		toggleFavorite() {
			if (this.isFavorite === false) {
				this.apollo.mutate({
					mutation: updateLoanFavorite,
					variables: {
						loanId: this.loan_id,
						favorite: this.isFavorite,
					}
				}).then(data => {
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
					} else {
						this.$kvTrackEvent(
							'favorited',
							'Loan Favorite Toggled - Added',
							'success', this.isFavorite.value
						);
						// eslint-disable-next-line max-len
						this.$showTipMsg('This loan has been saved to your "Starred loans" list, which is accessible under the "Lend" menu in the header.', 'confirm');
						this.$emit('favorite-toggled');
					}
				}).catch(error => {
					console.error(error);
				});
			} else {
				this.apollo.mutate({
					mutation: updateLoanFavorite,
					variables: {
						loanId: this.loan_id,
						favorite: this.isFavorite,
					}
				}).then(data => {
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
					} else {
						this.$kvTrackEvent(
							'favorited',
							'Loan Favorite Toggled - Removed',
							'removal success',
							this.isFavorite.value
						);
						this.$emit('favorite-toggled');
					}
				}).catch(error => {
					console.error(error);
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	button {
		outline-style: none;
	}

	.icon-star {
		height: 2rem;
		width: 2rem;
		fill: transparent;
		color: $white;
		opacity: 0.5;
		background-color: $kiva-text-dark;
		padding: 0.5rem;
		vertical-align: bottom;
	}

	.is-favorite {
		opacity: 1;
		color: $kiva-alert-yellow;
	}
</style>
