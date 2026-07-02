import{l as i}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{g as s}from"./entry-index-CWclSTHHJk.js";const p=(a,u)=>({updateCommunicationSettings:async(t,e,n)=>{try{return await a.mutate({mutation:s`
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
				`,variables:{lenderNews:t,loanUpdates:e,globalUnsubscribed:n}}),!0}catch(o){return i(o,"OptInModule updateCommunicationSettings"),!1}},updateVisitorEmailOptIn:async(t,e,n,o)=>{try{await a.mutate({mutation:s`
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
			`,variables:{lenderNews:t,loanUpdates:e,globalUnsubscribed:n,visitorId:o}})}catch(r){i(r,"OptInModule updateVisitorCommunicationSettings")}}});export{p as u};
