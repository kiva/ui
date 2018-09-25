export default {
	data() {
		return {
			nameErrors: [],
			emailErrors: [],
			passwordErrors: [],
			termsErrors: [],
		};
	},
	methods: {
		checkEmpty(value) {
			return value === '';
		},
		validateName(name) {
			this.nameErrors = [];
			if (this.checkEmpty(name)) {
				this.nameErrors.push('Name required');
			}
		},
		validatePassword(password) {
			this.passwordErrors = [];
			if (this.checkEmpty(password)) {
				this.passwordErrors.push('Password required');
			} else if (password.length < 8 || password.length > 30) {
				this.passwordErrors.push('Password must be 8 - 30 characters.');
			}
			return this.passwordErrors;
		},
		validateEmail(email) {
			this.emailErrors = [];
			// regex taken from: http://emailregex.com/
			// eslint-disable-next-line
			const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

			if (this.checkEmpty(email)) {
				this.emailErrors.push('Email required');
			} else if (!re.test(email)) {
				this.emailErrors.push('Valid email required.');
			}
			return this.emailErrors;
		},
		validateTerms(terms) {
			this.termsErrors = [];
			if (!terms) {
				this.termsErrors.push('You must agree to the Kiva Terms of service & Privacy policy');
			}
		}
	}
};
