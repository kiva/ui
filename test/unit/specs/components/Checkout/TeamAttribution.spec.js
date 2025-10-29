import { render } from '@testing-library/vue';
import TeamAttribution from '../../../../../src/components/Checkout/TeamAttribution';
import basketLoanTeams from '../../../fixtures/BasketLoanTeams.json';
import { globalOptions } from '../../../specUtils';

describe('TeamDropDown', () => {
	it('should contain these components', () => {
		const {
			getByText, getByRole, getByDisplayValue
		} = render(
			TeamAttribution,
			{
				global: {
					...globalOptions,
				},
				props: {
					teams: basketLoanTeams,
				}
			}
		);
		const Team = document.getElementById('team_select');
		const TeamSelected = Team.options[Team.selectedIndex].getAttribute('value');
		expect(TeamSelected).toBe('0'); // None should be selected by default
		// all team options should be present, though not selected
		const TeamOption1 = getByText('Donut Empire');
		const TeamOption2 = getByText('Nerdfighters');
		const TeamOption3 = getByText(
			'(A+) Atheists, Agnostics, Skeptics, Freethinkers, Secular Humanists and the Non-Religious'
		);

		const TeamAttributionOption1 = getByRole('option', { name: 'Donut Empire' });
		const TeamAttributionOption2 = getByRole('option', { name: 'Nerdfighters' });
		const TeamAttributionOption3 = getByRole('option', {
			name: '(A+) Atheists, Agnostics, Skeptics, Freethinkers, Secular Humanists and the Non-Religious'
		});
		// should return only the team currently selected
		getByDisplayValue('None');
		expect(TeamOption1).toBe(TeamAttributionOption1);
		expect(TeamOption2).toBe(TeamAttributionOption2);
		expect(TeamOption3).toBe(TeamAttributionOption3);
	});

	it('should be hidden entirely if there are no teams given', () => {
		const {
			getAllByTestId, getByRole
		} = render(
			TeamAttribution,
			{
				global: {
					...globalOptions,
				},
			}
		);
		getAllByTestId('basket-loan-team-selector');
		const TeamSelector = getByRole('img', { hidden: true });
		const TeamSelectorHidden = TeamSelector.getAttribute('aria-hidden');
		const TeamSelect = document.getElementById('team_select');

		expect(TeamSelect.classList[8]).toBe('tw-appearance-none');
		expect(TeamSelectorHidden).toBe('true');
	});

	it('should render team selector with proper teams', () => {
		const { container } = render(TeamAttribution, {
			global: {
				...globalOptions
			},
			props: {
				teams: basketLoanTeams,
				teamId: 1,
				loanId: 123
			}
		});

		const options = container.querySelectorAll('option');
		// Should have "None" + all teams (lines 11-20 template coverage)
		expect(options.length).toBe(basketLoanTeams.length + 1);
		expect(options[0].textContent.trim()).toBe('None');
	});

	it('should sort teams alphabetically', () => {
		const { container } = render(TeamAttribution, {
			global: {
				...globalOptions
			},
			props: {
				teams: basketLoanTeams,
				teamId: 0,
				loanId: 123
			}
		});

		const options = Array.from(container.querySelectorAll('option'));
		const teamNames = options.slice(1).map(opt => opt.textContent.trim());

		// sortTeams computed should order teams alphabetically (line 66)
		expect(teamNames).toEqual(teamNames.slice().sort());
	});

	it('should handle successful team attribution mutation', async () => {
		const mockMutate = vi.fn().mockResolvedValue({
			data: { shop: { updateLoanReservation: true } }
		});
		const mockTrackEvent = vi.fn();
		const mockApollo = { mutate: mockMutate };

		const { container, emitted } = render(TeamAttribution, {
			global: {
				...globalOptions,
				mocks: {
					$kvTrackEvent: mockTrackEvent
				},
				provide: {
					apollo: mockApollo
				}
			},
			props: {
				teams: basketLoanTeams,
				teamId: 0,
				loanId: 123
			}
		});

		const select = container.querySelector('#team_select');

		// Change team selection to trigger mutation (line 10: @update:model-value)
		select.value = '94';
		select.dispatchEvent(new Event('change'));

		// Wait for mutation to complete
		await vi.waitFor(() => {
			expect(mockMutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					teamId: 94,
					loanId: 123
				}
			});
		});

		// Should emit refreshtotals event (line 108)
		await vi.waitFor(() => {
			expect(emitted()).toHaveProperty('refreshtotals');
		});

		// Should track the event (lines 103-109)
		expect(mockTrackEvent).toHaveBeenCalledWith(
			'basket',
			'Update Team Loan Attribution',
			expect.any(String),
			94
		);
	});

	it('should handle mutation errors from GraphQL response', async () => {
		const mockMutate = vi.fn().mockResolvedValue({
			errors: [{ message: 'Team attribution failed' }]
		});
		const mockShowTipMsg = vi.fn();
		const mockApollo = { mutate: mockMutate };

		const { container, emitted } = render(TeamAttribution, {
			global: {
				...globalOptions,
				mocks: {
					$showTipMsg: mockShowTipMsg
				},
				provide: {
					apollo: mockApollo
				}
			},
			props: {
				teams: basketLoanTeams,
				teamId: 0,
				loanId: 123
			}
		});

		const select = container.querySelector('#team_select');

		// Trigger mutation
		select.value = '23770';
		select.dispatchEvent(new Event('change'));

		// Wait for error handling (lines 96-100)
		await vi.waitFor(() => {
			expect(mockShowTipMsg).toHaveBeenCalledWith('Team attribution failed', 'error');
		});

		// Should emit updating-totals false (line 99)
		await vi.waitFor(() => {
			const updatingEvents = emitted()['updating-totals'];
			expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
		});
	});

	it('should handle mutation catch errors', async () => {
		const mockMutate = vi.fn().mockRejectedValue(new Error('Network error'));
		const mockApollo = { mutate: mockMutate };
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const { container, emitted } = render(TeamAttribution, {
			global: {
				...globalOptions,
				provide: {
					apollo: mockApollo
				}
			},
			props: {
				teams: basketLoanTeams,
				teamId: 0,
				loanId: 456
			}
		});

		const select = container.querySelector('#team_select');

		// Trigger mutation that will be rejected
		select.value = '394';
		select.dispatchEvent(new Event('change'));

		// Wait for catch block to execute (lines 113-114)
		await vi.waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalled();
		});

		// Should emit updating-totals false (line 114)
		await vi.waitFor(() => {
			const updatingEvents = emitted()['updating-totals'];
			expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
		});

		consoleErrorSpy.mockRestore();
	});
});
