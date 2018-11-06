<template>
	<div class="team-select-wrapper">
		<div class="team-select">
			<select
				:v-model="selectedId"
				class="team-select-dd small-text"
				@change="updateLoanAmount()">
				<option v-for="team in teams"
					:key="team.id"
					:value="team.id">{{ team.name }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
// import updateLoanAmount from '@/graphql/mutation/updateLoanAmount.graphql';

export default {
	props: {
		teams: {
			type: Array,
			default: () => []
		}
	},
	components: {
	},
	data() {
		return {
			selectedId: null,
			teamMember: false
		};
	},
	methods: {
		updateLoanAmount() {
			// if (this.team !== team) {

			// }
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
	max-width: 250px;
}

.team-select-dd {
	border: 1px solid $gray;
	border-radius: $button-radius;
	// I'm a little aprehensive to set this lower than 45px as
	// that's the smallest standard height for an interactive element
	height: rem-calc(40);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: 2rem 2rem;
	text-indent: 0.02rem;
	color: $dark-gray;
	font-weight: $global-weight-highlight;
	cursor: pointer;

	@include breakpoint(medium) {
		height: 24px;
		padding: 0 1.5rem 0 0.5rem;
		// line-height: $medium-text-line-height;
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
