import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import {
	mockedReceiptData,
	mockLender,
	mockLoans,
	mockUserAchievementProgress,
	mockContentful,
	MOCK_TIERED_BADGE_ID,
} from '../mock-data/thanks-badges-mock-data';

export default {
	title: 'Page/ThanksPageSingleVersion',
	component: ThanksPageSingleVersion,
};

const queryResult = {
	data: {
		userAchievementProgress: mockUserAchievementProgress,
		contentful: mockContentful,
	}
};

// Query result with no badge achievements (for NoBadge stories)
const queryResultNoBadge = {
	data: {
		userAchievementProgress: {
			...mockUserAchievementProgress,
			tieredLendingAchievements: [], // No badge achievements
			lendingAchievements: [],
		},
		contentful: mockContentful,
	}
};

const queryResultWithGoalInProgress = {
	data: {
		...queryResult.data,
		userAchievementProgress: {
			...mockUserAchievementProgress,
			tieredLendingAchievements: [{
				id: 'womens-equality',
				progressForYear: 3,
				totalProgressToAchievement: 3,
				__typename: 'TieredLendingAchievement',
			}],
		},
		// postCheckoutAchievements returns progress for the checkout loans
		// contributingLoanIds is on overallProgress (different type than yearlyProgress/allTimeProgress)
		postCheckoutAchievements: {
			yearlyProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			allTimeProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			overallProgress: [{
				achievementId: 'womens-equality',
				contributingLoanIds: ['1911067'], // string per GraphQL schema
			}],
		},
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-womens-equality-2026',
						category: 'womens-equality',
						target: 5,
						dateStarted: new Date().toISOString(),
						status: 'in-progress',
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

const mockTieredBadge = { achievementId: MOCK_TIERED_BADGE_ID };

const receiptWithSingleLoan = {
	...mockedReceiptData,
	items: {
		values: [mockedReceiptData.items.values.filter(item => item.basketItemType === 'loan_reservation')[0]],
	},
};

const receiptWithMultipleLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'loan_reservation'),
	},
};

const receiptWithOnlyKivaCards = {
	...mockedReceiptData,
	items: { values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'kiva_card') },
};

const receiptWithOnlyDonations = {
	...mockedReceiptData,
	items: { values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'donation') },
	totals: {
		itemTotal: "960.25",
		donationTotal: "960.25",
		kivaCardTotal: "0.00",
		depositTotals: {
			depositTotal: "960.25",
			kivaCreditAdded: "0.00",
			kivaCreditUsed: "0.00"
		},
		kivaCreditAppliedTotal: "960.25"
	},
};

const receiptWithKivaCardsAndLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => ['loan_reservation', 'kiva_card'].includes(item.basketItemType)),
	},
};

const receiptWithDonationsAndLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => ['loan_reservation', 'donation'].includes(item.basketItemType)),
	},
};

const story = (args = {}, result = queryResult) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ThanksPageSingleVersion },
		mixins: [apolloStoryMixin({ queryResult: result }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: '<ThanksPageSingleVersion v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const LoadingBadge = story({
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
}, {});

export const KivaCards = story({
	isOptedIn: true,
	receipt: receiptWithOnlyKivaCards,
});

export const KivaCardsNotOptedIn = story({
	receipt: receiptWithOnlyKivaCards,
});

export const Donations = story({
	isOptedIn: true,
	receipt: receiptWithOnlyDonations,
});

export const KivaCardsWithLoans = story({
	isGuest: false,
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithKivaCardsAndLoans,
}, queryResultNoBadge);

export const KivaCardsWithBadge = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithKivaCardsAndLoans,
	badgesAchieved: [mockTieredBadge],
});

export const DonationsNotOptedIn = story({
	receipt: receiptWithOnlyDonations,
});

export const DonationsWithLoans = story({
	isGuest: false,
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithDonationsAndLoans,
}, queryResultNoBadge);

export const DonationsWithBadge = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithDonationsAndLoans,
	badgesAchieved: [mockTieredBadge],
});

export const NoBadgeSingleLoan = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
}, queryResultNoBadge);

export const NoBadgeMultipleLoans = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
}, queryResultNoBadge);

export const NoBadgeSingleLoanNotOptedIn = story({
	isGuest: false,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
}, queryResultNoBadge);

export const NoBadgeMultipleLoansNotOptedIn = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
}, queryResultNoBadge);

export const Badge = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeLoansInPfp = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(1),
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeSingleLoanNotOptedIn = story({
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeMultipleLoansNotOptedIn = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const LoggedIn = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
}, queryResultNoBadge);

