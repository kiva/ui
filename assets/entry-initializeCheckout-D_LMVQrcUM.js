import{g as p,o as k}from"./entry-index-CWclSTHHJk.js";import{n as X}from"./entry-numeral-xVHG5DEP0A.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{t as E}from"./entry-tailwind.config-DnDN25xoV6.js";const ee=`mutation validatePreCheckout($basketId: String) {
	shop (basketId: $basketId) {
		id
		validatePreCheckout {
			error
			success
			value
		}
	}
}
`,ie={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"validatePreCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"validatePreCheckout"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"error"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"success"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:185,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:ee}}},P="Pre-checkout validation failed";async function Oe({apollo:e,kvTrackEvent:i}={}){var d;const{data:n}=await e.mutate({mutation:ie}),a=(d=n==null?void 0:n.shop)==null?void 0:d.validatePreCheckout;return typeof a<"u"&&a.length===0?(i==null||i("basket","Validate Basket","Validation Success"),!0):(i==null||i("basket","Validate Basket","Validation Failure"),a)}function Me(e=[]){return Array.isArray(e)&&e.map(({error:i,extension:n,message:a,success:d,value:t})=>t||i||a||(n==null?void 0:n.code)||(d===!1?P:"")).filter(Boolean).join(" | ")||P}const ne=`mutation removeCreditByType($creditType: CreditTypeEnum!, $creditId: Int, $basketId: String) {
	shop (basketId: $basketId) {
		id
		removeCreditByType	(creditType: $creditType, creditId: $creditId)
	}
}
`,ze={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"removeCreditByType"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditType"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CreditTypeEnum"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"removeCreditByType"},arguments:[{kind:"Argument",name:{kind:"Name",value:"creditType"},value:{kind:"Variable",name:{kind:"Name",value:"creditType"}}},{kind:"Argument",name:{kind:"Name",value:"creditId"},value:{kind:"Variable",name:{kind:"Name",value:"creditId"}}}],directives:[]}]}}]}}],loc:{start:0,end:241,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:ne}}},K=e=>{var i;if(typeof document<"u")return decodeURIComponent(((i=document.cookie.match(`(^|;)\\s*${e}\\s*=\\s*([^;]+)`))==null?void 0:i.pop())||"")},ae=(e,i,n="")=>{typeof document<"u"&&(document.cookie=`${e}=${encodeURIComponent(i)};${n}`)};let f=class j extends Error{constructor({code:i,original:n},...a){super(...a),Error.captureStackTrace&&Error.captureStackTrace(this,j),this.name="ShopError",this.code=i,this.original=n}aggregateErrors(i){this.errors=i}};function h(e){var i;if(e instanceof f)return e;const n=(e==null?void 0:e.code)??((i=e==null?void 0:e.extensions)==null?void 0:i.code)??(e==null?void 0:e.name)??"",a=typeof e=="string"?e:(e==null?void 0:e.message)??"";if(n==="invalidMethodParameter"&&a.includes("paymentMethod.create"))return new f({code:"paymentMethod.create.invalidMethodParameter",original:e},"There was a problem validating your payment information. Please double-check the details and try again.");if(a.includes("Invalid request: ")){const d=a.split("Invalid request: ")[1].split("., ").map(l=>l.matchAll(/[A-Z_]+: (.*)/g))[0],t=d[1],s=d[2];return new f({code:`paymentMethod.${t}`,original:e},s)}return n==="insufficientFunds"||a.includes("There is not enough credit")?new f({code:"shop.insufficientFunds",original:e},"There is not enough money to complete the checkout. Please double-check the details and try again."):a.includes("already has a Giving Fund with category")?new f({code:"shop.givingfunds.duplicateFundCreation",original:e},"You already have a giving fund supporting this group of people."):n==="shop.invalidBasketId"||n==="shop.basketRequired"||n==="shop.alreadyCheckedOut"?new f({code:n,original:e},"There was a problem with your basket. Please, refresh the page and try again."):n==="donationAmountTooLarge"?new f({code:n,original:e},a):new f({code:"shop.unknown",original:e},"An unknown error occurred.")}function C(){return K("kvbskt")}function te(e){ae("kvbskt",e,"path=/;secure;")}async function de(e){try{return e.mutate({mutation:p`mutation createNewBasketForUser { shop { id createBasket } }`}).then(({data:i})=>{var n;const a=((n=i.shop)==null?void 0:n.createBasket)??null;a&&te(a)})}catch(i){throw h(i)}}let B=null;async function U(e){return B||(B=de(e),B)}function V(e){var i;const n=(e==null?void 0:e.code)??((i=e==null?void 0:e.extensions)==null?void 0:i.code)??(e==null?void 0:e.name)??"";return["shop.invalidBasketId","shop.basketRequired","shop.alreadyCheckedOut"].includes(n)}const H=new Set;async function b(e,i,n=2){var a,d;try{const t=await e.mutate({...i,variables:{...i.variables,basketId:C()},refetchQueries:i.awaitRefetchQueries?Array.from(H):[]});if((a=t==null?void 0:t.errors)!=null&&a.length){const s=t==null?void 0:t.errors.filter(l=>V(l));if(s.length){if(n>0)return await U(e),b(e,i,n-1);throw s[0]}if((d=t==null?void 0:t.errors)!=null&&d.length)throw t.errors[0]}return t==null?void 0:t.data}catch(t){throw h(t)}}async function W(e,i,n=2){var a,d;try{const t=await e.query({...i,variables:{...i.variables,basketId:C()}});if((a=t==null?void 0:t.errors)!=null&&a.length){const s=t==null?void 0:t.errors.filter(l=>V(l));if(s.length){if(n>0)return await U(e),W(e,i,n-1);throw s[0]}if((d=t==null?void 0:t.errors)!=null&&d.length)throw t.errors[0]}return t==null?void 0:t.data}catch(t){throw h(t)}}function oe(e,i,n=2){let a=0;H.add(i.query);const d=e.watchQuery({...i,variables:{...i.variables,basketId:C()}}),t=d.subscribe.bind(d);return d.subscribe=(...s)=>{var l,c,v;let r,o,u;return typeof s[0]=="function"?[r,o,u]=s:(r=(l=s[0])==null?void 0:l.next,o=(c=s[0])==null?void 0:c.error,u=(v=s[0])==null?void 0:v.complete),t(r,m=>{var y,S;const N=(y=m==null?void 0:m.graphQLErrors)==null?void 0:y.filter(I=>V(I));N.length?a<n?U(e).then(()=>{a+=1,d.refetch({...d.variables,basketId:C()})}):o(h(N[0])):((S=m==null?void 0:m.graphQLErrors)!=null&&S.length&&o(h(m.graphQLErrors[0])),m!=null&&m.networkError&&o(h(m.networkError)))},u)},d}const re=p`query basketTotals($basketId: String) {
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
}`;function xe(e){return oe(e,{query:re})}function Y(e){return new Promise(i=>setTimeout(i,e))}async function se(e,i,n,a){const d=Date.now()+a;let t=await e();for(;!i(t);){if(Date.now()>d)throw new Error("Polling timed out");await Y(n),t=await e()}return t}function F(){return K("uiv")}async function le({apollo:e,transactionSagaId:i}){return e.query({query:p`
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
		`,variables:{transactionId:i,visitorId:F()},fetchPolicy:"network-only"})}async function ue({apollo:e,transactionSagaId:i,interval:n=1e3,timeout:a=6e4}){return se(()=>le({apollo:e,transactionSagaId:i}),d=>{var t;const{status:s,errorCode:l,errorMessage:c}=(t=d==null?void 0:d.data)==null?void 0:t.checkoutStatus;return!!(s==="COMPLETED"||l||c)},n,a)}p`
	mutation AddGivingFund($fund: GivingFundInput!) {
		addGivingFund(fund: $fund) {
			id
		}
	}
