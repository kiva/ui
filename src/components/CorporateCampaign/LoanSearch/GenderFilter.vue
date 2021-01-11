<template>
	<div class="gender-radios">
		<h3 class="filter-title">
			Genders
		</h3>
		<kv-radio
			id="gender-radio-both"
			radio-value="both"
			v-model="gender"
		>
			Everyone
		</kv-radio>
		<kv-radio
			id="gender-radio-female"
			radio-value="female"
			v-model="gender"
		>
			Women only
		</kv-radio>
		<kv-radio
			id="gender-radio-male"
			radio-value="male"
			v-model="gender"
		>
			Men only
		</kv-radio>
	</div>
</template>

<script>
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvRadio,
	},
	props: {
		initialGender: {
			type: String,
			default: 'both'
		}
	},
	data() {
		return {
			gender: 'both',
		};
	},
	watch: {
		gender(gender, previousGender) {
			if (gender !== previousGender) {
				console.log('new gender selected: ', gender, previousGender);
				this.$emit('updated-filters', { gender: this.gender });
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// .specific-filter-title {
// 	font-size: 1rem;
// 	margin: 0 auto 0.5rem;
// 	font-weight: $global-weight-highlight;
// }
</style>
