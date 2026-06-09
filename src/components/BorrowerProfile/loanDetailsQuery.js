import { gql } from 'graphql-tag';

export const loanDetailsQuery = gql`query loanDetails($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			name
			status
			lenderRepaymentTerm
			repaymentInterval
			disbursalDate
			anonymizationLevel
			expiredDate
			refundedDate
			defaultedDate
			endedDate
			terms {
				currency
				flexibleFundraisingEnabled
				lenderRepaymentTerm
				lossLiabilityCurrencyExchange
			}
			... on LoanDirect {
				trustee {
					id
					organizationName
					stats {
						id
						numDefaultedLoans
						numLoansEndorsedPublic
						repaymentRate
						totalLoansValue
					}
				}
				endorsement
			}
			... on LoanPartner {
				partner {
					arrearsRate
					avgBorrowerCost
					avgBorrowerCostType
					avgProfitability
					chargesFeesInterest
					defaultRate
					id
					loansAtRiskRate
					name
					riskRating
					currencyExchangeLossRate
					startDate
					loansPosted
					totalAmountRaised
					avgLoanSizePercentPerCapitaIncome
				}
			}
		}
	}
}`;

/**
 * Shape the loanDetails query response into the loan/partner/trustee view models
 * consumed by the details tabs. Returns fully-defaulted objects for missing data
 * so it can seed initial component state as well as map query results.
 */
export function mapLoanDetailsResult(data) {
	const loan = data?.lend?.loan;
	const partner = loan?.partner;
	const trustee = loan?.trustee;

	return {
		loan: {
			currency: loan?.terms?.currency ?? '',
			flexibleFundraisingEnabled: loan?.terms?.flexibleFundraisingEnabled ?? false,
			loanLenderRepaymentTerm: loan?.lenderRepaymentTerm ?? 0,
			loanTermLenderRepaymentTerm: loan?.terms?.lenderRepaymentTerm ?? 0,
			lossLiabilityCurrencyExchange: loan?.terms?.lossLiabilityCurrencyExchange ?? '',
			repaymentInterval: loan?.repaymentInterval ?? '',
			disbursalDate: loan?.disbursalDate ?? '',
			status: loan?.status ?? '',
			name: loan?.name ?? '',
			anonymizationLevel: loan?.anonymizationLevel ?? 'none',
			expiredDate: loan?.expiredDate ?? '',
			refundedDate: loan?.refundedDate ?? '',
			defaultedDate: loan?.defaultedDate ?? '',
			endedDate: loan?.endedDate ?? '',
		},
		partner: {
			arrearsRate: partner?.arrearsRate ?? 0,
			avgBorrowerCost: partner?.avgBorrowerCost ?? 0,
			avgBorrowerCostType: partner?.avgBorrowerCostType ?? '',
			avgProfitability: partner?.avgProfitability ?? 0,
			chargesFeesInterest: partner?.chargesFeesInterest ?? false,
			defaultRate: partner?.defaultRate ?? 0,
			id: partner?.id ?? 0,
			loansAtRiskRate: partner?.loansAtRiskRate ?? 0,
			name: partner?.name ?? '',
			riskRating: partner?.riskRating ?? 0,
			currencyExchangeLossRate: partner?.currencyExchangeLossRate ?? 0,
			startDate: partner?.startDate ?? '',
			loansPosted: partner?.loansPosted ?? 0,
			totalAmountRaised: partner?.totalAmountRaised ?? '',
			avgLoanSizePercentPerCapitaIncome: partner?.avgLoanSizePercentPerCapitaIncome ?? 0,
		},
		trustee: {
			endorsement: loan?.endorsement ?? '',
			id: trustee?.id ?? 0,
			name: trustee?.organizationName ?? '',
			numDefaultedLoans: trustee?.stats?.numDefaultedLoans ?? 0,
			numLoansEndorsedPublic: trustee?.stats?.numLoansEndorsedPublic ?? 0,
			repaymentRate: trustee?.stats?.repaymentRate ?? 0,
			totalLoansValue: trustee?.stats?.totalLoansValue ?? '0',
		},
	};
}
