import{t as me,j as d,g as r,w as ue,c as _,m as ce,u as a,q as T,z as N,a as C,H as pe,I as ve,C as c,A as ke,b as I,o as s,M as D,J as ge,L as fe}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import{g as R}from"./entry-KvButton-BA7nBLyz1b.js";import{z as Ne}from"./entry-KvCarousel-Dw4gUt9u7G.js";import{M as ye}from"./entry-KvLightbox-y8nxBJS-RZ.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as be}from"./entry-JournalUpdateCard-BNsOGRy6C5.js";import{S as Fe}from"./entry-ShareButton-Cd2Ioe_1wr.js";import{u as Se}from"./entry-useIsMobile-Cv5_qjK3ot.js";import{M as he}from"./entry-useBadgeModal-edgCU2M7Bh.js";import{C as _e}from"./entry-CheckoutReceipt-ob2Lk5JU2e.js";import{a as Te}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as Ce}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvLoadingSpinner-CpYE5b1xV2.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-BorrowerImage-CdYtz78wPt.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvUserAvatar-DmX-R6-wYd.js";import"./entry-KvLoadingPlaceholder-B_9_tltQhY.js";import"./entry-loanUtils-DSoWkICHcw.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-index-CGacd2nhU3.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-KvSocialShareButton-CuCqxeJm3e.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-stringParserUtils-DNVsfKTBwa.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-useBadgeData-Bo50EdUMyn.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-KvIcon-BUhAos7YaB.js";import"./iframe-Cc_r_Bkf.js";import"./entry-KvTooltip-CaRc32kHXv.js";import"./entry-KvThemeProvider-BF4_ArwXOx.js";const Ie=`query checkoutReceipt($checkoutId: Int!, $visitorId: String) {
	shop {
		id
		receipt(checkoutId: $checkoutId, visitorId: $visitorId) {
			id
			transactionTime
			credits {
				values {
					id
					creditType
					amount
				}
			}
			totals {
				bonusAppliedTotal
				itemTotal
				donationTotal
				kivaCardTotal
				depositTotals {
					depositTotal
					kivaCreditAdded
					kivaCreditUsed
				}
				freeTrialAppliedTotal
				kivaCreditAppliedTotal
				redemptionCodeAppliedTotal
				universalCodeAppliedTotal
			}
			hasFreeCredits
			items {
				totalCount
				values {
					id
					price
					basketItemType
					... on KivaCard {
						individualPrice
						basketItemType
						kivaCardObject {
							redemptionCode
							deliveryType
							mailingInfo {
								firstName
								lastName
								address
								address2
								city
								state
								zip
							}
							recipient {
								name
								email
							}
						}
					}
					... on LoanReservation {
						loan {
							name
							id
							image {
								id
								url
								default: url(customSize: "w480h300")
								hash
							}
							use
							fundraisingPercent @client
							fundraisingTimeLeft @client
							fundraisingTimeLeftMilliseconds @client
							plannedExpirationDate
							geocode {
								city
								country {
									id
									name
									isoCode
									region
								}
							}
							loanAmount
							loanFundraisingInfo {
								id
								fundedAmount
								reservedAmount
							}
							distributionModel
							unreservedAmount @client
							inPfp
							gender
							tags
							... on LoanPartner {
								themes
							}
						}
						team {
							id
							teamPublicId
							name
						}
					}
				}
			}
		}
	}
}
`,Le={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"checkoutReceipt"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"checkoutId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"visitorId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"receipt"},arguments:[{kind:"Argument",name:{kind:"Name",value:"checkoutId"},value:{kind:"Variable",name:{kind:"Name",value:"checkoutId"}}},{kind:"Argument",name:{kind:"Name",value:"visitorId"},value:{kind:"Variable",name:{kind:"Name",value:"visitorId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"transactionTime"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"credits"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"creditType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"amount"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"totals"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"bonusAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"itemTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"donationTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"depositTotals"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"depositTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAdded"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditUsed"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"freeTrialAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCreditAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"redemptionCodeAppliedTotal"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"universalCodeAppliedTotal"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"hasFreeCredits"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basketItemType"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"KivaCard"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"individualPrice"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basketItemType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"kivaCardObject"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"redemptionCode"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"deliveryType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"mailingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"firstName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lastName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"address"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"address2"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"zip"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"recipient"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"email"},arguments:[],directives:[]}]}}]}}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanReservation"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"StringValue",value:"w480h300",block:!1}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundraisingPercent"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"fundraisingTimeLeft"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"fundraisingTimeLeftMilliseconds"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"plannedExpirationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"region"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"loanAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"reservedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"distributionModel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"unreservedAmount"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"inPfp"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"tags"},arguments:[],directives:[]},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanPartner"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"team"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"teamPublicId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}}]}}]}}]}}]}}]}}],loc:{start:0,end:1803,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:Ie}}},we={key:0},Ae={key:"view-more-card",class:"tw-flex tw-items-center tw-h-full tw-pl-4"},Me=["innerHTML"],L={__name:"JournalUpdatesCarousel",props:{loan:{type:Object,default:()=>({})},updates:{type:Array,default:()=>[]},lender:{type:Object,default:()=>({})},totalUpdates:{type:Number,default:0},updatesLoading:{type:Boolean,default:!1},controlsTopRight:{type:Boolean,default:!1}},emits:["load-more-updates"],setup(t,{emit:p}){const o=I("$kvTrackEvent"),v=t,K=I("cookieStore"),Z=I("apollo"),{loan:m,updates:l,totalUpdates:U}=me(v),Q=p,S=d(!1),k=d(0),x=d(""),V=d(""),h=d(!1),P=d(0),g=d(null);let f=3;const{isMobile:W}=Se(he),j=r(()=>{var i;return((i=m.value)==null?void 0:i.inPfp)??!1}),X=r(()=>j.value?"social_share_bp_pfp":"social_share_bp"),Y=r(()=>{var i;return((i=m.value)==null?void 0:i.pfpMinLenders)??0}),ee=r(()=>{var i,e;return((e=(i=m.value)==null?void 0:i.lenders)==null?void 0:e.numLenders)??0}),ie=r(()=>{var i;return((i=l.value)==null?void 0:i.length)<U.value}),ae=r(()=>W.value?"90%":"422px"),ne=async()=>{var n,u;const i=l.value.find(re=>re.id===k.value),e=await Z.query({query:Le,variables:{checkoutId:i.id,visitorId:K.get("uiv")||null}});g.value=((u=(n=e==null?void 0:e.data)==null?void 0:n.shop)==null?void 0:u.receipt)??null},te=async i=>{k.value=i;const e=v.updates.find(n=>n.id===i);x.value=e.subject,V.value=e.body,e!=null&&e.isTransaction&&await ne(),S.value=!0},de=()=>{S.value=!1,g.value=null,o("portfolio","click","borrower-update-lightbox-closed",k.value)},se=()=>{h.value=!0,o("portfolio","click","borrower-update-share",k.value)},oe=()=>{o("portfolio","click","update-carousel")},le=()=>{o("portfolio","click","borrower-update-load-more"),Q("load-more-updates")};return ue(()=>l,i=>{var e,n;i.value.length&&o("portfolio","view","At least one journal update viewed"),f>0&&f!==((e=i.value)==null?void 0:e.length)&&(P.value=f-1),f=((n=i.value)==null?void 0:n.length)??0},{deep:!0}),(i,e)=>a(l).length>0?(s(),_("div",we,[e[3]||(e[3]=T("h3",{class:"tw-mt-4 tw-mb-2"}," Updates ",-1)),(s(),N(a(Ne),{class:ke(["tw-w-full updates-carousel",{"tw--mt-6":t.controlsTopRight}]),key:a(l).length,"multiple-slides-visible":!0,"slides-to-scroll":"visible","slide-max-width":ae.value,"embla-options":{loop:!1,startIndex:P.value,align:"start"},"controls-top-right":t.controlsTopRight,onInteractCarousel:oe},pe({_:2},[ve(a(l),(n,u)=>({name:`slide${u}`,fn:c(()=>[C(a(be),{loan:a(m),update:n,"update-number":`${a(U)-u}`,onReadMoreClicked:te,onShareLoanClicked:se},null,8,["loan","update","update-number"])])})),t.updatesLoading?void 0:{name:"view-more",fn:c(()=>[(s(),_("div",Ae,[ie.value?(s(),N(a(R),{key:0,class:"tw-mt-2 tw-whitespace-nowrap",variant:"secondary",onClick:le},{default:c(()=>e[1]||(e[1]=[D(" Load more ")]),void 0,!0),_:1,__:[1]})):(s(),N(a(R),{key:1,class:"tw-mt-2 tw-whitespace-nowrap",variant:"secondary",to:"/portfolio",tag:"router-link"},{default:c(()=>e[2]||(e[2]=[D(" View portfolio ")]),void 0,!0),_:1,__:[2]}))]))]),key:"0"}]),1032,["class","slide-max-width","embla-options","controls-top-right"])),C(a(ye),{visible:S.value,title:"",onLightboxClosed:de},{default:c(()=>[g.value?(s(),N(a(_e),{key:0,lender:t.lender,receipt:g.value,"enable-kiva-card-tracking":"",class:"tw-pt-2"},null,8,["lender","receipt"])):(s(),_(ge,{key:1},[T("p",null,fe(x.value),1),T("span",{innerHTML:V.value},null,8,Me)],64))],void 0),_:1},8,["visible"]),C(a(Fe),{class:"tw-block !tw-w-auto",loan:a(m),variant:"hidden",lender:t.lender,campaign:X.value,"in-pfp":j.value,"pfp-min-lenders":Y.value,"num-lenders":ee.value,"open-lightbox":h.value,onLightboxClosed:e[0]||(e[0]=n=>h.value=!1)},null,8,["loan","lender","campaign","in-pfp","pfp-min-lenders","num-lenders","open-lightbox"])])):ce("",!0)}};L.__docgenInfo={exportName:"default",displayName:"JournalUpdatesCarousel",description:"",tags:{},props:[{name:"loan",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"updates",type:{name:"array"},defaultValue:{func:!1,value:"[]"}},{name:"lender",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"totalUpdates",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"updatesLoading",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"controlsTopRight",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],events:[{name:"load-more-updates"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/JournalUpdatesCarousel.vue"]};const Ti={title:"MyKiva/JournalUpdatesCarousel",component:L},w=[{__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}},{__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}},{__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}},{__typename:"Update",id:1392249,body:"<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",subject:"Moses is happy.",date:"2025-02-07T10:16:49Z",loan:{__typename:"LoanPartner",id:2722925,name:"Moses",status:"fundraising",loanAmount:"1850.00",loanFundraisingInfo:{__typename:"LoanFundraisingInfo",fundedAmount:"150.00",reservedAmount:"0.00"},image:{__typename:"Image",id:5423429,hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{__typename:"Geocode",country:{__typename:"Country",id:1,name:"Uganda"}}}}],A={id:1017469,public:!0,inviterName:"Test User"},M=(t={})=>{const p=(o,{argTypes:v})=>({props:Object.keys(v),components:{JournalUpdatesCarousel:L},mixins:[Te(),Ce()],setup(){return{args:t}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <div class="tw-bg-eco-green-1 tw-p-1">
                <journal-updates-carousel v-bind="args" />
            </div>
        `});return p.args=t,p},y=M({updates:w,lender:A,totalUpdates:4}),b=M({updates:w,lender:A,totalUpdates:6}),F=M({updates:[w[0]],lender:A,totalUpdates:1});var $,B,O;y.parameters={...y.parameters,docs:{...($=y.parameters)==null?void 0:$.docs,source:{originalSource:`story({
  updates,
  lender,
  totalUpdates: 4
})`,...(O=(B=y.parameters)==null?void 0:B.docs)==null?void 0:O.source}}};var E,q,z;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  updates,
  lender,
  totalUpdates: 6
})`,...(z=(q=b.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var H,J,G;F.parameters={...F.parameters,docs:{...(H=F.parameters)==null?void 0:H.docs,source:{originalSource:`story({
  updates: [updates[0]],
  lender,
  totalUpdates: 1
})`,...(G=(J=F.parameters)==null?void 0:J.docs)==null?void 0:G.source}}};const Ci=["Default","LoadMore","SingleUpdate"];export{y as Default,b as LoadMore,F as SingleUpdate,Ci as __namedExportsOrder,Ti as default};
