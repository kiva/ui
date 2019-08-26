/*
 * Screen size mixin
 */
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _throttle from 'lodash/throttle';

// predefined breakpoints
const breakpoints = [
	{ name: 'wxga', size: 1440 },
	{ name: 'xga', size: 1024 },
	{ name: 'xxlarge', size: 988 },
	{ name: 'xlarge', size: 760 },
	{ name: 'large', size: 680 },
	{ name: 'medium', size: 480 },
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
