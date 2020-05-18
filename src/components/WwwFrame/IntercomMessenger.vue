<script>
import _get from 'lodash/get';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import userInfoQuery from '@/graphql/query/userInfo.graphql';

export default {
	render() {
		return '<div></div>';
	},
	inject: ['apollo'],
	kvapollo: {
		preFetch(config, client) {
			return client.query({ query: userInfoQuery });
		},
	},
	mounted() {
		if (this.$appConfig.intercom.enable) {
			const intercomMessenger = this.apollo.readFragment({
				id: 'Experiment:intercom_messenger',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for Exp CASH-1590 Intercom
			this.$kvTrackEvent(
				'global',
				'EXP-CASH-1590-Jan2020',
				intercomMessenger.version === 'shown' ? 'b' : 'a'
			);
			if (intercomMessenger.version === 'shown') {
				/* eslint-disable */
				// Intercom Snippet
				// This next line supplied by Intercom
				(function () {let w = window; let ic = w.Intercom;if (typeof ic === 'function') { ic('reattach_activator'); ic('update', w.intercomSettings); } else { let d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; let l = function () { let s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/t3epx9oz'; let x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (w.attachEvent) { w.attachEvent('onload', l); }else { w.addEventListener('load', l, false); } } }());
				/* eslint-enable */

				this.apollo.query({
					query: userInfoQuery,
				}).then(({ data }) => {
					const userId = _get(data, 'my.userAccount.id');
					const userFirstName = _get(data, 'my.userAccount.firstName');
					const userLastName = _get(data, 'my.userAccount.lastName');
					const userEmail = _get(data, 'my.userAccount.email');

					const intercomSettings = {
						app_id: this.$appConfig.intercom.appId
					};
					if (userId) {
						intercomSettings.user_id = userId;
					}
					if (userFirstName && userLastName) {
						intercomSettings.name = `${userFirstName} ${userLastName}`;
					}
					if (userEmail) {
						intercomSettings.email = userEmail;
					}
					window.Intercom('onShow', function intercomEvent() {
						this.$kvTrackEvent('global', 'intercom', 'click-Open Widget');
					});
					// Boot intercom with user settings
					window.Intercom('boot', intercomSettings);
				});
			}
		}
	},
};
</script>
