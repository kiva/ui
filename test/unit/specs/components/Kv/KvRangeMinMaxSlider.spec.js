import { render, fireEvent } from '@testing-library/vue';
import KvRangeMinMaxSlider from '@/components/Kv/KvRangeMinMaxSlider';

describe('KvRangeMinMaxSlider', () => {
	it('should render defaults', () => {
		const { getAllByRole } = render(KvRangeMinMaxSlider);

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should render props', () => {
		const { getAllByRole } = render(KvRangeMinMaxSlider,
			{
				props: {
					rangeMin: 10,
					rangeMax: 25,
					step: 5,
					min: 15,
					max: 20
				}
			});

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('10');
		expect(rangeInputs[0].max).toBe('25');
		expect(rangeInputs[0].value).toBe('15');
		expect(rangeInputs[0].step).toBe('5');
		expect(rangeInputs[1].min).toBe('10');
		expect(rangeInputs[1].max).toBe('25');
		expect(rangeInputs[1].value).toBe('20');
		expect(rangeInputs[1].step).toBe('5');
	});

	it('should handle min/max updates', async () => {
		const { getAllByRole } = render(KvRangeMinMaxSlider);

		const rangeInputs = getAllByRole('slider');

		await fireEvent.update(rangeInputs[0], 5);

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('5');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');

		await fireEvent.update(rangeInputs[1], 10);

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('5');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('10');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should move other slide when pushed beyond current setting', async () => {
		const { getAllByRole } = render(KvRangeMinMaxSlider,
			{
				props: {
					min: 10,
					max: 25
				}
			});

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('10');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('25');
		expect(rangeInputs[1].step).toBe('1');

		await fireEvent.update(rangeInputs[0], 30);

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('30');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('30');
		expect(rangeInputs[1].step).toBe('1');

		await fireEvent.update(rangeInputs[1], 10);

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('10');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('10');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should handle initial numbers below the range', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider,
			{
				props: {
					min: -1,
					max: -1
				}
			});

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('0');
		expect(rangeInputs[1].step).toBe('1');

		await updateProps({ min: -1, max: -1 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('0');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should handle initial numbers above the range', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider,
			{
				props: {
					min: 110,
					max: 110
				}
			});

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('100');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');

		await updateProps({ min: 110, max: 110 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('100');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should handle prop numbers outside the range', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider,
			{
				props: {
					min: 10,
					max: 25
				}
			});

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('10');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('25');
		expect(rangeInputs[1].step).toBe('1');

		await updateProps({ min: -10, max: 110 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should handle prop change', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider);

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');

		await updateProps({ min: 5, max: 8 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('5');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('8');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should emit change', async () => {
		const { getAllByRole, emitted } = render(KvRangeMinMaxSlider);

		const rangeInputs = getAllByRole('slider');

		await fireEvent.update(rangeInputs[0], 5);

		expect(emitted().change[0][0]).toEqual({ min: 5, max: 100 });

		await fireEvent.update(rangeInputs[1], 10);

		expect(emitted().change[1][0]).toEqual({ min: 5, max: 10 });
	});

	it('should handle decimal step', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider, { props: { step: 0.5 } });

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('0.5');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('0.5');

		await updateProps({ min: 0.5, max: 8.5 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0.5');
		expect(rangeInputs[0].step).toBe('0.5');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('8.5');
		expect(rangeInputs[1].step).toBe('0.5');
	});

	it('should handle max of 0', async () => {
		const { getAllByRole, updateProps } = render(KvRangeMinMaxSlider);

		const rangeInputs = getAllByRole('slider');

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('100');
		expect(rangeInputs[1].step).toBe('1');

		await updateProps({ min: 0, max: 0 });

		expect(rangeInputs[0].min).toBe('0');
		expect(rangeInputs[0].max).toBe('100');
		expect(rangeInputs[0].value).toBe('0');
		expect(rangeInputs[0].step).toBe('1');
		expect(rangeInputs[1].min).toBe('0');
		expect(rangeInputs[1].max).toBe('100');
		expect(rangeInputs[1].value).toBe('0');
		expect(rangeInputs[1].step).toBe('1');
	});

	it('should display tooltips', () => {
		const { getByText } = render(KvRangeMinMaxSlider);

		getByText('0');
		getByText('100');
	});

	it('should display decimals as percentages', () => {
		const { getByText } = render(KvRangeMinMaxSlider, {
			props: {
				rangeMax: 1,
				max: 0.9,
				isPercentage: true,
			}
		});

		getByText('0');
		getByText('90');
	});

	it('should display display tooltips with decimals', () => {
		const { getByText } = render(KvRangeMinMaxSlider, {
			props: {
				rangeMax: 10,
				step: 0.1,
				min: 4.1,
				max: 9,
			}
		});

		getByText('4.1');
		getByText('9');
	});

	it('should display display tooltips with percentages as decimals', () => {
		const { getByText } = render(KvRangeMinMaxSlider, {
			props: {
				rangeMax: 1,
				step: 0.001,
				min: 0.001,
				max: 1,
				isPercentage: true,
			}
		});

		getByText('0.1');
		getByText('100');
	});

	it('should display tooltip units', () => {
		const { getByText } = render(KvRangeMinMaxSlider, { props: { displayedUnit: '%' } });

		getByText('0%');
		getByText('100%');
	});
});
