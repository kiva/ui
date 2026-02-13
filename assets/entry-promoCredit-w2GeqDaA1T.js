import{g as t}from"./entry-index-CWclSTHHJk.js";import{n as l}from"./entry-numeral-xVHG5DEP0A.js";const B=t`
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
`,$=t`
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
`;function y(e){var i,b,m,u,c,f,v,p,h,A,d,T,k,C;const o=l((m=(b=(i=e.shop)==null?void 0:i.basket)==null?void 0:b.totals)==null?void 0:m.bonusAvailableTotal).value(),a=l((f=(c=(u=e.shop)==null?void 0:u.basket)==null?void 0:c.totals)==null?void 0:f.freeTrialAvailableTotal).value(),s=l((h=(p=(v=e.shop)==null?void 0:v.basket)==null?void 0:p.totals)==null?void 0:h.redemptionCodeAvailableTotal).value(),g=l((T=(d=(A=e.shop)==null?void 0:A.basket)==null?void 0:d.totals)==null?void 0:T.universalCodeAvailableTotal).value(),r=o+a+s+g,n=l(((C=(k=e==null?void 0:e.my)==null?void 0:k.userAccount)==null?void 0:C.promoBalance)??0).value();return n>=r?n:r}function q(e){var o,a,s;return!!((o=e==null?void 0:e.shop)!=null&&o.lendingRewardOffered||(s=(a=e==null?void 0:e.shop)==null?void 0:a.basket)!=null&&s.hasFreeCredits||y(e)>0)}function x(e){var o,a,s;return e instanceof URL?((o=e.searchParams.get("fromContext"))==null?void 0:o.startsWith("/impact-dashboard"))??!1:((s=(a=e==null?void 0:e.query)==null?void 0:a.fromContext)==null?void 0:s.startsWith("/impact-dashboard"))??!1}export{P as a,y as b,q as h,x as i,$ as p,B as u};
