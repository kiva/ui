import{g as m,o as u}from"./entry-index-CWclSTHHJk.js";import{n as Z}from"./entry-numeral-xVHG5DEP0A.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import{t as F}from"./entry-tailwind.config-DnDN25xoV6.js";const _=e=>{var o;if(typeof document<"u")return decodeURIComponent(((o=document.cookie.match(`(^|;)\\s*${e}\\s*=\\s*([^;]+)`))==null?void 0:o.pop())||"")},J=(e,o,n="")=>{typeof document<"u"&&(document.cookie=`${e}=${encodeURIComponent(o)};${n}`)};let g=class D extends Error{constructor({code:o,original:n},...t){super(...t),Error.captureStackTrace&&Error.captureStackTrace(this,D),this.name="ShopError",this.code=o,this.original=n}aggregateErrors(o){this.errors=o}};function y(e){var o;if(e instanceof g)return e;const n=(e==null?void 0:e.code)??((o=e==null?void 0:e.extensions)==null?void 0:o.code)??(e==null?void 0:e.name)??"",t=typeof e=="string"?e:(e==null?void 0:e.message)??"";if(n==="invalidMethodParameter"&&t.includes("paymentMethod.create"))return new g({code:"paymentMethod.create.invalidMethodParameter",original:e},"There was a problem validating your payment information. Please double-check the details and try again.");if(t.includes("Invalid request: ")){const i=t.split("Invalid request: ")[1].split("., ").map(s=>s.matchAll(/[A-Z_]+: (.*)/g))[0],a=i[1],r=i[2];return new g({code:`paymentMethod.${a}`,original:e},r)}return n==="insufficientFunds"||t.includes("There is not enough credit")?new g({code:"shop.insufficientFunds",original:e},"There is not enough money to complete the checkout. Please double-check the details and try again."):t.includes("already has a Giving Fund with category")?new g({code:"shop.givingfunds.duplicateFundCreation",original:e},"You already have a giving fund supporting this group of people."):n==="shop.invalidBasketId"||n==="shop.basketRequired"||n==="shop.alreadyCheckedOut"?new g({code:n,original:e},"There was a problem with your basket. Please, refresh the page and try again."):n==="donationAmountTooLarge"?new g({code:n,original:e},t):new g({code:"shop.unknown",original:e},"An unknown error occurred.")}function S(){return _("kvbskt")}function X(e){J("kvbskt",e,"path=/;secure;")}async function ee(e){try{return e.mutate({mutation:m`mutation createNewBasketForUser { shop { id createBasket } }`}).then(({data:o})=>{var n;const t=((n=o.shop)==null?void 0:n.createBasket)??null;t&&X(t)})}catch(o){throw y(o)}}let U=null;async function E(e){return U||(U=ee(e),U)}function M(e){var o;const n=(e==null?void 0:e.code)??((o=e==null?void 0:e.extensions)==null?void 0:o.code)??(e==null?void 0:e.name)??"";return["shop.invalidBasketId","shop.basketRequired","shop.alreadyCheckedOut"].includes(n)}const H=new Set;async function b(e,o,n=2){var t,i;try{const a=await e.mutate({...o,variables:{...o.variables,basketId:S()},refetchQueries:o.awaitRefetchQueries?Array.from(H):[]});if((t=a==null?void 0:a.errors)!=null&&t.length){const r=a==null?void 0:a.errors.filter(s=>M(s));if(r.length){if(n>0)return await E(e),b(e,o,n-1);throw r[0]}if((i=a==null?void 0:a.errors)!=null&&i.length)throw a.errors[0]}return a==null?void 0:a.data}catch(a){throw y(a)}}async function j(e,o,n=2){var t,i;try{const a=await e.query({...o,variables:{...o.variables,basketId:S()}});if((t=a==null?void 0:a.errors)!=null&&t.length){const r=a==null?void 0:a.errors.filter(s=>M(s));if(r.length){if(n>0)return await E(e),j(e,o,n-1);throw r[0]}if((i=a==null?void 0:a.errors)!=null&&i.length)throw a.errors[0]}return a==null?void 0:a.data}catch(a){throw y(a)}}function oe(e,o,n=2){let t=0;H.add(o.query);const i=e.watchQuery({...o,variables:{...o.variables,basketId:S()}}),a=i.subscribe.bind(i);return i.subscribe=(...r)=>{var s,c,p;let f,d,h;return typeof r[0]=="function"?[f,d,h]=r:(f=(s=r[0])==null?void 0:s.next,d=(c=r[0])==null?void 0:c.error,h=(p=r[0])==null?void 0:p.complete),a(f,l=>{var I,$;const w=(I=l==null?void 0:l.graphQLErrors)==null?void 0:I.filter(T=>M(T));w.length?t<n?E(e).then(()=>{t+=1,i.refetch({...i.variables,basketId:S()})}):d(y(w[0])):(($=l==null?void 0:l.graphQLErrors)!=null&&$.length&&d(y(l.graphQLErrors[0])),l!=null&&l.networkError&&d(y(l.networkError)))},h)},i}const te=m`query basketTotals($basketId: String) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			totals {
				bonusAppliedTotal
				bonusAvailableTotal
				creditAmountNeeded
				creditAppliedTotal
				creditAvailableTotal
				donationTotal
				itemTotal
				freeTrialAppliedTotal
				freeTrialAvailableTotal
				loanReservationTotal
				kivaCardTotal
				kivaCreditAppliedTotal
				kivaCreditAvailableTotal
				kivaCreditRemaining
				kivaCreditToReapply
				redemptionCodeAppliedTotal
				redemptionCodeAvailableTotal
				universalCodeAppliedTotal
				universalCodeAvailableTotal
			}
		}
	}
}`;function Pe(e){return oe(e,{query:te})}function W(e){return new Promise(o=>setTimeout(o,e))}async function ne(e,o,n,t){const i=Date.now()+t;let a=await e();for(;!o(a);){if(Date.now()>i)throw new Error("Polling timed out");await W(n),a=await e()}return a}function k(){return _("uiv")}async function ae({apollo:e,transactionSagaId:o}){return e.query({query:m`
			query checkoutStatus($transactionId: String!, $visitorId: String) {
				checkoutStatus(transactionId: $transactionId, visitorId: $visitorId) {
					basketId
					errorCode
					errorMessage
					receipt {
						checkoutId
					}
					requestedAt
					status
					transactionId
					updatedAt
				}
			}
		`,variables:{transactionId:o,visitorId:k()},fetchPolicy:"network-only"})}async function ie({apollo:e,transactionSagaId:o,interval:n=1e3,timeout:t=6e4}){return ne(()=>ae({apollo:e,transactionSagaId:o}),i=>{var a;const{status:r,errorCode:s,errorMessage:c}=(a=i==null?void 0:i.data)==null?void 0:a.checkoutStatus;return!!(r==="COMPLETED"||s||c)},n,t)}m`
	mutation AddGivingFund($fund: GivingFundInput!) {
		addGivingFund(fund: $fund) {
			id
		}
	}
