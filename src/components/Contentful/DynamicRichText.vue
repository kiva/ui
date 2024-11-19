<script>
import { defineAsyncComponent, h } from 'vue';

/**
 * This component takes an html string and renders it with vue
 */
export default {
	name: 'DynamicRichText',
	props: {
		html: {
			type: String,
			default: ''
		},
		bodyColumns: {
			type: Object,
			default: () => null
		}
	},
	computed: {
		dynamicComponent() {
			return {
				template: `<div>${this.html}</div>`,
				components: {
					KvFrequentlyAskedQuestions: defineAsyncComponent(() => import(
						'#src/components/Kv/KvFrequentlyAskedQuestions'
					)),
					KvContentfulImg: defineAsyncComponent(() => import('@kiva/kv-components/dist/components/KvContentfulImg')),
					ButtonWrapper: defineAsyncComponent(() => import('#src/components/Contentful/ButtonWrapper')),
				},
			};
		},
		elementClasses() {
			let classes = 'dynamic-rich-text tw-whitespace-pre-wrap ';
			if (this.bodyColumns) {
				classes += 'tw-grid tw-gap-1 md:tw-gap-3 ';
				if (this.bodyColumns?.md) {
					classes += `md:tw-grid-cols-${this.bodyColumns.md} `;
				}
				if (this.bodyColumns?.lg) {
					classes += `lg:tw-grid-cols-${this.bodyColumns.lg} `;
				}
				if (this.bodyColumns?.xl) {
					classes += `xl:tw-grid-cols-${this.bodyColumns.xl} `;
				}
			} else {
				classes += 'tw-prose';
			}

			return classes;
		}
	},
	render() {
		return h(this.dynamicComponent, { class: this.elementClasses });
	}
};
</script>
