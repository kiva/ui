<template>
	<www-page>
		<kv-page-container>
			<kv-grid class="tw-pt-4 md:tw-pt-6 lg:tw-pt-8">
				<h1 class="tw-mb-2">
					Saved searches
				</h1>
			</kv-grid>
			<kv-grid class="md:tw-pt-6 lg:tw-pt-8">
				<h2 class="tw-mb-1">
					<table>
						<tr>
							<th class="tab"> Name </th>
							<th class="tab"> Alerts </th>
							<th class="tab"> </th>
						</tr>
						<tr>
							<td> </td>
						</tr>
					</table>
				</h2>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'SavedSearchBeta',
	components: {
		WwwPage,
		KvGrid,
		KvPageContainer,
		/* totalCount */
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			totalCount: 0,
			savedSearches: () => []
		};
	},
	/* methods : {
		savedSearches (
			offset: Int = 0 = 0,
			limit: Int = 20,
			sortBy: BasicSortByEnum = newest
) : SavedSearchCollection
	}, */
};

</script>

<style scoped>
h1 {
	font-size: 16px;
}
</style>
