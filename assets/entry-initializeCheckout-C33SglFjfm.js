import{g,o as k}from"./entry-index-CWclSTHHJk.js";import{a as W}from"./entry-index-C1c4cvJ8FT.js";import{n as J}from"./entry-numeral-xVHG5DEP0A.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import{t as w}from"./entry-tailwind.config-CSFvy6LGkL.js";const Y=`mutation validatePreCheckout($basketId: String) {
	shop (basketId: $basketId) {
		id
		validatePreCheckout {
			error
			success
			value
		}
	}
}
`,Z={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"validatePreCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"validatePreCheckout"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"error"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"success"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:185,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:Y}}},P="Pre-checkout validation failed";async function qe({apollo:e,kvTrackEvent:i}={}){var d;const{data:n}=await e.mutate({mutation:Z}),a=(d=n==null?void 0:n.shop)==null?void 0:d.validatePreCheckout;return typeof a<"u"&&a.length===0?(i==null||i("basket","Validate Basket","Validation Success"),!0):(i==null||i("basket","Validate Basket","Validation Failure"),a)}function Pe(e=[]){return Array.isArray(e)&&e.map(({error:i,extension:n,message:a,success:d,value:t})=>t||i||a||(n==null?void 0:n.code)||(d===!1?P:"")).filter(Boolean).join(" | ")||P}const X=`mutation removeCreditByType($creditType: CreditTypeEnum!, $creditId: Int, $basketId: String) {
	shop (basketId: $basketId) {
		id
		removeCreditByType	(creditType: $creditType, creditId: $creditId)
	}
}
`,Be={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"removeCreditByType"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditType"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CreditTypeEnum"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"removeCreditByType"},arguments:[{kind:"Argument",name:{kind:"Name",value:"creditType"},value:{kind:"Variable",name:{kind:"Name",value:"creditType"}}},{kind:"Argument",name:{kind:"Name",value:"creditId"},value:{kind:"Variable",name:{kind:"Name",value:"creditId"}}}],directives:[]}]}}]}}],loc:{start:0,end:241,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:X}}},K=e=>{var i;if(typeof document<"u")return decodeURIComponent(((i=document.cookie.match(`(^|;)\\s*${e}\\s*=\\s*([^;]+)`))==null?void 0:i.pop())||"")},ee=(e,i,n="")=>{typeof document<"u"&&(document.cookie=`${e}=${encodeURIComponent(i)};${n}`)};let f=class M extends Error{constructor({code:i,original:n},...a){super(...a),Error.captureStackTrace&&Error.captureStackTrace(this,M),this.name="ShopError",this.code=i,this.original=n}aggregateErrors(i){this.errors=i}};function h(e){var i;if(e instanceof f)return e;const n=(e==null?void 0:e.code)??((i=e==null?void 0:e.extensions)==null?void 0:i.code)??(e==null?void 0:e.name)??"",a=typeof e=="string"?e:(e==null?void 0:e.message)??"";if(n==="invalidMethodParameter"&&a.includes("paymentMethod.create"))return new f({code:"paymentMethod.create.invalidMethodParameter",original:e},"There was a problem validating your payment information. Please double-check the details and try again.");if(a.includes("Invalid request: ")){const d=a.split("Invalid request: ")[1].split("., ").map(l=>l.matchAll(/[A-Z_]+: (.*)/g))[0],t=d[1],s=d[2];return new f({code:`paymentMethod.${t}`,original:e},s)}return n==="insufficientFunds"||a.includes("There is not enough credit")?new f({code:"shop.insufficientFunds",original:e},"There is not enough money to complete the checkout. Please double-check the details and try again."):a.includes("already has a Giving Fund with category")?new f({code:"shop.givingfunds.duplicateFundCreation",original:e},"You already have a giving fund supporting this group of people."):n==="shop.invalidBasketId"||n==="shop.basketRequired"||n==="shop.alreadyCheckedOut"?new f({code:n,original:e},"There was a problem with your basket. Please, refresh the page and try again."):n==="donationAmountTooLarge"?new f({code:n,original:e},a):new f({code:"shop.unknown",original:e},"An unknown error occurred.")}function L(){return K("kvbskt")}function ie(e){ee("kvbskt",e,"path=/;secure;")}async function ne(e){try{return e.mutate({mutation:g`mutation createNewBasketForUser { shop { id createBasket } }`}).then(({data:i})=>{var n;const a=((n=i.shop)==null?void 0:n.createBasket)??null;a&&ie(a)})}catch(i){throw h(i)}}let B=null;async function R(e){return B||(B=ne(e),B)}function U(e){var i;const n=(e==null?void 0:e.code)??((i=e==null?void 0:e.extensions)==null?void 0:i.code)??(e==null?void 0:e.name)??"";return["shop.invalidBasketId","shop.basketRequired","shop.alreadyCheckedOut"].includes(n)}const x=new Set;async function b(e,i,n=2){var a,d;try{const t=await e.mutate({...i,variables:{...i.variables,basketId:L()},refetchQueries:i.awaitRefetchQueries?Array.from(x):[]});if((a=t==null?void 0:t.errors)!=null&&a.length){const s=t==null?void 0:t.errors.filter(l=>U(l));if(s.length){if(n>0)return await R(e),b(e,i,n-1);throw s[0]}if((d=t==null?void 0:t.errors)!=null&&d.length)throw t.errors[0]}return t==null?void 0:t.data}catch(t){throw h(t)}}async function z(e,i,n=2){var a,d;try{const t=await e.query({...i,variables:{...i.variables,basketId:L()}});if((a=t==null?void 0:t.errors)!=null&&a.length){const s=t==null?void 0:t.errors.filter(l=>U(l));if(s.length){if(n>0)return await R(e),z(e,i,n-1);throw s[0]}if((d=t==null?void 0:t.errors)!=null&&d.length)throw t.errors[0]}return t==null?void 0:t.data}catch(t){throw h(t)}}function ae(e,i,n=2){let a=0;x.add(i.query);const d=e.watchQuery({...i,variables:{...i.variables,basketId:L()}}),t=d.subscribe.bind(d);return d.subscribe=(...s)=>{var l,c,v;let r,o,m;return typeof s[0]=="function"?[r,o,m]=s:(r=(l=s[0])==null?void 0:l.next,o=(c=s[0])==null?void 0:c.error,m=(v=s[0])==null?void 0:v.complete),t(r,u=>{var S,y;const N=(S=u==null?void 0:u.graphQLErrors)==null?void 0:S.filter(I=>U(I));N.length?a<n?R(e).then(()=>{a+=1,d.refetch({...d.variables,basketId:L()})}):o(h(N[0])):((y=u==null?void 0:u.graphQLErrors)!=null&&y.length&&o(h(u.graphQLErrors[0])),u!=null&&u.networkError&&o(h(u.networkError)))},m)},d}const te=g`query basketTotals($basketId: String) {
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
}`;function Ee(e){return ae(e,{query:te})}function Q(e){return new Promise(i=>setTimeout(i,e))}async function de(e,i,n,a){const d=Date.now()+a;let t=await e();for(;!i(t);){if(Date.now()>d)throw new Error("Polling timed out");await Q(n),t=await e()}return t}function F(){return K("uiv")}async function oe({apollo:e,transactionSagaId:i}){return e.query({query:g`
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
		`,variables:{transactionId:i,visitorId:F()},fetchPolicy:"network-only"})}async function re({apollo:e,transactionSagaId:i,interval:n=1e3,timeout:a=6e4}){return de(()=>oe({apollo:e,transactionSagaId:i}),d=>{var t;const{status:s,errorCode:l,errorMessage:c}=(t=d==null?void 0:d.data)==null?void 0:t.checkoutStatus;return!!(s==="COMPLETED"||l||c)},n,a)}g`
	mutation AddGivingFund($fund: GivingFundInput!) {
		addGivingFund(fund: $fund) {
			id
		}
	}
