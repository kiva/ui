<template>
	<div v-if="contentRichText" v-html="contentRichText">
	</div>
</template>

<script>
import _get from 'lodash/get';
import contentful from '@/graphql/query/contentful.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	inject: ['apollo'],
	data() {
		return {
			contentRichText: '',
		};
	},
	apollo: {
		query: contentful,
		preFetch: true,
		preFetchVariables() {
			return {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-top',
			};
		},
		variables() {
			return {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-top',
			};
		},
		result({ data }) {
			const contentSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-top'); // eslint-disable-line max-len

			if (!contentSetting || !contentSetting.fields) {
				return false;
			}

			const isContentEnabled = settingEnabled(
				contentSetting.fields,
				'active',
				'startDate',
				'endDate'
			);

			if (isContentEnabled) {
				const activeContent = contentSetting.fields.content.find(content => {
					return settingEnabled(
						content.fields,
						'active',
						'startDate',
						'endDate'
					);
				});

				if (activeContent) {
					this.contentRichText = documentToHtmlString(activeContent.fields.richText);
				}
			}
		},
	}
};
</script>
