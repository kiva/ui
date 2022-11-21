import query from '@/graphql/query/activeLoanClient.graphql';

/*
 * Active loan resolvers
 */
export default () => {
	return {
		defaults(cache) {
			cache.writeQuery({
				query,
				data: {
					activeLoan: {
						id: 0,
						hoverLoanId: 0,
						xCoordinate: 0,
						yCoordinate: 0,
						loan: JSON.stringify({
							activity: {},
							userProperties: {},
							loanFundraisingInfo: {},
							geocode: {
								country: {},
							},
							image: {},
						}),
						tracking: JSON.stringify({}),
						__typename: 'ActiveLoan',
					}
				},
			});
		},
		typePolicies: {
			Mutation: {
				updateActiveLoan(
					_,
					{
						hoverLoanId = 0,
						xCoordinate = 0,
						yCoordinate = 0,
						loan = JSON.stringify({
							activity: {},
							userProperties: {},
							loanFundraisingInfo: {},
							geocode: {
								country: {},
							},
							image: {},
						}),
						tracking = JSON.stringify({}),
					},
					context,
				) {
					const data = {
						activeLoan: {
							id: 0,
							hoverLoanId,
							xCoordinate,
							yCoordinate,
							loan,
							tracking,
							__typename: 'ActiveLoan',
						}
					};

					context.cache.writeQuery({
						query,
						data,
					});

					return data;
				},
			},
		}
	};
};
