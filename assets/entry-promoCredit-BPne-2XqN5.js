import{g as C}from"./entry-index-CWclSTHHJk.js";import{n as v}from"./entry-numeral-xVHG5DEP0A.js";const B=C`
	fragment UserPromoBalance on My {
		id
		userAccount {
			id
			promoBalance
		}
	}
`,y=C`
	fragment BasketPromoAvailable on Shop {
		id
		basket {
			id
			hasFreeCredits
			totals {
				bonusAvailableTotal
				freeTrialAvailableTotal
				redemptionCodeAvailableTotal
				universalCodeAvailableTotal
			}
		}
		lendingRewardOffered
	}
`,F=C`
	query promoCredit($basketId: String) {
		my {
			id
			...UserPromoBalance
		}
		shop(basketId: $basketId) {
			id
			...BasketPromoAvailable
		}
	}
	${B}
	${y}
`;function I(e){var n,t,l,i,m,p,u,c,b,f,T,k,A,P;const o=v((l=(t=(n=e.shop)==null?void 0:n.basket)==null?void 0:t.totals)==null?void 0:l.bonusAvailableTotal).value(),r=v((p=(m=(i=e.shop)==null?void 0:i.basket)==null?void 0:m.totals)==null?void 0:p.freeTrialAvailableTotal).value(),a=v((b=(c=(u=e.shop)==null?void 0:u.basket)==null?void 0:c.totals)==null?void 0:b.redemptionCodeAvailableTotal).value(),h=v((k=(T=(f=e.shop)==null?void 0:f.basket)==null?void 0:T.totals)==null?void 0:k.universalCodeAvailableTotal).value(),g=o+r+a+h,s=v(((P=(A=e==null?void 0:e.my)==null?void 0:A.userAccount)==null?void 0:P.promoBalance)??0).value();return s>=g?s:g}function q(e){var s,n,t,l,i,m,p,u,c,b,f;if((s=e==null?void 0:e.shop)!=null&&s.lendingRewardOffered||(t=(n=e==null?void 0:e.shop)==null?void 0:n.basket)!=null&&t.hasFreeCredits||I(e)>0||(m=(i=(l=e==null?void 0:e.shop)==null?void 0:l.promoCampaign)==null?void 0:i.managedAccount)!=null&&m.pageId)return!0;const o=(u=(p=e==null?void 0:e.shop)==null?void 0:p.promoCampaign)==null?void 0:u.managedAccount,r=(c=o==null?void 0:o.campaignInfo)==null?void 0:c.upc,a=(b=o==null?void 0:o.strategicPartner)==null?void 0:b.partnerName,h=(f=o==null?void 0:o.strategicPartner)==null?void 0:f.partnerContentfulPage,g=h&&r?`/impact-dashboard/${h}/upc/${r}`:null;return!!(r&&a&&g)}function x(e){var o,r,a;return e instanceof URL?((o=e.searchParams.get("fromContext"))==null?void 0:o.startsWith("/impact-dashboard"))??!1:((a=(r=e==null?void 0:e.query)==null?void 0:r.fromContext)==null?void 0:a.startsWith("/impact-dashboard"))??!1}export{y as a,I as b,q as h,x as i,F as p,B as u};
