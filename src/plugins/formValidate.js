export default {
	data() {
		return {
			emailErrors: [],
			passwordErrors: [],
		};
	},
	methods: {
		checkEmpty(value) {
			return value === '';
		},
		validateName(name) {
			console.log('validateName function entered');
			this.firstNameErrors = [];
			if (this.checkEmpty(name)) {
				this.firstNameErrors.push('Name required');
			}
		},
		validatePassword(password) {
			console.log('validatePassword function entered');
			this.passwordErrors = [];
			if (this.checkEmpty(password)) {
				this.passwordErrors.push('Password required');
			}
			return this.passwordErrors;
		},
		validateEmail(email) {
			console.log('validateEmail function entered.');
			this.emailErrors = [];
			// regex taken from: http://emailregex.com/
			// eslint-disable-next-line
			const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

			if (this.checkEmpty(email)) {
				this.emailErrors.push('Email required');
			}
			if (!re.test(email)) {
				this.emailErrors.push('Valid email required');
			}
			return this.emailErrors;
		},
	}
};
