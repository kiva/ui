import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

export default apollo => {
	const updateCommunicationSettings = lenderNews => {
		try {
			apollo.mutate({
				mutation: gql`
            mutation updateCommunicationSettings(
              $lenderNews: Boolean
            ) {
              my {
                updateCommunicationSettings(
                  communicationSettings: {
                    lenderNews: $lenderNews
                  }
                )
              }
            }
          `,
				variables: {
					lenderNews,
				},
			});
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateCommunicationSettings');
		}
	};

	const updateVisitorEmailOptIn = (lenderNews, visitorId) => {
		try {
			apollo.mutate({
				mutation: gql`
          mutation updateVisitorCommunicationSettings(
            $lenderNews: Boolean,
            $visitorId: String!
          ) {
            visitorEmailOptIn {
              updateCommunicationSettings(
                communicationSettings: {
                  lenderNews: $lenderNews
                },
                visitorId: $visitorId
              )
            }
          }
        `,
				variables: {
					lenderNews,
					visitorId,
				},
			});
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateVisitorCommunicationSettings');
		}
	};

	return {
		updateCommunicationSettings,
		updateVisitorEmailOptIn,
	};
};
