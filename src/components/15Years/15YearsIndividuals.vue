<template>
	<div class="individuals section">
		<div class="row">
			<div class="columns">
				<fifteen-years-section-header>
					<template v-slot:header>
						The World of Kiva
					</template>
					<template v-slot:subhead>
						The people who<br class="smo"><br class="xxlu"> make it happen
					</template>
				</fifteen-years-section-header>

				<fifteen-years-button variant="white">
					button
				</fifteen-years-button>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsButton from './15YearsButton';
import FifteenYearsSectionHeader from './15YearsSectionHeader';

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsSectionHeader,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.individuals {
	background: $tomato;
	color: $offwhite;
}
</style>
