<template>
	<div class="team-select-wrapper tw-whitespace-nowrap">
		<div class="team-select">
			<label for="team_select" class="tw-sr-only">Attribute to team</label>
			<kv-select
				id="team_select"
				data-testid="basket-loan-team-selector"
				v-model="selectedId"
				class="team-select-dd fs-mask data-hj-suppress tw-float-left"
				style="max-width: rem-calc(250);"
				@update:modelValue="updateLoanReservation()"
			>
				<option value="0">
					None
				</option>
				<option
					v-for="team in sortTeams"
					:key="team.id"
					:value="team.id"
				>
					{{ team.name }}
				</option>
			</kv-select>
		</div>
	</div>
</template>

<script>
import _forEach from 'lodash/forEach';
import _orderBy from 'lodash/orderBy';
import numeral from 'numeral';
import updateLoanReservationTeam from '@/graphql/mutation/updateLoanReservationTeam.graphql';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	name: 'TeamAttribution',
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
		KvSelect
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
	watch: {
		// watch for updated changes to the teamId prop
		// typically this is derived from the team assigned to the loan reservation
		teamId(newId, prevId) {
			if (newId !== prevId) {
				this.selectedId = newId;
			}
		}
	},
	mounted() {
		this.selectedId = this.teamId || 0;
	},
	methods: {
		updateLoanReservation() {
			if (this.selectedId !== this.teamId) {
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
