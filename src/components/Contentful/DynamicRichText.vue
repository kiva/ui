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
		}
	},
	computed: {
		dynamicComponent() {
			return {
				template: `<div class="dynamic-rich-text tw-prose tw-whitespace-pre-wrap">${this.html}</div>`,
				components: {
					KvContentfulImg: () => import('~/@kiva/kv-components/vue/KvContentfulImg'),
					ButtonWrapper: () => import('@/components/Contentful/ButtonWrapper')
				},
				props: {
				},
			};
		},
	},
	render(createElement) {
		return createElement(
			'div', /* Wrap output in a div since Vue templates must have 1 root element */
			[
				createElement(this.dynamicComponent, {
					props: {
					},
				})
			]
		);
	}
};
</script>