`;g`
	mutation AddCustomGivingFund($fund: CustomGivingFundInput!) {
		addCustomGivingFund(fund: $fund) {
			id
		}
	}
`;const se=g`
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
}`;async function le({apollo:e,emailAddress:i,emailOptIn:n,valetInviter:a}){var d;const t=await b(e,{mutation:se,variables:{visitorId:F(),email:i,emailOptIn:n,inviter:a}},0),s=((d=t==null?void 0:t.shop)==null?void 0:d.validatePreCheckout).filter(({success:l})=>!l).map(l=>h(l));if(s.length){const l=new f({code:"shop.failedCheckoutValidation"});throw l.aggregateErrors(s),l}}async function me(e){var i,n,a;return((a=(n=(i=(await e.query({query:g`
			query ftdStatus {
				my {
					id
					userAccount {
						id
						isFirstTimeDepositor
					}
				}
			}
		`})).data)==null?void 0:i.my)==null?void 0:n.userAccount)==null?void 0:a.isFirstTimeDepositor)??!1}async function ue(e,i){return new Promise((n,a)=>{let d=0;const t=e.watchQuery({query:g`
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
			`,variables:{checkoutId:i,visitorId:F(),limit:100,offset:d}});let s=[];const l=async c=>{var v,r,o,m,u,S,y,N;const I=(m=(o=(r=(v=c.data)==null?void 0:v.shop)==null?void 0:r.receipt)==null?void 0:o.items)==null?void 0:m.totalCount;if(s=s.concat((N=(y=(S=(u=c.data)==null?void 0:u.shop)==null?void 0:S.receipt)==null?void 0:y.items)==null?void 0:N.values),I>d+100){d+=100;const C=await t.fetchMore({variables:{offset:d}});try{l(C)}catch(j){a(j)}}else n(s)};t.subscribe({next:l,error:c=>{a(c)}})})}async function ce(e,i){var n,a,d;return(d=(a=(n=(await e.query({query:g`
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
		`,variables:{checkoutId:i,visitorId:F()}})).data)==null?void 0:n.shop)==null?void 0:a.receipt)==null?void 0:d.totals}async function ve(e,i,n){var a;const d=parseInt(i,10),[t,s,l]=await Promise.all([me(e),ue(e,d),ce(e,d)]),c=s.filter(o=>o.__typename==="LoanReservation"),v=s.filter(o=>o.__typename==="Donation"),r=s.filter(o=>o.__typename==="KivaCard");return{transactionId:i,itemTotal:l.itemTotal,loans:c,loanCount:c.length,loanTotal:l.loanReservationTotal,donations:v.map(({id:o,price:m,__typename:u})=>({id:o,price:m,__typename:u})),donationTotal:l.donationTotal,isTip:v.every(o=>o.isTip),isUserEdited:v.some(o=>o.isUserEdited),kivaCards:r,kivaCardCount:r.length,kivaCardTotal:l.kivaCardTotal,kivaCreditAppliedTotal:l.kivaCreditAppliedTotal,depositTotal:((a=l.depositTotals)==null?void 0:a.depositTotal)??"0.00",paymentType:n,isFTD:t}}async function ke(e){var i,n,a;const d=await z(e,{query:g`
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
		`,fetchPolicy:"network-only"},0);return(a=(n=(i=d==null?void 0:d.shop)==null?void 0:i.basket)==null?void 0:n.totals)==null?void 0:a.creditAmountNeeded}const ge=g`
	mutation creditCheckout(
		$basketId: String,
		$visitorId: String
	) {
		shop (basketId: $basketId) {
			id
			transactionId: checkoutAsync (visitorId: $visitorId)
		}
	}
