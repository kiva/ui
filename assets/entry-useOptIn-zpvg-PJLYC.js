import{l as i}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{g as s}from"./entry-numeral-DJCTM12wUX.js";const c=o=>({updateCommunicationSettings:async(t,e,n)=>{try{return await o.mutate({mutation:s`
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
				`,variables:{lenderNews:t,loanUpdates:e,globalUnsubscribed:n}}),!0}catch(a){return i(a,"OptInModule updateCommunicationSettings"),!1}},updateVisitorEmailOptIn:async(t,e,n,a)=>{try{await o.mutate({mutation:s`
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
			`,variables:{lenderNews:t,loanUpdates:e,globalUnsubscribed:n,visitorId:a}})}catch(r){i(r,"OptInModule updateVisitorCommunicationSettings")}}});export{c as u};
