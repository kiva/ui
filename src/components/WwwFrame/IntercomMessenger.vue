<template>
	<div></div>
</template>

<script>
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

export default {
	props: {
		appConfig: { type: Object, default: () => {} }
	},
	inject: ['apollo'],
	mounted() {
		if (this.appConfig.intercom.enable) {
			const intercomMessenger = this.apollo.readFragment({
				id: 'Experiment:intercom_messenger',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for Exp CASH-1590 Intercom
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-1590-Jan2020',
				intercomMessenger.version === 'shown' ? 'b' : 'a'
			);
			if (intercomMessenger.version === 'shown') {
				// Intercom Snippet
				/* eslint-disable */
				window.intercomSettings = {
					app_id: this.appConfig.intercom.appId
				};
				// This next line supplied by Intercom
				(function () {let w = window; let ic = w.Intercom;if (typeof ic === 'function') { ic('reattach_activator'); ic('update', w.intercomSettings); } else { let d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; let l = function () { let s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/t3epx9oz'; let x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); }else { w.addEventListener('load', l, false); } } }());
				/* eslint-enable */
			}
		}
	},
};
</script>
