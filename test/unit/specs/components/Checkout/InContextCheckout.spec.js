import InContextCheckout from '#src/components/Checkout/InContext/InContextCheckout';

describe('InContextCheckout donation credit variant tracking', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {
			query: vi.fn().mockResolvedValue({
				data: {
					shop: {
						id: 'shop',
						donationsApplyKivaCreditOffVariant: 'b',
					},
				},
			}),
		},
		cookieStore: {
			get: vi.fn().mockReturnValue('basket-id'),
		},
		$route: {
			path: '/donate/supportus',
		},
		$kvTrackEvent: vi.fn(),
		hasTrackedDonationCreditVariant: false,
		...overrides,
	});

	it('queries the backend variant and tracks it on the supportus donation route', async () => {
		const context = makeContext();

		await InContextCheckout.methods.trackDonationCreditVariant.call(context);

		expect(context.apollo.query).toHaveBeenCalledWith({
			query: expect.any(Object),
			variables: {
				basketId: 'basket-id',
			},
		});
		expect(context.$kvTrackEvent).toHaveBeenCalledWith(
			'experiment-tracking',
			'EXP-MP-2827-May2026',
			'b'
		);
		expect(context.hasTrackedDonationCreditVariant).toBe(true);
	});

	it('does not query or track outside the supportus donation route', async () => {
		const context = makeContext({
			$route: {
				path: '/checkout',
			},
		});

		await InContextCheckout.methods.trackDonationCreditVariant.call(context);

		expect(context.apollo.query).not.toHaveBeenCalled();
		expect(context.$kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not track unexpected variant values', async () => {
		const context = makeContext({
			apollo: {
				query: vi.fn().mockResolvedValue({
					data: {
						shop: {
							id: 'shop',
							donationsApplyKivaCreditOffVariant: null,
						},
					},
				}),
			},
		});

		await InContextCheckout.methods.trackDonationCreditVariant.call(context);

		expect(context.$kvTrackEvent).not.toHaveBeenCalled();
		expect(context.hasTrackedDonationCreditVariant).toBe(false);
	});

	it('ignores missing backend field errors while the backend rollout is in progress', async () => {
		const context = makeContext({
			apollo: {
				query: vi.fn().mockRejectedValue({
					graphQLErrors: [{
						message: 'Cannot query field "donationsApplyKivaCreditOffVariant" on type "Shop".',
					}],
				}),
			},
		});

		await expect(
			InContextCheckout.methods.trackDonationCreditVariant.call(context)
		).resolves.toBeUndefined();

		expect(context.$kvTrackEvent).not.toHaveBeenCalled();
		expect(context.hasTrackedDonationCreditVariant).toBe(false);
	});
});
