import loanCallouts from '@/util/loanCallouts';
import mockLoanData from '../../fixtures/mockLoanData';

const loan = mockLoanData[0];

describe('loanCallouts', () => {
	it('should handle undefined', () => {
		const result = loanCallouts();

		expect(result).toEqual([]);
	});

	it('should handle undefined loan', () => {
		const result = loanCallouts(undefined, 'asd');

		expect(result).toEqual([]);
	});

	it('should handle undefined categoryPageName', () => {
		const result = loanCallouts(loan);

		expect(result).toEqual(['Dairy', 'Agriculture']);
	});

	it('should handle undefined activity', () => {
		const result = loanCallouts({ ...loan, activity: undefined });

		expect(result).toEqual(['Agriculture']);
	});

	it('should handle undefined sector', () => {
		const result = loanCallouts({ ...loan, sector: undefined });

		expect(result).toEqual(['Dairy']);
	});

	it('should handle undefined tags', () => {
		const result = loanCallouts({ ...loan, tags: undefined });

		expect(result).toEqual(['Dairy', 'Agriculture']);
	});

	it('should handle undefined themes', () => {
		const result = loanCallouts({ ...loan, themes: undefined });

		expect(result).toEqual(['Dairy', 'Agriculture']);
	});

	it('should return public tags', () => {
		const result = loanCallouts({
			...loan,
			activity: undefined,
			sector: undefined,
			tags: ['#asd', 'qwe']
		});

		expect(result).toEqual(['asd']);
	});

	it('should return eco-friendly', () => {
		let result = loanCallouts({
			...loan,
			activity: undefined,
			sector: undefined,
			tags: ['#Eco-friendly']
		});

		expect(result).toEqual(['Eco-friendly']);

		result = loanCallouts({
			...loan,
			activity: undefined,
			sector: undefined,
			tags: ['#Sustainable Ag']
		});

		expect(result).toEqual(['Eco-friendly', 'Sustainable Ag']);
	});

	it('should return Refugees and IDPs', () => {
		const result = loanCallouts({
			...loan,
			activity: undefined,
			sector: undefined,
			themes: ['Refugees/Displaced']
		});

		expect(result).toEqual(['Refugees and IDPs', 'Refugees/Displaced']);
	});

	it('should return Single Parent', () => {
		const result = loanCallouts({
			...loan,
			activity: undefined,
			sector: undefined,
			tags: ['#Single Parent']
		});

		expect(result).toEqual(['Single Parent']);
	});

	it('should return activity if not matching category', () => {
		let result = loanCallouts(loan, 'Asd');

		expect(result).toEqual(['Dairy', 'Agriculture']);

		result = loanCallouts(loan, 'Dairy');

		expect(result).toEqual(['Agriculture']);
	});

	it('should return sector if not matching category or activity', () => {
		let result = loanCallouts(loan, 'Asd');

		expect(result).toEqual(['Dairy', 'Agriculture']);

		result = loanCallouts(loan, 'Dairy');

		expect(result).toEqual(['Agriculture']);

		result = loanCallouts({ ...loan, activity: { name: 'Agriculture' } }, 'Agriculture');

		expect(result).toEqual([]);
	});

	it('should return tag if callouts still needed and not already in callouts', () => {
		let result = loanCallouts({ ...loan, tags: ['#asd'] });

		expect(result).toEqual(['Dairy', 'Agriculture']);

		result = loanCallouts({ ...loan, activity: undefined, tags: ['#asd'] });

		expect(result).toEqual(['Agriculture', 'asd']);

		result = loanCallouts({ ...loan, activity: undefined, tags: ['#agriculture'] });

		expect(result).toEqual(['Agriculture']);
	});

	it('should return theme if callouts still needed and not already in callouts', () => {
		let result = loanCallouts({ ...loan, themes: ['asd'] });

		expect(result).toEqual(['Dairy', 'Agriculture']);

		result = loanCallouts({ ...loan, activity: undefined, themes: ['asd'] });

		expect(result).toEqual(['Agriculture', 'asd']);

		result = loanCallouts({ ...loan, activity: undefined, themes: ['agriculture'] });

		expect(result).toEqual(['Agriculture']);
	});
});