`,pe=g`
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
`;function fe(e){return b(e,{mutation:ge,variables:{visitorId:F()}},0)}async function Ne({apollo:e,braintree:i,amount:n}){try{const a=await i.requestPaymentMethod();if(!a)throw new f({code:"shop.dropinNoPaymentMethod"},"No payment method returned from braintree dropin");const{nonce:d,deviceData:t,type:s}=a;return{paymentType:s,mutation:b(e,{mutation:pe,variables:{nonce:d,amount:n,savePaymentMethod:!1,deviceData:t,visitorId:F()}},0)}}catch(a){throw h(a)}}async function he(e,i,n){try{const a=await ve(e,i,n);W(a),await Q(800)}catch(a){console.error("Error tracking transaction",a)}}async function Ke({apollo:e,braintree:i,emailAddress:n,emailOptIn:a,valetInviter:d,deactivateRedirect:t}){var s,l,c,v,r;await le({apollo:e,emailAddress:n,emailOptIn:a,valetInviter:d});const o=await ke(e),m=J(o).value()>0;if(m&&!i)throw new f({code:"shop.dropinRequired"},"Braintree dropin required for credit deposit checkout");let u,S="";if(m){const C=await Ne({apollo:e,braintree:i,amount:o});S=C.paymentType,u=await C.mutation}else u=await fe(e);const y=(s=u==null?void 0:u.shop)==null?void 0:s.transactionId,N=await re({apollo:e,transactionSagaId:y,timeout:3e5});if((l=N.errors)!=null&&l.length)throw h(N.errors[0]);const I=(r=(v=(c=N.data)==null?void 0:c.checkoutStatus)==null?void 0:v.receipt)==null?void 0:r.checkoutId;if(await he(e,I,S),t)return N}const Se=()=>typeof document>"u"?null:document.cookie.split(";").map(e=>e.trim().split("=")[0]).find(e=>e&&e.indexOf("_sp_id")===0)||null;function ye(){const e=Se(),i={snowplowUserId:null,snowplowSessionId:null};if(!e)return i;const n=K(e);if(!n)return i;const a=(n==null?void 0:n.split("."))??[];return a.length>0&&(i.snowplowUserId=(a==null?void 0:a[0])??null,i.snowplowSessionId=(a==null?void 0:a[a.length-1])??null),i}const Fe=g`
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
`;async function Re({apollo:e,transactionId:i}){var n;if(!i)return!1;const{snowplowUserId:a,snowplowSessionId:d}=ye(),t=await b(e,{mutation:Fe,variables:{campaign:null,campaignContent:null,medium:null,snowplowSessionId:d,snowplowUserId:a,source:null,transactionId:i,visitorId:F()||null}},0);return!!((n=t==null?void 0:t.shop)!=null&&n.trackTransaction)}const A=k`
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
`,$=k`
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
`,_=k`
	fragment LoanProgress on LoanBasic {
		id
		loanAmount
		loanFundraisingInfo {
			id
			fundedAmount
			reservedAmount
		}
	}