export const LoggedInOptedOut = story({
	isGuest: false,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
}, queryResultNoBadge);

export const LoggedInBadge = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
});

export const AllTransactionTypes = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const allAchievementsCompleted = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	achievementsCompleted: true,
});

export const allAchievementsCompletedNotOptedIn = story({
	isGuest: false,
	isOptedIn: false,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	achievementsCompleted: true,
});

// Query result with goal that will be completed (progress meets target)
const queryResultWithGoalCompleted = {
	data: {
		...queryResult.data,
		userAchievementProgress: {
			...mockUserAchievementProgress,
			tieredLendingAchievements: [{
				id: 'womens-equality',
				progressForYear: 5,
				totalProgressToAchievement: 5,
				__typename: 'TieredLendingAchievement',
			}],
		},
		postCheckoutAchievements: {
			yearlyProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 5,
				currentTier: 1,
				completed: true,
			}],
			allTimeProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 5,
				currentTier: 1,
				completed: true,
			}],
			overallProgress: [{
				achievementId: 'womens-equality',
				contributingLoanIds: ['1911067'],
			}],
		},
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-womens-equality-2026',
						category: 'womens-equality',
						target: 5,
						dateStarted: new Date().toISOString(),
						status: 'in-progress',
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

// Loan that matches womens-equality goal (has gender: 'female')
const mockLoanMatchingWomensGoal = {
	...mockLoans[0],
	gender: 'female',
	inPfp: false,
	distributionModel: null,
	team: null,
};

// Loan that does NOT match womens-equality goal (male borrower)
const mockLoanNotMatchingWomensGoal = {
	...mockLoans[0],
	gender: 'male',
	inPfp: false,
	distributionModel: null,
	team: null,
};

// Query result with support-all goal (any loan counts)
// For support-all, getPostCheckoutProgressByLoans returns goalProgress which uses yearlyLoanCount
const queryResultWithSupportAllGoal = {
	data: {
		...queryResult.data,
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-support-all-2026',
						category: 'support-all',
						target: 10,
						dateStarted: new Date().toISOString(),
						status: 'in-progress',
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 5,
			},
			lendingStats: {
				loanStatsByYear: {
					count: 5,
					amount: 125,
				},
			},
		},
	}
};

// Story: Goal in progress - checkout matches goal category (womens-equality)
export const GoalInProgress = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalInProgress);

// Story: Goal in progress - checkout matches goal category (womens-equality) - not opted in
export const GoalInProgressNotOptedIn = story({
	isGuest: false,
	isOptedIn: false,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalInProgress);

// Story: Goal in progress - support-all goal (any loan counts)
export const GoalInProgressSupportAll = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanNotMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 5,
	tieredAchievements: [],
}, queryResultWithSupportAllGoal);

