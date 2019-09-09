/*
 * Screen size mixin
 */
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _throttle from 'lodash/throttle';

// predefined breakpoints
const breakpoints = [
	{ name: 'wxga', size: 1441 },
	{ name: 'xga', size: 1025 },
	{ name: 'xxlarge', size: 989 },
	{ name: 'xlarge', size: 761 },
	{ name: 'large', size: 681 },
	{ name: 'medium', size: 481 },
	{ name: 'small', size: 0 },
];

export default {
	data() {
		return {
			screenWidth: 320,
		};
	},
	computed: {
		// An array of current breakpoint names, largest to smallest (e.g. ['large', 'medium', 'small'])
		screenBreakpoints() {
			return _map(_filter(breakpoints, breakpoint => breakpoint.size <= this.screenWidth), 'name');
		}
	},
	mounted() {
		if (typeof window !== 'undefined') {
			// Set initial screen size
			this.screenWidth = window.innerWidth;
			// Update the screen size at most every 200ms when the window is being resized
			window.addEventListener('resize', _throttle(() => {
				this.screenWidth = window.innerWidth;
			}, 200));
		}
	},
};