`;var x=!1,D=!1,O=!1,Z=!1;function me(){return typeof window<"u"}function ce(){return me()?(D=typeof window.gtag=="function",x=typeof window.snowplow=="function",O=typeof window.fbq=="function",Z=typeof window.optimizely=="object",!!(D&&x)):!1}function G(e,i){O&&window.fbq("trackCustom",e,i)}function ve(e){const i=e.itemTotal||"";typeof window.fbq<"u"&&typeof i<"u"&&window.fbq("track","Purchase",{currency:"USD",value:i,content_type:e.isFTD?"FirstTimeDepositor":"ReturningLender"}),e.kivaCards&&e.kivaCards.length&&G("transactionContainsKivaCards",{kivaCardTotal:e.kivaCardTotal}),e.isFTD&&typeof i<"u"&&G("firstTimeDepositorTransaction",{itemTotal:i})}function ke(e){typeof window.dataLayer=="object"&&window.dataLayer.push({event:"setTransactionData",...e});const n=e.loans.concat(e.donations).concat(e.kivaCards).map(a=>({id:a.id,name:a.__typename,price:a.price,quantity:1}));window.gtag("event","purchase",{transaction_id:e.transactionId,value:e.itemTotal,currency:"USD",items:n,non_interaction:!0})}function ge(e){Number(e.depositTotal)>0&&window.optimizely.push({type:"event",eventName:"deposit",tags:{revenue:Number(e.depositTotal)*100,deposit_amount:e.depositTotal}}),Number(e.loanTotal)>0&&window.optimizely.push({type:"event",eventName:"loan_share_purchase",tags:{revenue:Number(e.loanTotal)*100,loan_share_purchase_amount:e.loanTotal}}),Number(e.donationTotal)>0&&window.optimizely.push({type:"event",eventName:"donation",tags:{revenue:Number(e.donationTotal)*100,donation_amount:e.donationTotal}})}function pe(e){if(ce(),!e.transactionId)return!1;O&&ve(e),D&&ke(e),Z&&ge(e)}const fe=p`
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
}`;async function Ne({apollo:e,emailAddress:i,emailOptIn:n,valetInviter:a}){var d;const t=await b(e,{mutation:fe,variables:{visitorId:F(),email:i,emailOptIn:n,inviter:a}},0),s=((d=t==null?void 0:t.shop)==null?void 0:d.validatePreCheckout).filter(({success:l})=>!l).map(l=>h(l));if(s.length){const l=new f({code:"shop.failedCheckoutValidation"});throw l.aggregateErrors(s),l}}async function he(e){var i,n,a;return((a=(n=(i=(await e.query({query:p`
			query ftdStatus {
				my {
					id
					userAccount {
						id
						isFirstTimeDepositor
					}
				}
			}
		`})).data)==null?void 0:i.my)==null?void 0:n.userAccount)==null?void 0:a.isFirstTimeDepositor)??!1}async function ye(e,i){return new Promise((n,a)=>{let d=0;const t=e.watchQuery({query:p`
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
			`,variables:{checkoutId:i,visitorId:F(),limit:100,offset:d}});let s=[];const l=async c=>{var v,r,o,u,m,y,S,N;const I=(u=(o=(r=(v=c.data)==null?void 0:v.shop)==null?void 0:r.receipt)==null?void 0:o.items)==null?void 0:u.totalCount;if(s=s.concat((N=(S=(y=(m=c.data)==null?void 0:m.shop)==null?void 0:y.receipt)==null?void 0:S.items)==null?void 0:N.values),I>d+100){d+=100;const $=await t.fetchMore({variables:{offset:d}});try{l($)}catch(J){a(J)}}else n(s)};t.subscribe({next:l,error:c=>{a(c)}})})}async function Se(e,i){var n,a,d;return(d=(a=(n=(await e.query({query:p`
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
		`,variables:{checkoutId:i,visitorId:F()}})).data)==null?void 0:n.shop)==null?void 0:a.receipt)==null?void 0:d.totals}async function Fe(e,i,n){var a;const d=parseInt(i,10),[t,s,l]=await Promise.all([he(e),ye(e,d),Se(e,d)]),c=s.filter(o=>o.__typename==="LoanReservation"),v=s.filter(o=>o.__typename==="Donation"),r=s.filter(o=>o.__typename==="KivaCard");return{transactionId:i,itemTotal:l.itemTotal,loans:c,loanCount:c.length,loanTotal:l.loanReservationTotal,donations:v.map(({id:o,price:u,__typename:m})=>({id:o,price:u,__typename:m})),donationTotal:l.donationTotal,isTip:v.every(o=>o.isTip),isUserEdited:v.some(o=>o.isUserEdited),kivaCards:r,kivaCardCount:r.length,kivaCardTotal:l.kivaCardTotal,kivaCreditAppliedTotal:l.kivaCreditAppliedTotal,depositTotal:((a=l.depositTotals)==null?void 0:a.depositTotal)??"0.00",paymentType:n,isFTD:t}}async function Ie(e){var i,n,a;const d=await W(e,{query:p`
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
		`,fetchPolicy:"network-only"},0);return(a=(n=(i=d==null?void 0:d.shop)==null?void 0:i.basket)==null?void 0:n.totals)==null?void 0:a.creditAmountNeeded}const be=p`
	mutation creditCheckout(
		$basketId: String,
		$visitorId: String
	) {
		shop (basketId: $basketId) {
			id
			transactionId: checkoutAsync (visitorId: $visitorId)
		}
	}
