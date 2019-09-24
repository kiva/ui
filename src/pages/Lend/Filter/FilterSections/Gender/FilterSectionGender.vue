<template>
	<div class="pill-toggle">
		<ais-menu :attribute="'gender'">
			<div slot-scope="{ items, refine }">
				<gender-toggle-wrapper
					:refine="refine"
					:items="items"
					:filter-menu-open="filterMenuOpen"
				/>
			</div>
		</ais-menu>
	</div>
</template>

<script>
import { AisMenu } from 'vue-instantsearch';
import GenderToggleWrapper from '@/pages/Lend/Filter/FilterSections/Gender/GenderToggleWrapper';

export default {
	components: {
		AisMenu,
		GenderToggleWrapper,
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
