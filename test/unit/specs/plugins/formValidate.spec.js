import formValidate from '#src/plugins/formValidate';

describe('formValidate.js', () => {
	let component;

	beforeEach(() => {
		// Create a component instance with the mixin
		component = {
			...formValidate.data(),
			...formValidate.methods,
		};
	});

	describe('checkEmpty', () => {
		it('should return true for empty string', () => {
			expect(component.checkEmpty('')).toBe(true);
		});

		it('should return false for non-empty string', () => {
			expect(component.checkEmpty('test')).toBe(false);
		});
	});

	describe('validateName', () => {
		it('should add error when name is empty', () => {
			component.validateName('');

			expect(component.nameErrors).toContain('Name required');
		});

		it('should clear errors when name is valid', () => {
			component.nameErrors = ['Previous error'];
			component.validateName('John Doe');

			expect(component.nameErrors).toEqual([]);
		});
	});

	describe('validatePassword', () => {
		it('should add error when password is empty', () => {
			const errors = component.validatePassword('');

			expect(errors).toContain('Password required');
		});

		it('should add error when password is too short', () => {
			const errors = component.validatePassword('short');

			expect(errors).toContain('Password must be 8 - 30 characters.');
		});

		it('should add error when password is too long', () => {
			const errors = component.validatePassword('a'.repeat(31));

			expect(errors).toContain('Password must be 8 - 30 characters.');
		});

		it('should return empty errors for valid password', () => {
			const errors = component.validatePassword('validPassword123');

			expect(errors).toEqual([]);
		});

		it('should accept password with exactly 8 characters', () => {
			const errors = component.validatePassword('12345678');

			expect(errors).toEqual([]);
		});

		it('should accept password with exactly 30 characters', () => {
			const errors = component.validatePassword('a'.repeat(30));

			expect(errors).toEqual([]);
		});
	});

	describe('validateEmail', () => {
		it('should add error when email is empty', () => {
			const errors = component.validateEmail('');

			expect(errors).toContain('Email required');
		});

		it('should add error for invalid email format', () => {
			const errors = component.validateEmail('invalid-email');

			expect(errors).toContain('Valid email required.');
		});

		it('should add error for email missing @', () => {
			const errors = component.validateEmail('testexample.com');

			expect(errors).toContain('Valid email required.');
		});

		it('should add error for email missing domain', () => {
			const errors = component.validateEmail('test@');

			expect(errors).toContain('Valid email required.');
		});

		it('should return empty errors for valid email', () => {
			const errors = component.validateEmail('test@example.com');

			expect(errors).toEqual([]);
		});

		it('should accept email with subdomain', () => {
			const errors = component.validateEmail('user@mail.example.com');

			expect(errors).toEqual([]);
		});

		it('should accept email with special characters', () => {
			const errors = component.validateEmail('user+tag@example.com');

			expect(errors).toEqual([]);
		});
	});

	describe('validateTerms', () => {
		it('should add error when terms are not accepted', () => {
			component.validateTerms(false);

			expect(component.termsErrors).toContain(
				'You must agree to the Kiva Terms of service & Privacy policy',
			);
		});

		it('should clear errors when terms are accepted', () => {
			component.termsErrors = ['Previous error'];
			component.validateTerms(true);

			expect(component.termsErrors).toEqual([]);
		});
	});
});
