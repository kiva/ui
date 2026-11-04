import { render, fireEvent } from '@testing-library/vue';
import apolloPlugin from '#src/plugins/apollo-plugin';
import AutolendingStatus from '#src/pages/Autolending/AutolendingStatus';
import { globalOptions, getOperationName } from '../../../specUtils';

const savedPauseUntil = '2027-01-15T12:00:00-08:00';

const renderStatus = ({ pauseUntil = savedPauseUntil } = {}) => {
	const mutate = vi.fn(() => Promise.resolve({}));
	const apollo = {
		...globalOptions.provide.apollo,
		readQuery: () => ({
			autolending: {
				id: 0,
				profileChanged: false,
				currentProfile: { id: 0, isEnabled: true, pauseUntil },
				savedProfile: { id: 0, pauseUntil },
			},
		}),
		mutate,
	};
	const utils = render(AutolendingStatus, {
		global: {
			...globalOptions,
			plugins: [apolloPlugin],
			provide: { ...globalOptions.provide, apollo },
			stubs: {
				KvLightbox: { template: '<div><slot /><slot name="controls" /></div>' },
			},
		},
	});
	const pauseMutations = () => mutate.mock.calls
		.map(([options]) => options)
		.filter(options => getOperationName(options.mutation) === 'pauseAutolending');
	return { ...utils, mutate, pauseMutations };
};

describe('AutolendingStatus', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date(2026, 9, 29, 12));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows the saved pause end date as the selected pause option', () => {
		const { container } = renderStatus();
		const select = container.querySelector('select#days-to-pause-select');

		expect(select.options[select.selectedIndex].textContent.trim()).toBe('until 01/15/2027');
	});

	it('leaves the saved pause unchanged when the status dialog is opened', async () => {
		const { container, pauseMutations } = renderStatus();

		await fireEvent.click(container.querySelector('[data-test="autolending-status"]'));

		expect(pauseMutations()).toHaveLength(0);
	});

	it('pauses from today when a new duration is chosen', async () => {
		const { container, pauseMutations } = renderStatus();

		await fireEvent.update(container.querySelector('select#days-to-pause-select'), '90');

		expect(pauseMutations().at(-1).variables.pauseUntilDate).toMatch(/^2027-01-27T/);
	});

	it('restores the saved pause end date when it is chosen again', async () => {
		const { container, pauseMutations } = renderStatus();
		const select = container.querySelector('select#days-to-pause-select');

		await fireEvent.update(select, '90');
		select.selectedIndex = 0;
		await fireEvent.change(select);

		expect(pauseMutations().at(-1).variables.pauseUntilDate).toBe(savedPauseUntil);
	});

	it('offers only durations when no pause is saved', () => {
		const { container } = renderStatus({ pauseUntil: null });
		const options = [...container.querySelector('select#days-to-pause-select').options];

		expect(options.map(option => option.textContent.trim())).toEqual([
			'for 1 month',
			'for 3 months',
			'for 6 months',
		]);
	});
});
