import{g as N}from"./entry-index-CWclSTHHJk.js";const S=`mutation validatePreCheckout($basketId: String) {
	shop (basketId: $basketId) {
		id
		validatePreCheckout {
			error
			success
			value
		}
	}
}
`,p={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"validatePreCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"validatePreCheckout"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"error"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"success"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:185,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:S}}},v="Pre-checkout validation failed";async function V({apollo:n,kvTrackEvent:e}={}){var s;const{data:a}=await n.mutate({mutation:p}),l=(s=a==null?void 0:a.shop)==null?void 0:s.validatePreCheckout;return typeof l<"u"&&l.length===0?(e==null||e("basket","Validate Basket","Validation Success"),!0):(e==null||e("basket","Validate Basket","Validation Failure"),l)}function R(n=[]){return Array.isArray(n)&&n.map(({error:e,extension:a,message:l,success:s,value:m})=>m||e||l||(a==null?void 0:a.code)||(s===!1?v:"")).filter(Boolean).join(" | ")||v}const F=`mutation removeCreditByType($creditType: CreditTypeEnum!, $creditId: Int, $basketId: String) {
	shop (basketId: $basketId) {
		id
		removeCreditByType	(creditType: $creditType, creditId: $creditId)
	}
}
`,w={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"removeCreditByType"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditType"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CreditTypeEnum"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"creditId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"removeCreditByType"},arguments:[{kind:"Argument",name:{kind:"Name",value:"creditType"},value:{kind:"Variable",name:{kind:"Name",value:"creditType"}}},{kind:"Argument",name:{kind:"Name",value:"creditId"},value:{kind:"Variable",name:{kind:"Name",value:"creditId"}}}],directives:[]}]}}]}}],loc:{start:0,end:241,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:F}}},f=n=>{var e;if(typeof document<"u")return decodeURIComponent(((e=document.cookie.match(`(^|;)\\s*${n}\\s*=\\s*([^;]+)`))==null?void 0:e.pop())||"")},E=(n,e,a="")=>{typeof document<"u"&&(document.cookie=`${n}=${encodeURIComponent(e)};${a}`)};function y(n){return new Promise(e=>setTimeout(e,n))}async function b(n,e,a,l){const s=Date.now()+l;let m=await n();for(;!e(m);){if(Date.now()>s)throw new Error("Polling timed out");await y(a),m=await n()}return m}function h(){return f("uiv")}async function I({apollo:n,transactionSagaId:e}){return n.query({query:N`
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
		`,variables:{transactionId:e,visitorId:h()},fetchPolicy:"network-only"})}async function q({apollo:n,transactionSagaId:e,interval:a=1e3,timeout:l=6e4}){return b(()=>I({apollo:n,transactionSagaId:e}),s=>{var m;const{status:c,errorCode:k,errorMessage:u}=(m=s==null?void 0:s.data)==null?void 0:m.checkoutStatus;return!!(c==="COMPLETED"||k||u)},a,l)}const T={definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"shopTotals"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ShopTotals"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"bonusAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"bonusAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAmountNeeded"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"itemTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"freeTrialAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditRemaining"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditToReapply"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanReservationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAvailableTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAvailableTotal"},arguments:[],directives:[]}]}}]},C=`#import '../../fragments/shopTotals.graphql'

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
`,g={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"initializeCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"hasEverLoggedIn"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userAccount"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"balance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoBalance"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lendingStats"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"totalAmountDeposited"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"lender"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"IntValue",value:"100"}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"depositIncentiveAmountToLend"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"guestCheckoutEnabled"},name:{kind:"Name",value:"featureSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"guest_checkout.enabled",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]}]}},{kind:"Field",alias:{kind:"Name",value:"admin_reward_tip_flag"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"enable_tip_for_admin_reward_lc",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hasFreeCredits"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applyKivaCreditToDonation"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"credits"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"creditsUsed"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"applied"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"available"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"promoFund"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayDescription"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basketItemType"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanReservation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"expiryTime"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isEndingSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donateRepayments"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"matchingText"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"simultaneousMatching"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"managedAccountId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"ratio"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loanAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"minNoteSize"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"plannedExpirationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"activity"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isExpiringSoon"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"reservedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail"}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"url_2x"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"presetSize"},value:{kind:"EnumValue",value:"loan_thumbnail_retina"}}],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"tags"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanDirect"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"trusteeName"},arguments:[],directives:[]}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanPartner"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"sponsor_name"},name:{kind:"Name",value:"partnerName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userProperties"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lentTo"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"team"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Donation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"isTip"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isUserEdited"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metadata"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"campaignId"},arguments:[],directives:[]}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"KivaCard"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"idsInGroup"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"quantity"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"individualPrice"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardObject"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"deliveryType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"recipient"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"email"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"scheduledDeliveryDate"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"mailingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lastName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"address"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"zip"},arguments:[],directives:[]}]}}]}}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"totals"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"shopTotals"},directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"basketVerificationState"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lendingRewardOffered"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:2782,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:C}}},_=n=>{const e={};return n.filter(function(a){if(a.kind!=="FragmentDefinition")return!0;const l=a.name.value;return e[l]?!1:(e[l]=!0,!0)})};g.definitions=_(g.definitions.concat(T.definitions));const A=(n,e)=>{const a=(i,t)=>{if(i.kind==="FragmentSpread")t.add(i.name.value);else if(i.kind==="VariableDefinition"){const d=i.type;d.kind==="NamedType"&&t.add(d.name.value)}return i&&"selectionSet"in i&&i.selectionSet&&i.selectionSet.selections.forEach(d=>{a(d,t)}),i&&"variableDefinitions"in i&&i.variableDefinitions&&i.variableDefinitions.forEach(d=>{a(d,t)}),i&&"definitions"in i&&i.definitions&&i.definitions.forEach(d=>{a(d,t)}),t},l=i=>{const t={};return i.definitions.forEach(function(d){"name"in d&&d.name&&(t[d.name.value]=a(d,new Set))}),t},s=(i,t)=>{for(let d=0;d<i.definitions.length;d++){const r=i.definitions[d];if(r&&"name"in r&&r.name&&r.name.value==t)return r}},m=l(n),c=Object.assign({},n,{definitions:[s(n,e)]}),k=m[e]||new Set,u=new Set;let o=new Set;for(k.forEach(i=>{o.add(i)});o.size>0;){const i=o;o=new Set,i.forEach(t=>{u.has(t)||(u.add(t),(m[t]||new Set).forEach(r=>{o.add(r)}))})}return u.forEach(i=>{const t=s(n,i);t&&c.definitions.push(t)}),c};A(g,"initializeCheckout");export{w as _,y as a,g as b,E as c,T as d,h as e,R as f,q as g,f as t,V as v};
