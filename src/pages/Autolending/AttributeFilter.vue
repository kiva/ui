<template>
	<lightbox-filter
		plural-name="attributes"
		:all-items="mappedThemes"
		:current-ids="currentIds"
		@change="changeThemes"
	/>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import changeCase from 'change-case';
import gql from 'graphql-tag';
import themeListQuery from '@/graphql/query/autolending/themeList.graphql';
import LightboxFilter from './LightboxFilter';

export default {
	inject: ['apollo'],
	components: {
		LightboxFilter,
	},
	data() {
		return {
			allThemes: [],
			currentIds: [],
		};
	},
	computed: {
		mappedThemes() {
			return _sortBy(_map(this.allThemes, ({ name }) => {
				return {
					name,
					id: name,
				};
			}), 'name');
		},
	},
	apollo: {
		query: themeListQuery,
		preFetch: true,
		result({ data }) {
			this.allThemes = _get(data, 'lend.loanThemeFilter') || [];
			this.currentIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.theme') || [];
			console.log(this.mappedThemes);
		},
	},
	methods: {
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
