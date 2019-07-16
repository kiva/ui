export default {
	methods: {
		trackInteraction(args) {
			if (!this.enableTracking) {
				return;
			}

			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_loan_interaction_event_schema_1_0_0.json#';
			const interactionType = args.interactionType || 'unspecified';
			const interactionElement = args.interactionElement || 'unspecified';
			const loanInteractionTrackData = {
				schema,
				data: {
					interactionType,
					interactionElement,
					loanId: this.loan.id,
					categorySetIdentifier: this.categorySetId,
					categoryId: this.categoryId,
					row: this.rowNumber,
					position: this.cardNumber,
				},
			};

			this.$kvTrackSelfDescribingEvent(loanInteractionTrackData);
		},
	},
};
