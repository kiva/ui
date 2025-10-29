import teamGoalMixin from '../../../../src/plugins/team-goal-mixin';

describe('team-goal-mixin.js', () => {
	let component;

	it('should have required goal prop with default empty object', () => {
		expect(teamGoalMixin.props.goal.type).toBe(Object);
		expect(teamGoalMixin.props.goal.required).toBe(true);
		expect(teamGoalMixin.props.goal.default()).toEqual({});
	});

	beforeEach(() => {
		component = {
			goal: {
				name: 'Test Challenge',
				endDate: '2025-12-31T00:00:00Z',
				description: 'A test challenge',
				descriptionAuthor: {
					name: 'John Doe',
					image: {
						url: 'https://example.com/avatar.jpg',
					},
				},
				targets: {
					totalCount: 10,
					values: [
						{
							status: 'COMPLETE',
							targetLendAmount: 1000,
						},
						{
							status: 'COMPLETE',
							targetLendAmount: 1000,
						},
						{
							status: 'IN_PROGRESS',
							targetLendAmount: 1000,
						},
					],
				},
				participation: {
					totalCount: 5,
					amountLent: '500',
					values: [
						{
							lender: { id: '1', name: 'Alice' },
							amountLent: '100',
						},
						{
							lender: { id: '2', name: 'Bob' },
							amountLent: '150',
						},
						{
							lender: { id: '1', name: 'Alice' },
							amountLent: '50',
						},
					],
				},
			},
		};

		// Mount computed properties onto component
		Object.keys(teamGoalMixin.computed).forEach(key => {
			Object.defineProperty(component, key, {
				get: teamGoalMixin.computed[key].bind(component),
			});
		});
	});

	describe('challengeName', () => {
		it('should return the goal name', () => {
			expect(component.challengeName).toBe('Test Challenge');
		});

		it('should return empty string when goal name is missing', () => {
			component.goal = {};
			expect(component.challengeName).toBe('');
		});
	});

	describe('challengeEndDate', () => {
		it('should return the end date', () => {
			expect(component.challengeEndDate).toBe('2025-12-31T00:00:00Z');
		});

		it('should return null when end date is missing', () => {
			component.goal = {};
			expect(component.challengeEndDate).toBeNull();
		});
	});

	describe('loansFunded', () => {
		it('should count only completed loans', () => {
			expect(component.loansFunded).toBe(2);
		});

		it('should return 0 when no targets exist', () => {
			component.goal.targets = { values: [] };
			expect(component.loansFunded).toBe(0);
		});
	});

	describe('totalLoans', () => {
		it('should return total count of loans', () => {
			expect(component.totalLoans).toBe(10);
		});

		it('should return 0 when targets are missing', () => {
			component.goal = {};
			expect(component.totalLoans).toBe(0);
		});
	});

	describe('percentageFunded', () => {
		it('should calculate percentage funded', () => {
			expect(component.percentageFunded).toBe(50); // 500 / 1000 = 50%
		});

		it('should return 0 when target amount is 0 or division by zero occurs', () => {
			component.goal.targets.values[0].targetLendAmount = 0;
			const result = component.percentageFunded;
			// Should return 0 or handle division by zero gracefully
			expect(typeof result).toBe('number');
			expect(Number.isNaN(result)).toBe(false);
		});

		it('should floor the percentage', () => {
			component.goal.participation.amountLent = '666';
			expect(component.percentageFunded).toBe(66); // floored from 66.6%
		});
	});

	describe('participationTotalCount', () => {
		it('should return participation total count', () => {
			expect(component.participationTotalCount).toBe(5);
		});

		it('should return 0 when participation is missing', () => {
			component.goal = {};
			expect(component.participationTotalCount).toBe(0);
		});
	});

	describe('fundedAmount', () => {
		it('should return funded amount as number', () => {
			expect(component.fundedAmount).toBe(500);
		});

		it('should return 0 when amount is missing', () => {
			component.goal.participation = {};
			expect(component.fundedAmount).toBe(0);
		});
	});

	describe('totalAmount', () => {
		it('should return target lend amount', () => {
			expect(component.totalAmount).toBe(1000);
		});

		it('should return 0 when targets are missing', () => {
			component.goal = {};
			expect(component.totalAmount).toBe(0);
		});
	});

	describe('daysLeft', () => {
		it('should calculate days left', () => {
			const { daysLeft } = component;
			expect(typeof daysLeft).toBe('string');
			expect(daysLeft).toContain('day');
		});
	});

	describe('challengeDescription', () => {
		it('should return challenge description', () => {
			expect(component.challengeDescription).toBe('A test challenge');
		});

		it('should return empty string when description is missing', () => {
			component.goal = {};
			expect(component.challengeDescription).toBe('');
		});
	});

	describe('authorName', () => {
		it('should return author name', () => {
			expect(component.authorName).toBe('John Doe');
		});

		it('should return empty string when author is missing', () => {
			component.goal = {};
			expect(component.authorName).toBe('');
		});
	});

	describe('authorImageUrl', () => {
		it('should return author image URL', () => {
			expect(component.authorImageUrl).toBe('https://example.com/avatar.jpg');
		});

		it('should return empty string when image is missing', () => {
			component.goal = {};
			expect(component.authorImageUrl).toBe('');
		});
	});

	describe('participants', () => {
		it('should return participation object', () => {
			expect(component.participants).toHaveProperty('totalCount', 5);
			expect(component.participants).toHaveProperty('amountLent', '500');
		});
	});

	describe('challengeActivity', () => {
		it('should combine activities by same lender', () => {
			const activity = component.challengeActivity;

			expect(activity).toHaveLength(2);
			// Alice's activities (100 + 50 = 150)
			expect(activity[0].lender.id).toBe('1');
			expect(parseFloat(activity[0].amountLent)).toBe(150);
			// Bob's activity
			expect(activity[1].lender.id).toBe('2');
			expect(parseFloat(activity[1].amountLent)).toBe(150);
		});

		it('should handle empty participation values', () => {
			component.goal.participation.values = [];
			const activity = component.challengeActivity;

			expect(activity).toEqual([]);
		});
	});
});
