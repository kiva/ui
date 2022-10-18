<template>
	<div>
		<h4 class="tw-mb-2">
			Attributes
		</h4>
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
import { gql } from '@apollo/client';
import themeListQuery from '@/graphql/query/autolending/themeList.graphql';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from './CheckList';

export default {
	name: 'AttributeFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
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
			// Filter mixin function that calls mutation function
			this.changeThemes(this.getValues(checked, values, this.currentThemeIds));
		},
		changeThemes(themes) {
			this.apollo.mutate({
				mutation: gql`mutation updateThemes($themes: [String]) {
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
