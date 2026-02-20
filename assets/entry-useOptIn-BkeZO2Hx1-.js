import{l as r}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{g as u}from"./entry-index-CWclSTHHJk.js";const s="kvemailopt",O=(o,n)=>({setMailUpdatesOptOutCookie:t=>{t?n.set(s,"true"):n.remove(s)},updateCommunicationSettings:async(t,a,e)=>{try{return await o.mutate({mutation:u`
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
				`,variables:{lenderNews:t,loanUpdates:a,globalUnsubscribed:e}}),!0}catch(i){return r(i,"OptInModule updateCommunicationSettings"),!1}},updateVisitorEmailOptIn:async(t,a,e,i)=>{try{await o.mutate({mutation:u`
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
			`,variables:{lenderNews:t,loanUpdates:a,globalUnsubscribed:e,visitorId:i}})}catch(l){r(l,"OptInModule updateVisitorCommunicationSettings")}},userHasMailUpdatesOptOut:()=>{var e;let t=!1;const a=(e=n.get(s))==null?void 0:e.trim();return/(\b|&)true(\b|&)/.test(a)&&(t=!0),t}});export{O as u};
