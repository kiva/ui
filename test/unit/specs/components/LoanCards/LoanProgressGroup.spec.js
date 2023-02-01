import { render } from '@testing-library/vue';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';

describe('LoanProgressGroup', () => {
	it('should display default message', () => {
		const { getByText } = render(LoanProgressGroup);

		getByText('$0 to go');
	});

	it('should display amount left', () => {
		const { getByText } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34'
			},
		});

		getByText('$12.34 to go');
	});

	it('should display time left', () => {
		const { getByText } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34',
				timeLeft: '1 day left.'
			},
		});

		getByText('$12.34 to go. 1 day left.');
	});

	it('should display exclamation mark with experiment and low amount', () => {
		const { getByText } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34',
				enableLoanCardExp: true
			},
		});

		getByText('$12.34 to go!');
	});

	it('should not display double exclamation mark with experiment and low amount', () => {
		const { getByText } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34',
				timeLeft: '1 day left!',
				enableLoanCardExp: true
			},
		});

		getByText('$12.34 to go. 1 day left!');
	});

	it('should not use orange color without experiment', () => {
		const { container } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34',
			},
		});

		expect(container.getElementsByClassName('progress-group-amount-low').length).toBe(0);
	});

	it('should use orange color with experiment and low amount', () => {
		const { container } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '12.34',
				enableLoanCardExp: true
			},
		});

		expect(container.getElementsByClassName('progress-group-amount-low').length).toBe(1);
	});

	it('should not use orange color with experiment and not low amount', () => {
		const { container } = render(LoanProgressGroup, {
			props: {
				moneyLeft: '500',
				enableLoanCardExp: true
			},
		});

		expect(container.getElementsByClassName('progress-group-amount-low').length).toBe(0);
	});

	it('should pass percentage to progress bar', () => {
		const { container } = render(LoanProgressGroup, {
			props: {
				progressPercent: 0.5,
			},
		});

		expect(container.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('50');
	});
});
