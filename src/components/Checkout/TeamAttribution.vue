<template>
	<div class="team-select-wrapper">
		<div class="team-select">
			<select
				dir="rtl"
				:v-model="team"
				class="team-select-dd medium-text-font-size"
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

.remove-wrapper {
	display: inline-block;
	margin-left: rem-calc(56);
	cursor: pointer;

	@include breakpoint(medium) {
		margin-left: rem-calc(10);
	}
}

.team-select {
	float: left;
}

.team-select-dd {
	border: 1px solid $charcoal;
	min-width: rem-calc(90);
	// width: rem-calc(132);
	border-radius: $button-radius;
	height: rem-calc(50);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: 2rem 2rem;
	text-indent: 1.6rem;
	color: $charcoal;
	font-size: $medium-text-font-size;
	font-weight: $global-weight-highlight;
	cursor: pointer;

	@include breakpoint(medium) {
		height: inherit;
		line-height: $medium-text-line-height;
		font-size: inherit;
		// width: rem-calc(90);
		background-size: rem-calc(20) rem-calc(20);
		text-indent: 0.5rem;
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

.remove-x {
	fill: $subtle-gray;
	display: inline-block;
	width: 1.1rem;
	height: rem-calc(50);

	@include breakpoint(medium) {
		height: rem-calc(36);
	}
}
</style>
