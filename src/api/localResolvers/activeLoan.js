import query from '@/graphql/mutation/updateActiveLoan.graphql';
/*
 * Active loan resolvers
 */
export default () => {
	return {
		defaults(cache) {
			const data = {
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
			};

			cache.writeQuery({
				query,
				data,
			});

			return data;
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