`,T=k`
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
`,V=k`
    fragment KvLendCta on LoanBasic {
        id
        name
        status
        minNoteSize
    }
`,O=k`
    fragment KvLendCtaUser on LoanBasic {
        id
        userProperties {
            lentTo
        }
    }
`,D=k`
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
`,Ie=g`
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
	${V}
	${Ie}
	${q}
	${T}
	${A}
	${$}
	${_}
`;k`
	fragment KvClassicLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${O}
	${D}
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
	${V}
	${q}
	${T}
	${A}
	${$}
	${_}
`;k`
	fragment KvCompactLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
	}
	${O}
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
	${D}
	${q}
	${T}
	${A}
	${$}
	${_}
`;k`
	fragment KvIntroductionLoanCardUser on LoanBasic {
		id
		...KvLoanBookmark
	}
	${D}
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
	${T}
	${$}
`;function G(e,i,n){return(Math.random()*(i-e)+e).toFixed(n)*1}Array.from({length:20},()=>[G(-180,180,3),G(-90,90,3)]);w.colors["eco-green"].DEFAULT,w.colors.gray[200];const{colors:p}=w;p["eco-green"][3],p.marigold.DEFAULT,p["desert-rose"].DEFAULT,p.stone[3],p.brand[500],p.marigold[3],p["eco-green"][2],p.marigold[2],p["desert-rose"][2],p.stone[2],p.brand[300],p["desert-rose"][3];const{colors:H}=w;H.gray[200];H.gray[300];k`
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
	${V}
	${q}
	${T}
	${A}
	${$}
	${_}
