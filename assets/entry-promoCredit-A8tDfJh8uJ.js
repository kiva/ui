import{g as t,n as l}from"./entry-numeral-DJCTM12wUX.js";const B=t`
	fragment UserPromoBalance on My {
		id
		userAccount {
			id
			promoBalance
		}
	}
`,P=t`
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
`,I=t`
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
	${P}
`;function y(e){var i,b,m,u,c,f,v,p,h,A,d,T,k,C;const a=l((m=(b=(i=e.shop)==null?void 0:i.basket)==null?void 0:b.totals)==null?void 0:m.bonusAvailableTotal).value(),o=l((f=(c=(u=e.shop)==null?void 0:u.basket)==null?void 0:c.totals)==null?void 0:f.freeTrialAvailableTotal).value(),s=l((h=(p=(v=e.shop)==null?void 0:v.basket)==null?void 0:p.totals)==null?void 0:h.redemptionCodeAvailableTotal).value(),g=l((T=(d=(A=e.shop)==null?void 0:A.basket)==null?void 0:d.totals)==null?void 0:T.universalCodeAvailableTotal).value(),r=a+o+s+g,n=l(((C=(k=e==null?void 0:e.my)==null?void 0:k.userAccount)==null?void 0:C.promoBalance)??0).value();return n>=r?n:r}function $(e){var a,o,s;return!!((a=e==null?void 0:e.shop)!=null&&a.lendingRewardOffered||(s=(o=e==null?void 0:e.shop)==null?void 0:o.basket)!=null&&s.hasFreeCredits||y(e)>0)}function q(e){var a,o,s;return e instanceof URL?((a=e.searchParams.get("fromContext"))==null?void 0:a.startsWith("/impact-dashboard"))??!1:((s=(o=e==null?void 0:e.query)==null?void 0:o.fromContext)==null?void 0:s.startsWith("/impact-dashboard"))??!1}export{P as a,y as b,$ as h,q as i,I as p,B as u};