`,Te=p`
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
`;function we(e){return b(e,{mutation:be,variables:{visitorId:F()}},0)}async function $e({apollo:e,braintree:i,amount:n}){try{const a=await i.requestPaymentMethod();if(!a)throw new f({code:"shop.dropinNoPaymentMethod"},"No payment method returned from braintree dropin");const{nonce:d,deviceData:t,type:s}=a;return{paymentType:s,mutation:b(e,{mutation:Te,variables:{nonce:d,amount:n,savePaymentMethod:!1,deviceData:t,visitorId:F()}},0)}}catch(a){throw h(a)}}async function Ce(e,i,n){try{const a=await Fe(e,i,n);pe(a),await Y(800)}catch(a){console.error("Error tracking transaction",a)}}async function Ge({apollo:e,braintree:i,emailAddress:n,emailOptIn:a,valetInviter:d,deactivateRedirect:t}){var s,l,c,v,r;await Ne({apollo:e,emailAddress:n,emailOptIn:a,valetInviter:d});const o=await Ie(e),u=X(o).value()>0;if(u&&!i)throw new f({code:"shop.dropinRequired"},"Braintree dropin required for credit deposit checkout");let m,y="";if(u){const $=await $e({apollo:e,braintree:i,amount:o});y=$.paymentType,m=await $.mutation}else m=await we(e);const S=(s=m==null?void 0:m.shop)==null?void 0:s.transactionId,N=await ue({apollo:e,transactionSagaId:S,timeout:3e5});if((l=N.errors)!=null&&l.length)throw h(N.errors[0]);const I=(r=(v=(c=N.data)==null?void 0:c.checkoutStatus)==null?void 0:v.receipt)==null?void 0:r.checkoutId;if(await Ce(e,I,y),t)return N}const Le=()=>typeof document>"u"?null:document.cookie.split(";").map(e=>e.trim().split("=")[0]).find(e=>e&&e.indexOf("_sp_id")===0)||null;function Ae(){const e=Le(),i={snowplowUserId:null,snowplowSessionId:null};if(!e)return i;const n=K(e);if(!n)return i;const a=(n==null?void 0:n.split("."))??[];return a.length>0&&(i.snowplowUserId=(a==null?void 0:a[0])??null,i.snowplowSessionId=(a==null?void 0:a[a.length-1])??null),i}const _e=p`
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
`;async function Qe({apollo:e,transactionId:i}){var n;if(!i)return!1;const{snowplowUserId:a,snowplowSessionId:d}=Ae(),t=await b(e,{mutation:_e,variables:{campaign:null,campaignContent:null,medium:null,snowplowSessionId:d,snowplowUserId:a,source:null,transactionId:i,visitorId:F()||null}},0);return!!((n=t==null?void 0:t.shop)!=null&&n.trackTransaction)}const L=k`
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
`,T=k`
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
`,A=k`
	fragment LoanProgress on LoanBasic {
		id
		loanAmount
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
	}
