<template>
	<kv-button
		v-if="buttonText"
		:href="buttonTo"
		:variant="buttonStyle"
		@click="buttonClick(buttonCustomEvent, $event)"
		v-kv-track-event="buttonAnalytics"
	>
		{{ buttonText }}
	</kv-button>
</template>

<script>
import { KvButton } from '@kiva/kv-components';
import emitter from '#src/plugins/event-emitter';

/**
* Contentful Button Wrapper
* Takes a contentful button content type parses button attributes and renders a button
* */
export default {
	name: 'ButtonWrapper',
	components: {
		KvButton
	},
	props: {
		/**
		 * Contentful Button content object
		* */
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		buttonAnalytics() {
			const contentfulAnalyticsEvent = this.content?.analyticsClickEvent ?? null;
			return contentfulAnalyticsEvent;
		},
		buttonCustomEvent() {
			return this.content?.webClickEventName ?? null;
		},
		buttonStyle() {
			return this.content?.style ?? 'primary';
		},
		buttonText() {
			return this.content?.label ?? null;
		},
		buttonTo() {
			if (this.buttonCustomEvent) {
				return undefined;
			}
			return this.content?.webLink ?? '';
		},
	},
	methods: {
		buttonClick(customEventName, event) {
			if (customEventName) {
				// Current behavior is to replace a button navigation if a custom event name is passed
				event.stopPropagation();
				// Emit event that any component can listen for using the event-emitter plugin
				emitter.emit(customEventName, { eventName: customEventName, event });
			}
		},
	}
};
</script>