`;var G=!1,N=!1,R=!1,V=!1;function re(){return typeof window<"u"}function se(){return re()?(N=typeof window.gtag=="function",G=typeof window.snowplow=="function",R=typeof window.fbq=="function",V=typeof window.optimizely=="object",!!(N&&G)):!1}function z(e,o){R&&window.fbq("trackCustom",e,o)}function de(e){const o=e.itemTotal||"";typeof window.fbq<"u"&&typeof o<"u"&&window.fbq("track","Purchase",{currency:"USD",value:o,content_type:e.isFTD?"FirstTimeDepositor":"ReturningLender"}),e.kivaCards&&e.kivaCards.length&&z("transactionContainsKivaCards",{kivaCardTotal:e.kivaCardTotal}),e.isFTD&&typeof o<"u"&&z("firstTimeDepositorTransaction",{itemTotal:o})}function le(e){typeof window.dataLayer=="object"&&window.dataLayer.push({event:"setTransactionData",...e});const n=e.loans.concat(e.donations).concat(e.kivaCards).map(t=>({id:t.id,name:t.__typename,price:t.price,quantity:1}));window.gtag("event","purchase",{transaction_id:e.transactionId,value:e.itemTotal,currency:"USD",items:n,non_interaction:!0})}function ue(e){Number(e.depositTotal)>0&&window.optimizely.push({type:"event",eventName:"deposit",tags:{revenue:Number(e.depositTotal)*100,deposit_amount:e.depositTotal}}),Number(e.loanTotal)>0&&window.optimizely.push({type:"event",eventName:"loan_share_purchase",tags:{revenue:Number(e.loanTotal)*100,loan_share_purchase_amount:e.loanTotal}}),Number(e.donationTotal)>0&&window.optimizely.push({type:"event",eventName:"donation",tags:{revenue:Number(e.donationTotal)*100,donation_amount:e.donationTotal}})}function ce(e){if(se(),!e.transactionId)return!1;R&&de(e),N&&le(e),V&&ue(e)}const ve=m`
	mutation validatePreCheckout(
		$basketId: String,
		$email: String,
		$visitorId: String,
		$emailOptIn: Boolean,
		$inviter: InviterInput
	) {
	shop (basketId: $basketId) {
		id
		validatePreCheckout (email: $email, visitorId: $visitorId, emailOptIn: $emailOptIn, inviter: $inviter) {
			error
			success
			value
		}
	}
}`;async function me({apollo:e,emailAddress:o,emailOptIn:n,valetInviter:t}){var i;const a=await b(e,{mutation:ve,variables:{visitorId:k(),email:o,emailOptIn:n,inviter:t}},0),r=((i=a==null?void 0:a.shop)==null?void 0:i.validatePreCheckout).filter(({success:s})=>!s).map(s=>y(s));if(r.length){const s=new g({code:"shop.failedCheckoutValidation"});throw s.aggregateErrors(r),s}}async function pe(e){var o,n,t;return((t=(n=(o=(await e.query({query:m`
			query ftdStatus {
				my {
					id
					userAccount {
						id
						isFirstTimeDepositor
					}
				}
			}
		`})).data)==null?void 0:o.my)==null?void 0:n.userAccount)==null?void 0:t.isFirstTimeDepositor)??!1}async function fe(e,o){return new Promise((n,t)=>{let i=0;const a=e.watchQuery({query:m`
				query receiptItems($checkoutId: Int, $visitorId: String, $limit: Int, $offset: Int) {
					shop {
						id
						receipt(checkoutId: $checkoutId, visitorId: $visitorId) {
							id
							items(limit: $limit, offset: $offset) {
								totalCount
								values {
									id
									price
									__typename

									... on Donation {
										id
										isTip
										isUserEdited
									}
								}
							}
						}
					}
				}
			`,variables:{checkoutId:o,visitorId:k(),limit:100,offset:i}});let r=[];const s=async c=>{var p,f,d,h,l,I,$,w;const T=(h=(d=(f=(p=c.data)==null?void 0:p.shop)==null?void 0:f.receipt)==null?void 0:d.items)==null?void 0:h.totalCount;if(r=r.concat((w=($=(I=(l=c.data)==null?void 0:l.shop)==null?void 0:I.receipt)==null?void 0:$.items)==null?void 0:w.values),T>i+100){i+=100;const A=await a.fetchMore({variables:{offset:i}});try{s(A)}catch(Y){t(Y)}}else n(r)};a.subscribe({next:s,error:c=>{t(c)}})})}async function he(e,o){var n,t,i;return(i=(t=(n=(await e.query({query:m`
			query receiptTotals($checkoutId: Int, $visitorId: String) {
				shop {
					id
					receipt(checkoutId: $checkoutId, visitorId: $visitorId) {
						id
						totals {
							loanReservationTotal
							donationTotal
							kivaCardTotal
							itemTotal
							kivaCreditAppliedTotal
							depositTotals {
								depositTotal
							}
						}
					}
				}
			}
		`,variables:{checkoutId:o,visitorId:k()}})).data)==null?void 0:n.shop)==null?void 0:t.receipt)==null?void 0:i.totals}async function ge(e,o,n){var t;const i=parseInt(o,10),[a,r,s]=await Promise.all([pe(e),fe(e,i),he(e,i)]),c=r.filter(d=>d.__typename==="LoanReservation"),p=r.filter(d=>d.__typename==="Donation"),f=r.filter(d=>d.__typename==="KivaCard");return{transactionId:o,itemTotal:s.itemTotal,loans:c,loanCount:c.length,loanTotal:s.loanReservationTotal,donations:p.map(({id:d,price:h,__typename:l})=>({id:d,price:h,__typename:l})),donationTotal:s.donationTotal,isTip:p.every(d=>d.isTip),isUserEdited:p.some(d=>d.isUserEdited),kivaCards:f,kivaCardCount:f.length,kivaCardTotal:s.kivaCardTotal,kivaCreditAppliedTotal:s.kivaCreditAppliedTotal,depositTotal:((t=s.depositTotals)==null?void 0:t.depositTotal)??"0.00",paymentType:n,isFTD:a}}async function we(e){var o,n,t;const i=await j(e,{query:m`
			query creditAmountNeeded($basketId: String) {
				shop (basketId: $basketId) {
					id
					basket {
						id
						totals {
							creditAmountNeeded
						}
					}
				}
			}
		`,fetchPolicy:"network-only"},0);return(t=(n=(o=i==null?void 0:i.shop)==null?void 0:o.basket)==null?void 0:n.totals)==null?void 0:t.creditAmountNeeded}const ye=m`
	mutation creditCheckout(
		$basketId: String,
		$visitorId: String
	) {
		shop (basketId: $basketId) {
			id
			transactionId: checkoutAsync (visitorId: $visitorId)
		}
	}