// Query result with goal in progress AND badge achievement data
// postCheckoutAchievements returns 0 for womens-equality because checkout loan doesn't match
const queryResultWithGoalAndBadge = {
	data: {
		...queryResult.data,
		userAchievementProgress: {
			...mockUserAchievementProgress,
			tieredLendingAchievements: [
				// Goal category (womens-equality) - for goal tracking
				{
					id: 'womens-equality',
					progressForYear: 3,
					totalProgressToAchievement: 3,
					__typename: 'TieredLendingAchievement',
				},
				// Badge category (us-economic-equality) - for badge display
				mockUserAchievementProgress.tieredLendingAchievements[0],
			],
		},
		// Checkout loan doesn't match womens-equality goal, so contributingLoanIds is empty
		postCheckoutAchievements: {
			yearlyProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			allTimeProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			overallProgress: [{
				achievementId: 'womens-equality',
				contributingLoanIds: [], // Empty - checkout loan didn't match goal
			}],
		},
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-womens-equality-2026',
						category: 'womens-equality',
						target: 5,
						dateStarted: new Date().toISOString(),
						status: 'in-progress',
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

// Story: Goal set but checkout does NOT count towards goal - shows Badge instead
export const GoalNotMatchingCheckoutWithBadge = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanNotMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [mockTieredBadge],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalAndBadge);

// Query result with goal but checkout doesn't match (no badge earned)
const queryResultWithGoalNoMatch = {
	data: {
		...queryResult.data,
		userAchievementProgress: {
			...mockUserAchievementProgress,
			tieredLendingAchievements: [], // No badge achievements - should show journey module
			lendingAchievements: [],
		},
		// Checkout loan doesn't match womens-equality goal, so contributingLoanIds is empty
		postCheckoutAchievements: {
			yearlyProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			allTimeProgress: [{
				achievementId: 'womens-equality',
				totalProgress: 3,
				currentTier: 1,
				completed: false,
			}],
			overallProgress: [{
				achievementId: 'womens-equality',
				contributingLoanIds: [], // Empty - checkout loan didn't match goal
			}],
		},
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-womens-equality-2026',
						category: 'womens-equality',
						target: 5,
						dateStarted: new Date().toISOString(),
						status: 'in-progress',
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

// Story: Goal set but checkout does NOT count towards goal - shows Journey instead (no badge)
export const GoalNotMatchingCheckoutWithJourney = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanNotMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalNoMatch);

// Story: Goal completed this checkout - shows GoalCompleted module
export const GoalCompleted = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalCompleted);

// Query result with no goal set (empty goals array)
const queryResultWithNoGoal = {
	data: {
		...queryResult.data,
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [], // No goals set
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

// Story: No goal set - shows GoalEntrypoint module for goal setup
export const GoalEntrypoint = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: mockUserAchievementProgress.tieredLendingAchievements,
}, queryResultWithNoGoal);

// Story: Guest user with goals experiment enabled - should NOT show goal modules
export const GuestWithGoalsExperiment = story({
	isGuest: true,
	isOptedIn: false,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalInProgress);

// Loan with PFP (Private Fundraiser Program) - shows LoanComment module
const mockLoanWithPfp = {
	...mockLoans[0],
	inPfp: true,
	distributionModel: null,
	team: null,
};

// Story: Loan in PFP - shows LoanComment module
export const LoanInPfp = story({
	isGuest: false,
	isOptedIn: true,

	lender: mockLender,
	loans: [mockLoanWithPfp],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [mockTieredBadge],
	achievementsCompleted: false,
});

// Loan with team attribution (field partner with team)
const mockLoanWithTeam = {
	...mockLoans[0],
	inPfp: false,
	distributionModel: 'fieldPartner',
	team: { name: 'Kiva Team' },
};

// Story: Team-attributed loan - shows LoanComment module
export const LoanWithTeamAttribution = story({
	isGuest: false,
	isOptedIn: true,

	lender: mockLender,
	loans: [mockLoanWithTeam],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [mockTieredBadge],
	achievementsCompleted: false,
});

// Story: Goal in progress with PFP loan - shows both GoalInProgress AND LoanComment
export const GoalInProgressWithPfpLoan = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [{
		...mockLoanMatchingWomensGoal,
		inPfp: true,
	}],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: [],
}, queryResultWithGoalInProgress);

// Query result with goal already completed (status: 'completed')
const queryResultWithGoalAlreadyCompleted = {
	data: {
		...queryResult.data,
		userAchievementProgress: mockUserAchievementProgress,
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [{
						goalName: 'goal-womens-equality-2026',
						category: 'womens-equality',
						target: 5,
						dateStarted: new Date().toISOString(),
						status: 'completed', // Already completed previously
						loanTotalAtStart: 0,
					}],
				}),
			},
			loans: {
				totalCount: 15,
			},
		},
	}
};

// Story: User has already completed their goal previously - shows badge, no goal modules
export const GoalAlreadyCompleted = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [mockTieredBadge],
	achievementsCompleted: false,

	totalLoans: 15,
	tieredAchievements: [],
}, queryResultWithGoalAlreadyCompleted);

// Query result with no goal set but badge earned
const queryResultNoGoalWithBadge = {
	data: {
		...queryResult.data,
		userAchievementProgress: mockUserAchievementProgress,
		my: {
			id: 1,
			userPreferences: {
				id: 1,
				preferences: JSON.stringify({
					goals: [], // No goals set
				}),
			},
			loans: {
				totalCount: 10,
			},
		},
	}
};

// Story: User without goal but earned a badge - shows badge module, no goal modules
export const NoGoalWithBadge = story({
	isGuest: false,
	isOptedIn: true,
	isNextStepsExpEnabled: true,
	goalsV2Enabled: true,

	lender: mockLender,
	loans: [mockLoanMatchingWomensGoal],
	receipt: receiptWithSingleLoan,

	badgesAchieved: [mockTieredBadge],
	achievementsCompleted: false,

	totalLoans: 10,
	tieredAchievements: mockUserAchievementProgress.tieredLendingAchievements,
}, queryResultNoGoalWithBadge);