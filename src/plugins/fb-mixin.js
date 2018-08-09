export default {
	data() {
		return {
			fbLoginStatus: () => {}
		};
	},
	mounted() {
		this.checkFbLoginStatus();
	},
	methods: {
		checkFbLoginStatus() {
			if (typeof FB === 'undefined') {
				throw new Error('FB SDK is not loaded');
			}
			const vm = this;
			/* eslint-disable */
			FB.getLoginStatus(response => {
				vm.fbLoginStatus = response;
				vm.handleLoginStatus(response);
			});
			/* eslint-enable */
		},
		handleLoginStatus(response) {
			this.fbLoginStatus = response;
			console.log(response);
		}
	}
};

