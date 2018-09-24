import cookie from 'js-cookie';

export default {
	methods: {
		getCookieCrumb() {
			let crumb = '';
			let kvisCookie = '';

			if (this.$ssrContext) {
				kvisCookie = this.$ssrContext.cookies.kvis || '';
			} else {
				kvisCookie = cookie.get('kvis');
			}

			if (kvisCookie) {
				crumb = kvisCookie.replace('crumb=', '') || '';
			}
			return crumb;
		},
		postForm(actionUrl, formData) {
			// transform the elements into encoded key-value-pairs
			const parameters = formData.map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`);

			fetch(actionUrl, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				redirect: 'follow', // manual, *follow, error
				referrer: 'no-referrer', // no-referrer, *client
				// convert parameters into string ie. key=value&key=value...
				body: parameters.join('&')
			})
				.then(response => {
					// The response will be the doneUrl if passed or the current url page loaded
					this.handlePostResponse(response);
				})
				.catch(error => {
					console.error('Fetch Error =\n', error);
					// $emit failed event on error to allow parent to respond register-failed or login-failed
					const formType = actionUrl.replace('process', '').replace(/\//g, '');
					this.$emit(`${formType}-failed`);
				});
		},
	}
};
