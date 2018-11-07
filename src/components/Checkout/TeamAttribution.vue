<template>
	<div class="team-select-wrapper">
		<div class="team-select">
			<select
				v-model="selectedId"
				class="team-select-dd small-text"
				@change="updateLoanReservation()">
				<option value="0">None</option>
				<option v-for="team in teams"
					:key="team.id"
					:value="team.id">{{ team.name }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import _forEach from 'lodash/forEach';
import numeral from 'numeral';

export default {
	props: {
		teams: {
			type: Array,
			default: () => []
		},
		teamId: {
			type: Number,
			default: null
		},
		price: {
			type: String,
			default: ''
		},
		loanId: {
			type: Number,
			default: null
		},
	},
	components: {
	},
	inject: ['apollo'],
	data() {
		return {
			selectedId: this.teamId,
			cachedId: null,
		};
	},
	methods: {
		updateLoanReservation() {
			if (this.selectedId !== this.loanId) {
				this.$emit('updating-totals', true);
				let updatedTeamId = numeral(this.selectedId).value();

				if (updatedTeamId === 0) {
					updatedTeamId = null;
				}

				this.apollo.mutate({
					mutation: updateLoanReservation,
					variables: {
						teamId: updatedTeamId,
						loanid: this.loanId,
						price: this.price
					}
				}).then(data => {
					console.log(`'right after then' ${updatedTeamId}`);
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
						this.$emit('updating-totals', false);
						this.selectedId = this.cachedId;
					} else {
						console.log('update success');
						this.$kvTrackEvent(
							'basket',
							'Update Team Loan Attribution',
							this.selectedId === null ? 'Team Attribution Removed'
								: 'Team Attribution Removal Success', this.selectedId.value()
						);
						this.$emit('refresh-totals', 'team-update');
						this.cachedId = this.selectedId;
					}
				}).catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
			}
		}
	}
};

</script>


<style lang="scss" scoped>
@import 'settings';

.team-select-wrapper {
	white-space: nowrap;
}

.team-select {
	float: left;
	max-width: rem-calc(250);
}

.team-select-dd {
	border: 1px solid $gray;
	border-radius: $button-radius;
	height: rem-calc(40);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: 2rem 2rem;
	text-indent: 0.02rem;
	color: $dark-gray;
	font-weight: $global-weight-highlight;
	cursor: pointer;

	@include breakpoint(medium) {
		height: rem-calc(24);
		padding: 0 1.5rem 0 0.5rem;
		background-size: rem-calc(20) rem-calc(20);
	}
}

// Media query targeting IE 10+ only
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
	.team-select-dd {
		width: 100%;
		background-position: left 3.5rem center;
	}
}

// Media query targeting IE EDGE
@supports (-ms-ime-align:auto) {
	.team-select-dd {
		background-position: right -1.2rem center;
	}
}
</style>
