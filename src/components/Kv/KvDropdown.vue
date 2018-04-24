<template>
	<div :id="name" class="dropdown-pane" data-dropdown>
		<slot></slot>
	</div>
</template>

<script>
import $ from 'jquery';
import { Dropdown } from 'foundation/foundation.dropdown';

export default {
	data() {
		return {
			dropdown: null
		};
	},
	props: {
		name: { type: String, required: true }
	},
	methods: {
		open() {
			this.dropdown.open();
		},
		close() {
			this.dropdown.close();
		},
		toggle() {
			this.dropdown.toggle();
		},
		fixZfDropdown() {
			const self = this;

			// Check if the user is using touch, and if so, prevent dropdown closing on mouseleave
			// so that only 1 tap (instead of 2) is required to open a link in the dropdown.
			window.addEventListener('touchstart', function onFirstTouch() {
				self.dropdown.$anchors.off('mouseleave.zf.dropdown');
				window.removeEventListener(onFirstTouch);
			});
		}
	},
	mounted() {
		const jqElem = $(this.$el);
		this.dropdown = new Dropdown(jqElem, {
			hover: true,
			hoverPane: true,
			hoverDelay: 100,
		});

		// proxy foundation jquery events to vue component events
		const events = ['closeme', 'show', 'hide'];
		for (let i = 0; i < events.length; i += 1) {
			const zfEvent = `${events[i]}.zf.dropdown`;
			jqElem.off(zfEvent).on(zfEvent, () => this.$emit(events[i]));
		}

		this.fixZfDropdown();
	},
	updated() {
		// eslint-disable-next-line no-underscore-dangle
		this.dropdown._init();
		this.fixZfDropdown();
	},
	beforeDestroy() {
		// eslint-disable-next-line no-underscore-dangle
		this.dropdown._destroy();
	}
};
</script>

<style lang="scss">
@import 'settings';
@import 'foundation';
@include foundation-dropdown;
</style>
