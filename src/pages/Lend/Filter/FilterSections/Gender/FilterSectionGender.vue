<template>
	<div class="pill-toggle">
		<ais-menu :attribute="'gender'">
			<div slot-scope="{ items, refine }">
				<pill-toggle-wrapper
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
import PillToggleWrapper from '@/pages/Lend/Filter/FilterSections/Gender/PillToggleWrapper';

export default {
	components: {
		AisMenu,
		PillToggleWrapper,
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
