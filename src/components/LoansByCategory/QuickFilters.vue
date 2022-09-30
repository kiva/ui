<template>
	<div class="tw-flex tw-flex-col tw-mb-2">
		<div class="tw-flex tw-mb-2">
			<h3 class="tw-text-h3">
				Quick filters
			</h3>
			<span class="tw-ml-2 tw-text-small">Showing {{ totalLoans }} loans</span>
			<span class="tw-ml-2 tw-text-small">Reset filters</span>
		</div>
		<div class="tw-flex tw-flex-col">
			<label
				class="tw-text-h4"
				for="gender"
			>
				Gender
			</label>
			<kv-select v-model="selectedGender" id="gender">
				<option
					v-for="gender in filterOptions.gender"
					:key="gender.key"
					:value="gender.key"
				>
					{{ gender.title }}
				</option>
			</kv-select>
		</div>
	</div>
</template>

<script>
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	name: 'QuickFilters',
	props: {
		totalLoans: {
			type: Number,
			default: 0
		},
		filterOptions: {
			type: Object,
			required: true
		},
	},
	components: {
		KvSelect
	},
	data() {
		return {
			selectedGender: ''
		};
	},
};
</script>