`,w=k`
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
`,M=k`
    fragment KvLendCta on LoanBasic {
        id
        name
        status
        minNoteSize
    }
`,z=k`
    fragment KvLendCtaUser on LoanBasic {
        id
        userProperties {
            lentTo
        }
    }
`,_=k`
	fragment KvLoanBookmark on LoanBasic {
		id
		userProperties {
			favorited
		}
	}
`,q=k`
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
`,qe=p`
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
`;k`
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
	${M}
	${qe}
	${q}
	${w}
	${L}
	${T}
	${A}
`;k`
	fragment KvClassicLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${z}
	${_}
`;k`
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
	${M}
	${q}
	${w}
	${L}
	${T}
	${A}
`;k`
	fragment KvCompactLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
	}
	${z}
`;k`
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
	${_}
	${q}
	${w}
	${L}
	${T}
	${A}
`;k`
	fragment KvIntroductionLoanCardUser on LoanBasic {
		id
		...KvLoanBookmark
	}
	${_}
`;k`
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
	${w}
	${T}
`;function Q(e,i,n){return(Math.random()*(i-e)+e).toFixed(n)*1}Array.from({length:20},()=>[Q(-180,180,3),Q(-90,90,3)]);E.colors["eco-green"].DEFAULT,E.colors.gray[200];const{colors:g}=E;g.gray[200];g.gray[300];g["eco-green"][3],g.marigold.DEFAULT,g["desert-rose"].DEFAULT,g.stone[3],g.brand[500],g.marigold[3],g["eco-green"][2],g.marigold[2],g["desert-rose"][2],g.stone[2],g.brand[300],g["desert-rose"][3];k`
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
	${M}
	${q}
	${w}
	${L}
	${T}
	${A}
