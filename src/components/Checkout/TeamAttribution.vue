<template>
	<div class="team-select-wrapper">
		<div class="team-select">
			<select
				v-model="selectedId"
				class="team-select-dd small-text"
				@change="updateLoanReservation()">
				<option value="0">None</option>
				<option v-for="team in sortTeams"
					:key="team.id"
					:value="team.id">{{ team.name }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
import updateLoanReservationTeam from '@/graphql/mutation/updateLoanReservationTeam.graphql';
import _forEach from 'lodash/forEach';
import _orderBy from 'lodash/orderBy';
import numeral from 'numeral';

export default {
	props: {
		teams: {
			type: Array,
			default: () => []
		},
		teamId: {
			type: Number,
			default: 0
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
			selectedId: this.teamId || 0,
			cachedId: null,
		};
	},
	computed: {
		sortTeams() {
			return _orderBy(this.teams, 'name');
		}
	},
	methods: {
		updateLoanReservation() {
			if (this.selectedId !== this.loanId) {
				this.$emit('updating-totals', true);
				const updatedTeamId = numeral(this.selectedId).value();

				this.apollo.mutate({
					mutation: updateLoanReservationTeam,
					variables: {
						teamId: updatedTeamId,
						loanid: this.loanId
					}
				}).then(data => {
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
						this.$emit('updating-totals', false);
						this.selectedId = this.cachedId;
					} else {
						this.$kvTrackEvent(
							'basket',
							'Update Team Loan Attribution',
							this.selectedId === 0 ? 'Team Attribution Removed'
								: 'Team Attribution Removal Success', numeral(this.selectedId).value()
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
	background-image: url('~@/assets/images/customDropdown999.png');
	background-position: right -2.1rem center;
	background-size: 2rem 2rem;
	padding: 0 2.6rem 0 0.5rem;
	text-indent: 0.02rem;
	color: $dark-gray;
	cursor: pointer;

	@include breakpoint(medium) {
		height: rem-calc(24);
		padding: 0 1.75rem 0 0.5rem;
		background-size: rem-calc(23) rem-calc(20);
		background-position: right -1.5rem center;
	}
}
</style>
