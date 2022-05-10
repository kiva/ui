import checkInjections from '@/util/injectionCheck';

const injections = ['apollo', 'cookieStore'];

export default {
	data() {
		return {
			lendFilterExpActive: false,
			lendFilterExpVersion: '',
			shouldUpdateLendFilterExpCookie: false,
		};
	},
	methods: {
		getLendFilterExpVersion() {
			checkInjections(this, injections);

			// Lend Filter Exp
			// Read temp cookie (set before redirect from /lend) + Assignment (should only ever = 'b')
			const lendListViewExpLegacy = this.cookieStore.get('kvlendfilter') || '';
			// We have a legacy experiment already set
			if (lendListViewExpLegacy !== '') {
				// use legacy version
				this.lendFilterExpVersion = lendListViewExpLegacy;
				// Once Mounted we need to update the ui cookie to ensure future continuity between stacks
				this.shouldUpdateLendFilterExpCookie = true;
			}
			// Set Active Status
			this.lendFilterExpActive = this.lendFilterExpVersion === 'b';
		},
		updateLendFilterExp() {
			checkInjections(this, injections);

			if (this.lendFilterExpVersion && this.lendFilterExpVersion !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CASH-545-Apr2019',
					this.lendFilterExpVersion
				);
			}
		},
		exitLendFilterExp(click) {
			this.lendFilterExpVersion = 'c';
			this.updateLendFilterExp();
			this.$kvTrackEvent('Lending', click, 'Exit-CASH-545-2019');
			window.location.href = '/lend?kexpn=lend_filter.lend_filter_versions&kexpv=c';
		}
	}
};
