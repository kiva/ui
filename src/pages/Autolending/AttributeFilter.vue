<template>
	<div>
		<h3 class="specific-filter-title">
			Attributes
		</h3>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="attributes"
					:items="attributesWithSelected"
					:use-columns="true"
					@change="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import _union from 'lodash/union';
import _without from 'lodash/without';
import gql from 'graphql-tag';
import themeListQuery from '@/graphql/query/autolending/themeList.graphql';
import CheckList from './CheckList';

export default {
	inject: ['apollo'],
	components: {
		CheckList,
	},
	data() {
		return {
			allThemes: [],
			currentThemeIds: [],
		};
	},
	apollo: {
		query: themeListQuery,
		preFetch: true,
		result({ data }) {
			this.allThemes = _sortBy(_get(data, 'lend.loanThemeFilter') || [], 'name');
			this.currentThemeIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.theme') || [];
		},
	},
	computed: {
		attributesWithSelected() {
			return _map(this.allThemes, ({ name }) => {
				return {
					id: name,
					name,
					selected: this.currentThemeIds.indexOf(name) > -1,
				};
			});
		},
	},
	methods: {
		onChange(checked, values) {
			const codes = Array.isArray(values) ? values : [values];
			if (checked) {
				// Add the values to the current ids
				this.changeThemes(_union(this.currentThemeIds, codes));
			} else {
				// Remove the values from the current ids
				this.changeThemes(_without(this.currentThemeIds, ...codes));
			}
		},
		changeThemes(themes) {
			this.apollo.mutate({
				mutation: gql`mutation($themes: [String]) {
					autolending @client {
						editProfile(profile: {
							loanSearchCriteria: {
								filters: {
									theme: $themes
								}
							}
						})
					}
				}`,
				variables: {
					themes: themes.length ? themes : null,
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.specific-filter-title {
	font-size: 1rem;
	margin: 0 auto 0.5rem;
	font-weight: $global-weight-highlight;
}
</style>