`,Ie=m`
	mutation depositCheckout(
		$basketId: String,
		$amount: Money!,
		$nonce: String!,
		$savePaymentMethod: Boolean,
		$deviceData: String,
		$visitorId: String
	) {
		shop (basketId: $basketId) {
			id
			transactionId: doNoncePaymentDepositAndCheckoutAsync(
				amount: $amount,
				nonce: $nonce,
				savePaymentMethod: $savePaymentMethod,
				deviceData: $deviceData,
				visitorId: $visitorId
			)
		}
	}
`;function $e(e){return b(e,{mutation:ye,variables:{visitorId:k()}},0)}async function ke({apollo:e,braintree:o,amount:n}){try{const t=await o.requestPaymentMethod();if(!t)throw new g({code:"shop.dropinNoPaymentMethod"},"No payment method returned from braintree dropin");const{nonce:i,deviceData:a,type:r}=t;return{paymentType:r,mutation:b(e,{mutation:Ie,variables:{nonce:i,amount:n,savePaymentMethod:!1,deviceData:a,visitorId:k()}},0)}}catch(t){throw y(t)}}async function Te(e,o,n){try{const t=await ge(e,o,n);ce(t),await W(800)}catch(t){console.error("Error tracking transaction",t)}}async function Ue({apollo:e,braintree:o,emailAddress:n,emailOptIn:t,valetInviter:i,deactivateRedirect:a}){var r,s,c,p,f;await me({apollo:e,emailAddress:n,emailOptIn:t,valetInviter:i});const d=await we(e),h=Z(d).value()>0;if(h&&!o)throw new g({code:"shop.dropinRequired"},"Braintree dropin required for credit deposit checkout");let l,I="";if(h){const A=await ke({apollo:e,braintree:o,amount:d});I=A.paymentType,l=await A.mutation}else l=await $e(e);const $=(r=l==null?void 0:l.shop)==null?void 0:r.transactionId,w=await ie({apollo:e,transactionSagaId:$,timeout:3e5});if((s=w.errors)!=null&&s.length)throw y(w.errors[0]);const T=(f=(p=(c=w.data)==null?void 0:c.checkoutStatus)==null?void 0:p.receipt)==null?void 0:f.checkoutId;if(await Te(e,T,I),a)return w}const be=()=>typeof document>"u"?null:document.cookie.split(";").map(e=>e.trim().split("=")[0]).find(e=>e&&e.indexOf("_sp_id")===0)||null;function Le(){const e=be(),o={snowplowUserId:null,snowplowSessionId:null};if(!e)return o;const n=_(e);if(!n)return o;const t=(n==null?void 0:n.split("."))??[];return t.length>0&&(o.snowplowUserId=(t==null?void 0:t[0])??null,o.snowplowSessionId=(t==null?void 0:t[t.length-1])??null),o}const Ce=m`
	mutation trackTransaction(
		$campaign: String,
		$campaignContent: String,
		$medium: String,
		$snowplowUserId: String,
		$snowplowSessionId: String,
		$source: String,
		$transactionId: Int!,
		$visitorId: String
	) {
		shop {
			id
			trackTransaction(
				campaign: $campaign
				campaignContent: $campaignContent
				medium: $medium
				snowplowUserId: $snowplowUserId
				snowplowSessionId: $snowplowSessionId
				source: $source
				transactionId: $transactionId
				visitorId: $visitorId
			)
		}
	}
