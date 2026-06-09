<template>
	<kv-lightbox
		:visible="isLightboxVisible"
		:title="lightboxTitle"
		@lightbox-closed="closeLightbox"
	>
		<div v-html="lightboxContent" class="tw-prose"></div>
	</kv-lightbox>
</template>

<script>
import { gql } from 'graphql-tag';
import { formatContentGroupsFlat } from '#src/util/contentfulUtils';
import { KvLightbox } from '@kiva/kv-components';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
	name: 'DetailsDefinitionsLightbox',
	inject: ['apollo'],
	components: {
		KvLightbox,
	},
	props: {
		useSalesForce: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			contentfulDefinitions: null,
			isLightboxVisible: false,
			lightboxContent: null,
			lightboxTitle: '',
		};
	},
	methods: {
		showDefinition(payload) {
			// track definition pop up click
			this.$kvTrackEvent('Borrower Profile', `click-${payload.panelName}-tab-definition-link`, payload.linkText);

			if (this.useSalesForce) {
				this.showSalesforceSolution(payload.sfid);
			} else {
				this.showContentfulEntry(payload.cid);
			}
		},
		closeLightbox() {
			// close lightbox
			this.isLightboxVisible = false;
			setTimeout(() => {
				// clear content
				this.lightboxTitle = '';
				this.lightboxContent = null;
			}, 500); // Delay to allow modal to close before clearing content
		},
		loadContentfulDefinitions(contentEntryKey) {
			this.apollo.query({
				query: gql`query contentfulDefinitions {
					contentful {
						entries(contentKey: "borrower-profile-definitions", contentType: "contentGroup")
					}
				}`,
			}).then(result => {
				// assign and show lightbox content
				const contentfulData = result.data?.contentful?.entries?.items ?? null;
				if (contentfulData) {
					const contentfulDataFormatted = formatContentGroupsFlat(contentfulData);
					this.contentfulDefinitions = contentfulDataFormatted.borrowerProfileDefinitions?.contents ?? null;
					// show originally requested entry
					this.showContentfulEntry(contentEntryKey);
				}
			});
		},
		showContentfulEntry(contentKey) {
			// check for loaded data
			if (!this.contentfulDefinitions) {
				this.loadContentfulDefinitions(contentKey);
				return false;
			}
			// extract target entry
			const contentfulEntry = this.contentfulDefinitions.find(entry => entry.key === contentKey);
			// setup and show lightbox content
			if (contentfulEntry) {
				this.lightboxTitle = contentfulEntry.name;
				this.lightboxContent = documentToHtmlString(contentfulEntry.richText);
				this.isLightboxVisible = true;
			}
			return true;
		},
		showSalesforceSolution(solutionId) {
			// fetch data
			this.apollo.query({
				query: gql`query salesforceSolution($id: String!) {
					general {
						salesforceSolution(id: $id) {
							name
							note
						}
					}
				}`,
				variables: {
					id: solutionId
				}
			}).then(result => {
				// assign and show lightbox content
				const solutionData = result?.data?.general?.salesforceSolution ?? null;
				const solutionTitle = solutionData?.name ?? '';
				const solutionContent = solutionData?.note ?? null;
				if (solutionData) {
					this.lightboxTitle = solutionTitle;
					this.lightboxContent = solutionContent;
					this.isLightboxVisible = true;
				}
			});
		},
	},
};
</script>
