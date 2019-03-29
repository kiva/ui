<template>
	<div class="pill-toggle">
		<ais-refinement-list :attribute="'gender'">
			<div slot-scope="{ items, refine }">
				<filter-section-gender-pill-toggle
					:refine="refine"
					:items="items"
					:filter-menu-open="filterMenuOpen"
				/>
			</div>
		</ais-refinement-list>
	</div>
</template>

<script>
import { AisRefinementList } from 'vue-instantsearch';
import FilterSectionGenderPillToggle from '@/pages/Lend/Filter/FilterSectionGenderPillToggle';

export default {
	components: {
		AisRefinementList,
		FilterSectionGenderPillToggle,
	},
	props: {
		title: {
			type: String,
			default: 'Gender',
		},
		open: {
			type: Boolean,
			default: true,
		},
		filterMenuOpen: {
			type: Boolean,
			default: true,
		},
	},
};
</script>