`;async function Fe({apollo:e,transactionId:o}){var n;if(!o)return!1;const{snowplowUserId:t,snowplowSessionId:i}=Le(),a=await b(e,{mutation:Ce,variables:{campaign:null,campaignContent:null,medium:null,snowplowSessionId:i,snowplowUserId:t,source:null,transactionId:o,visitorId:k()||null}},0);return!!((n=a==null?void 0:a.shop)!=null&&n.trackTransaction)}const B=u`
	fragment LoanCallouts on LoanBasic {
		id
		activity {
			id
			name
		}
		sector {
			id
			name
		}
		tags
		... on LoanPartner {
			partnerName
			themes
		}
	}
`,L=u`
	fragment LoanGeocode on LoanBasic {
		id
		geocode {
			city
			state
			country {
				name
				isoCode
			}
		}
	}
`,K=u`
	fragment LoanProgress on LoanBasic {
		id
		loanAmount
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
	}
`,C=u`
	fragment KvLoanUse on LoanBasic {
		id
		anonymizationLevel
		use
		loanAmount
		status
		borrowerCount
		name
		distributionModel
		whySpecial
	}
`,O=u`
    fragment KvLendCta on LoanBasic {
        id
        name
        status
        minNoteSize
    }
`,x=u`
    fragment KvLendCtaUser on LoanBasic {
        id
        userProperties {
            lentTo
        }
    }
