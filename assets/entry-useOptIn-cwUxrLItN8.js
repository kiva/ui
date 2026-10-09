import{l as u}from"./entry-logReadQueryError-BL2yt7MPC5.js";import{g as l}from"./entry-index-CWclSTHHJk.js";const S=(s,d)=>{const r=(i,n)=>!(n!=null&&n.length)&&i===!0;return{updateCommunicationSettings:async(i,n,a)=>{var o;try{const{data:t,errors:e}=await s.mutate({mutation:l`
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
				`,variables:{lenderNews:i,loanUpdates:n,globalUnsubscribed:a}});return r((o=t==null?void 0:t.my)==null?void 0:o.updateCommunicationSettings,e)}catch(t){return u(t,"OptInModule updateCommunicationSettings"),!1}},updateVisitorEmailOptIn:async(i,n,a,o)=>{var t;try{const{data:e,errors:m}=await s.mutate({mutation:l`
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
			`,variables:{lenderNews:i,loanUpdates:n,globalUnsubscribed:a,visitorId:o}});return r((t=e==null?void 0:e.visitorEmailOptIn)==null?void 0:t.updateCommunicationSettings,m)}catch(e){return u(e,"OptInModule updateVisitorCommunicationSettings"),!1}}}};export{S as u};
