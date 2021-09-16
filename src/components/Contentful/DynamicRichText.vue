<script>
/**
* This component takes an html string and renders it with vue
* */

export default {
	props: {
		html: {
			type: String,
			default: ''
		}
	},
	computed: {
		dynamicComponent() {
			return {
				template: `<div class="tw-prose tw-whitespace-pre-wrap">${this.html}</div>`,
				components: {
					KvContentfulImg: () => import('~/@kiva/kv-components/vue/KvContentfulImg'),
					KvButton: () => import('~/@kiva/kv-components/vue/KvButton')
				},
				props: [
					/* define props as needed */
				],
				methods: {
					buttonClick(customEventName, event) {
						// Current behavior is to replace a button navigation if a custom event name is passed
						event.stopPropagation();
						// Emit root level event that any component can listen for
						this.$root.$emit(customEventName);
					},
				}
			};
		},
	},
	render(createElement) {
		return createElement(
			'div', /* Wrap output in a div since Vue templates must have 1 root element */
			[
				createElement(this.dynamicComponent, {
					props: {
						/* pass prop values as needed */
					}
				})
			]
		);
	}
};
</script>
