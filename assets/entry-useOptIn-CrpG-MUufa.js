import{l as i}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{g as s}from"./entry-numeral-DJCTM12wUX.js";const c=o=>({updateCommunicationSettings:async(t,n,e)=>{try{await o.mutate({mutation:s`
					mutation updateCommunicationSettings(
						$lenderNews: Boolean
						$loanUpdates: Boolean
						$globalUnsubscribed: Boolean
					) {
						my {
							updateCommunicationSettings(
								communicationSettings: {
									lenderNews: $lenderNews
									loanUpdates: $loanUpdates
									globalUnsubscribed: $globalUnsubscribed
								}
							)
						}
					}
				`,variables:{lenderNews:t,loanUpdates:n,globalUnsubscribed:e}})}catch(a){i(a,"OptInModule updateCommunicationSettings")}},updateVisitorEmailOptIn:async(t,n,e,a)=>{try{await o.mutate({mutation:s`
				mutation updateVisitorCommunicationSettings(
					$lenderNews: Boolean,
					$loanUpdates: Boolean,
					$globalUnsubscribed: Boolean,
					$visitorId: String!
				) {
					visitorEmailOptIn {
						updateCommunicationSettings(
							communicationSettings: {
								lenderNews: $lenderNews
								loanUpdates: $loanUpdates
								globalUnsubscribed: $globalUnsubscribed
							},
							visitorId: $visitorId
						)
					}
				}
			`,variables:{lenderNews:t,loanUpdates:n,globalUnsubscribed:e,visitorId:a}})}catch(r){i(r,"OptInModule updateVisitorCommunicationSettings")}}});export{c as u};
