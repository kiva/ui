<script>
/**
* This component takes an html string and renders it with vue
* */

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
					KvContentfulImg: () => import('~/@kiva/kv-components/vue/KvContentfulImg'),
					ButtonWrapper: () => import('@/components/Contentful/ButtonWrapper')
				},
				props: {
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
	render(createElement) {
		return createElement(
			'div', /* Wrap output in a div since Vue templates must have 1 root element */
			[
				createElement(this.dynamicComponent, {
					class: this.elementClasses,
					props: {
					},
				})
			]
		);
	}
};
</script>