`;k`
	fragment KvWideLoanCardUser on LoanBasic {
		id
		...KvLendCtaUser
		...KvLoanBookmark
	}
	${O}
	${D}
`;g`
	query loanSearchSuggestions {
		lend {
			loanSearchSuggestions {
				group
				label
				query
			}
		}
	}
`;const be={definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"shopTotals"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ShopTotals"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"bonusAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"bonusAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAmountNeeded"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"itemTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditRemaining"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditToReapply"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanReservationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAvailableTotal"},arguments:[],directives:[]}]}}]},$e=`#import '../../fragments/shopTotals.graphql'

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
		lendingStats {
			id
			totalAmountDeposited
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
			applyKivaCreditToDonation
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
`,E={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"initializeCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"hasEverLoggedIn"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"balance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoBalance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lendingStats"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalAmountDeposited"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lender"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"IntValue",value:"100"}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"depositIncentiveAmountToLend"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"guestCheckoutEnabled"},name:{kind:"Name",value:"featureSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"guest_checkout.enabled",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]}]}},{kind:"Field",alias:{kind:"Name",value:"admin_reward_tip_flag"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"enable_tip_for_admin_reward_lc",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hasFreeCredits"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applyKivaCreditToDonation"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"credits"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"creditsUsed"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoFund"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayDescription"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basketItemType"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanReservation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"expiryTime"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isEndingSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"matchingText"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"simultaneousMatching"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"managedAccountId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"ratio"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loanAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"minNoteSize"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"plannedExpirationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"activity"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isExpiringSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"reservedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail"}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url_2x"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail_retina"}}],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"tags"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanDirect"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"trusteeName"},arguments:[],directives:[]}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanPartner"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"partnerName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userProperties"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lentTo"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"team"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Donation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"isTip"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isUserEdited"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metadata"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"campaignId"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"KivaCard"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"idsInGroup"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"quantity"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"individualPrice"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardObject"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"deliveryType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"recipient"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"email"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"scheduledDeliveryDate"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"mailingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lastName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"address"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"zip"},arguments:[],directives:[]}]}}]}}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"totals"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"shopTotals"},directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"basketVerificationState"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lendingRewardOffered"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:2782,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:$e}}},Te=e=>{const i={};return e.filter(function(n){if(n.kind!=="FragmentDefinition")return!0;const a=n.name.value;return i[a]?!1:(i[a]=!0,!0)})};E.definitions=Te(E.definitions.concat(be.definitions));const Ce=(e,i)=>{const n=(r,o)=>{if(r.kind==="FragmentSpread")o.add(r.name.value);else if(r.kind==="VariableDefinition"){const m=r.type;m.kind==="NamedType"&&o.add(m.name.value)}return r&&"selectionSet"in r&&r.selectionSet&&r.selectionSet.selections.forEach(m=>{n(m,o)}),r&&"variableDefinitions"in r&&r.variableDefinitions&&r.variableDefinitions.forEach(m=>{n(m,o)}),r&&"definitions"in r&&r.definitions&&r.definitions.forEach(m=>{n(m,o)}),o},a=r=>{const o={};return r.definitions.forEach(function(m){"name"in m&&m.name&&(o[m.name.value]=n(m,new Set))}),o},d=(r,o)=>{for(let m=0;m<r.definitions.length;m++){const u=r.definitions[m];if(u&&"name"in u&&u.name&&u.name.value==o)return u}},t=a(e),s=Object.assign({},e,{definitions:[d(e,i)]}),l=t[i]||new Set,c=new Set;let v=new Set;for(l.forEach(r=>{v.add(r)});v.size>0;){const r=v;v=new Set,r.forEach(o=>{c.has(o)||(c.add(o),(t[o]||new Set).forEach(u=>{v.add(u)}))})}return c.forEach(r=>{const o=d(e,r);o&&s.definitions.push(o)}),s};Ce(E,"initializeCheckout");export{L as B,b as S,Be as _,f as a,Ke as b,R as c,E as d,be as e,Pe as f,re as g,te as l,Ee as r,h as u,qe as v,Re as w};
