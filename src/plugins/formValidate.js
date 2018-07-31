export default {
	methods: {
		validateName(name) {
			return name !== '';
		},
		validateEmail(email) {
			return email !== '';
		},
		validatePassword(password) {
			return password !== '';
		}
	}
};
