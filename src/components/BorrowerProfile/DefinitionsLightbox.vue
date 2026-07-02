<template>
	<Teleport to="body">
		<kv-lightbox
			:visible="visible"
			:title="title"
			@lightbox-closed="close"
		>
			<div v-html="content" class="tw-prose"></div>
		</kv-lightbox>
	</Teleport>
</template>

<script>
import { KvLightbox } from '@kiva/kv-components';
import useBorrowerProfileDefinitions from '#src/composables/useBorrowerProfileDefinitions';

// Single definitions lightbox for a page/surface. Mount one at the page root and
// provide its `open` method (see FullBorrowerProfile / BorrowerSideSheetContent);
// child components inject `openDefinition` and call it with their own cid/sfid.
// Definition data is shared across all callers via useBorrowerProfileDefinitions.
export default {
	name: 'DefinitionsLightbox',
	inject: ['apollo'],
	components: {
		KvLightbox,
	},
	created() {
		this.definitions = useBorrowerProfileDefinitions(this.apollo);
	},
	data() {
		return {
			visible: false,
			title: '',
			content: '',
		};
	},
	methods: {
		async open({
			cid, sfid, forceSalesforce = false, track = null,
		} = {}) {
			if (track) {
				this.$kvTrackEvent(...track);
			}
			const result = await this.definitions.resolveDefinition({ cid, sfid, forceSalesforce });
			if (result) {
				this.title = result.title ?? '';
				this.content = result.content ?? '';
				this.visible = true;
			}
		},
		close() {
			this.visible = false;
			setTimeout(() => {
				// Clear content after the close animation, but only if it wasn't
				// reopened with new content during the animation.
				if (!this.visible) {
					this.title = '';
					this.content = '';
				}
			}, 500);
		},
	},
};
</script>
