<template>
	<!-- Each section holds one item, so the accordion's last-child border removal is overridden -->
	<KvAccordionItem
		v-if="collapsible"
		:id="id"
		class="!tw-border-b"
	>
		<template #header>
			<!-- Not an h2: the header sits inside the toggle button, which can only hold phrasing content -->
			<span class="tw-block tw-text-h2">
				<slot name="title"></slot>
			</span>
			<span v-if="$slots.subtitle" class="tw-block tw-text-base tw-text-secondary">
				<slot name="subtitle"></slot>
			</span>
		</template>
		<div class="tw-pt-1 tw-pb-3">
			<slot></slot>
		</div>
	</KvAccordionItem>
	<template v-else>
		<slot name="heading"></slot>
		<slot></slot>
	</template>
</template>

<script>
import { KvAccordionItem } from '@kiva/kv-components';

/**
 * Wraps a borrower profile section so it can render as a collapsed row with a chevron. When not
 * collapsible, it renders the section's own heading and body unchanged.
 */
export default {
	name: 'CollapsibleSection',
	components: {
		KvAccordionItem,
	},
	props: {
		/**
		 * Unique id for the toggle and body region
		 */
		id: {
			type: String,
			required: true,
		},
		/**
		 * Whether the section renders as a collapsed row
		 */
		collapsible: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