`;k`
	fragment KvWideLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${z}
	${_}
`;p`
	query loanSearchSuggestions {
		lend {
			loanSearchSuggestions {
				group
				label
				query
			}
		}
	}
`;const Pe={definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"shopTotals"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ShopTotals"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"bonusAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"bonusAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAmountNeeded"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"itemTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditRemaining"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditToReapply"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanReservationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAvailableTotal"},arguments:[],directives:[]}]}}]},Be=`#import '../../fragments/shopTotals.graphql'

query initializeCheckout($basketId: String) {
	hasEverLoggedIn @client
	my {
		id
		userAccount {
			id
			balance
			promoBalance
			donateRepayments
		}
		lender {
			id
			loanCount
			teams(limit: 100){
				values {
					name
					id
				}
			}
		}
		loans {
			totalCount
		}
		depositIncentiveAmountToLend
	}
	general {
		guestCheckoutEnabled: featureSetting(key: "guest_checkout.enabled") {
			key
			value
			description
		}
		admin_reward_tip_flag: uiConfigSetting(key: "enable_tip_for_admin_reward_lc") {
			key
			value
		}
	}
	shop (basketId: $basketId) {
		id
		basket {
			id
			hasFreeCredits
			credits {
				totalCount
				values {
					amount
					applied
					available
					creditType
					id
				}
			}
			items {
				totalCount
				values {
					creditsUsed {
						amount
						applied
						available
						creditType
						id
						promoFund {
							id
							displayName
							displayDescription
						}
					}
					id
					price
					basketItemType
					... on LoanReservation {
						expiryTime
						isEndingSoon
						donateRepayments
						loan {
							id
							name
							use
							status
							matchingText
							simultaneousMatching {
								managedAccountId
								displayName
								ratio
							}
							loanAmount
							minNoteSize
							plannedExpirationDate
							sector {
								id
								name
							}
							activity {
								id
								name
							}
							geocode {
								country {
									id
									name
									isoCode
								}
							}
							loanFundraisingInfo {
								id
								isExpiringSoon
								fundedAmount
								reservedAmount
							}
							image {
								id
								url: url (presetSize: loan_thumbnail)
								url_2x: url (presetSize: loan_thumbnail_retina)
							}
							tags
							... on LoanDirect {
								sponsor_name: trusteeName
							}
							... on LoanPartner {
								sponsor_name: partnerName
								themes
							}
							gender
							userProperties {
								lentTo
							}
						}
						team {
							id
							name
						}
					}
					... on Donation {
						isTip
						isUserEdited
						metadata {
							campaignId
						}
					}
					... on KivaCard {
						id
						price
						idsInGroup
						quantity
						individualPrice
						kivaCardObject {
							deliveryType
							recipient {
								name
								email
								scheduledDeliveryDate
							}
							mailingInfo {
								firstName
								lastName
								address
								city
								state
								zip
							}
						}
					}
				}
			}
			totals {
				...shopTotals
			}
		}
		basketVerificationState
		lendingRewardOffered
	}
}
`,R={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"initializeCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"hasEverLoggedIn"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"balance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoBalance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lender"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"IntValue",value:"100"}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"depositIncentiveAmountToLend"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"guestCheckoutEnabled"},name:{kind:"Name",value:"featureSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"guest_checkout.enabled",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]}]}},{kind:"Field",alias:{kind:"Name",value:"admin_reward_tip_flag"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"enable_tip_for_admin_reward_lc",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hasFreeCredits"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"credits"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"creditsUsed"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoFund"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayDescription"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basketItemType"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanReservation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"expiryTime"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isEndingSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"matchingText"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"simultaneousMatching"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"managedAccountId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"ratio"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loanAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"minNoteSize"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"plannedExpirationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"activity"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isExpiringSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"reservedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail"}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url_2x"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail_retina"}}],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"tags"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanDirect"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"trusteeName"},arguments:[],directives:[]}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanPartner"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"partnerName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userProperties"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lentTo"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"team"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Donation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"isTip"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isUserEdited"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metadata"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"campaignId"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"KivaCard"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"idsInGroup"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"quantity"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"individualPrice"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardObject"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"deliveryType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"recipient"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"email"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"scheduledDeliveryDate"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"mailingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lastName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"address"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"zip"},arguments:[],directives:[]}]}}]}}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"totals"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"shopTotals"},directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"basketVerificationState"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lendingRewardOffered"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:2702,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:Be}}},Ee=e=>{const i={};return e.filter(function(n){if(n.kind!=="FragmentDefinition")return!0;const a=n.name.value;return i[a]?!1:(i[a]=!0,!0)})};R.definitions=Ee(R.definitions.concat(Pe.definitions));const De=(e,i)=>{const n=(r,o)=>{if(r.kind==="FragmentSpread")o.add(r.name.value);else if(r.kind==="VariableDefinition"){const u=r.type;u.kind==="NamedType"&&o.add(u.name.value)}return r&&"selectionSet"in r&&r.selectionSet&&r.selectionSet.selections.forEach(u=>{n(u,o)}),r&&"variableDefinitions"in r&&r.variableDefinitions&&r.variableDefinitions.forEach(u=>{n(u,o)}),r&&"definitions"in r&&r.definitions&&r.definitions.forEach(u=>{n(u,o)}),o},a=r=>{const o={};return r.definitions.forEach(function(u){"name"in u&&u.name&&(o[u.name.value]=n(u,new Set))}),o},d=(r,o)=>{for(let u=0;u<r.definitions.length;u++){const m=r.definitions[u];if(m&&"name"in m&&m.name&&m.name.value==o)return m}},t=a(e),s=Object.assign({},e,{definitions:[d(e,i)]}),l=t[i]||new Set,c=new Set;let v=new Set;for(l.forEach(r=>{v.add(r)});v.size>0;){const r=v;v=new Set,r.forEach(o=>{c.has(o)||(c.add(o),(t[o]||new Set).forEach(m=>{v.add(m)}))})}return c.forEach(r=>{const o=d(e,r);o&&s.definitions.push(o)}),s};De(R,"initializeCheckout");export{C as B,b as S,ze as _,f as a,U as b,Ge as c,R as d,Me as f,ue as g,re as l,xe as r,h as u,Oe as v,Qe as w};