`,q=u`
	fragment KvLoanBookmark on LoanBasic {
		id
		userProperties {
			favorited
		}
	}
`,P=u`
	fragment KvLoanTag on LoanBasic {
		id
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
		loanAmount
		matchRatio
		matchingText
		simultaneousMatching {
			managedAccountId
			displayName
			ratio
		}
		plannedExpirationDate
		... on LoanPartner {
			partnerName
		}
	}
`,Ae=m`
	fragment KvLoanActivities on LoanBasic {
		id
		name
		lenders(limit: 0) {
			totalCount
		}
		loanFundraisingInfo {
			id
			fundedAmount
		}
	}
`;u`
	fragment KvClassicLoanCard on LoanBasic {
		id
		gender
		image {
			id
			hash # for imageHash
		}
		lenders(limit: 0) {
			totalCount # for lendersNumber
		}
		loanFundraisingInfo {
			id
			fundedAmount # for amountLent
		}
		name # for borrowerName
		...KvLendCta
		...KvLoanActivities
		...KvLoanTag
		...KvLoanUse
		...LoanCallouts
		...LoanGeocode
		...LoanProgress
	}
	${O}
	${Ae}
	${P}
	${C}
	${B}
	${L}
	${K}
`;u`
	fragment KvClassicLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${x}
	${q}
`;u`
	fragment KvCompactLoanCard on LoanBasic {
		id
		image {
			id
			hash
		}
		lenders(limit: 0) {
			totalCount
		}
		loanFundraisingInfo {
			id
			fundedAmount
		}
		name
		...KvLendCta
		...KvLoanTag
		...KvLoanUse
		...LoanCallouts
		...LoanGeocode
		...LoanProgress
	}
	${O}
	${P}
	${C}
	${B}
	${L}
	${K}
`;u`
	fragment KvCompactLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
	}
	${x}
`;u`
	fragment KvIntroductionLoanCard on LoanBasic {
		id
		image {
			id
			hash # for imageHash
		}
		lenders(limit: 0) {
			totalCount # for lendersNumber
		}
		loanFundraisingInfo {
			id
			fundedAmount # for amountLent
		}
		name # for borrowerName
		status # for isFunded
		...KvLoanBookmark
		...KvLoanTag
		...KvLoanUse
		...LoanCallouts
		...LoanGeocode
		...LoanProgress
	}
	${q}
	${P}
	${C}
	${B}
	${L}
	${K}
`;u`
	fragment KvIntroductionLoanCardUser on LoanBasic {
		id
		...KvLoanBookmark
	}
	${q}
`;u`
	fragment KvLoanInfoCard on LoanBasic {
		id
		gender
		image {
			id
			hash # for imageHash
		}
		name # for borrowerName
		...KvLoanUse
		...LoanGeocode
	}
	${C}
	${L}
`;function Q(e,o,n){return(Math.random()*(o-e)+e).toFixed(n)*1}Array.from({length:20},()=>[Q(-180,180,3),Q(-90,90,3)]);F.colors["eco-green"].DEFAULT,F.colors.gray[200];const{colors:v}=F;v.gray[200];v.gray[300];v["eco-green"][3],v.marigold.DEFAULT,v["desert-rose"].DEFAULT,v.stone[3],v.brand[500],v.marigold[3],v["eco-green"][2],v.marigold[2],v["desert-rose"][2],v.stone[2],v.brand[300],v["desert-rose"][3];u`
	fragment KvWideLoanCard on LoanBasic {
		id
		image {
			id
			hash # for imageHash
		}
		name # for borrowerName
		...KvLendCta
		...KvLoanTag
		...KvLoanUse
		...LoanCallouts
		...LoanGeocode
		...LoanProgress
	}
	${O}
	${P}
	${C}
	${B}
	${L}
	${K}
`;u`
	fragment KvWideLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${x}
	${q}
`;m`
	query loanSearchSuggestions {
		lend {
			loanSearchSuggestions {
				group
				label
				query
			}
		}
	}
`;export{S as B,b as S,g as a,Ue as c,E as f,ie as g,te as l,Pe as r,y as u,Fe as w};
