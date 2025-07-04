import{n as D,g as K}from"./entry-numeral-DJCTM12wUX.js";import{p as U,t as M}from"./entry-time-left-mixin-uDnxYTFHu3.js";import{F as O}from"./entry-FundraisingStatusMeter-Cr3NXjDvqq.js";import{K as V}from"./entry-KvLoadingParagraph-BByqi_i6WM.js";import{_ as F}from"./entry-basketItems-AJqL_yrdZS.js";import{_ as E}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{_ as z}from"./entry-KvButton-DXf6qmENM5.js";import{K as P}from"./entry-KvIcon-BnReUziL2H.js";import{K as W}from"./entry-KvLoadingSpinner-D1xFuzANIX.js";import{E as u,f as c,d as l,I as S,b as k,n as j,r as d,o as i,g as w,F as m,a as p,e as r,c as v,G as h,K as f}from"./entry-vue.esm-bundler-D5m7h15tzB.js";import{_ as I}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{w as x,a as C}from"./entry-exports-CudK1O5XNw.js";import{D as G}from"./entry-mdi-Jyy_kRgyKq.js";import{w as H}from"./entry-KvMaterialIcon-BLPGYhAoqx.js";import"./entry-KvSecondaryNav-DRnkkPAFON.js";import{_ as J}from"./entry-KvLoadingPlaceholder-DqQtKDngqv.js";import{j as X}from"./entry-KvFlag-DpOkyUkyqN.js";const R={name:"LendButton2",inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:null},isInBasket:{type:Boolean,default:!1},isLentTo:{type:Boolean,default:!1},price:{type:[Number,String],default:25}},components:{KvButton:z,KvIcon:P,KvLoadingSpinner:W},data(){return{isAdding:!1}},computed:{state(){return this.isAdding?"adding":this.isInBasket?"basketed":this.isLentTo?"lent-to":"lend"},showLend(){return this.state==="lend"},showLendAgain(){return this.state==="lent-to"},showAdding(){return this.state==="adding"},showCheckout(){return this.state==="basketed"}},methods:{addToBasket(){const e=D(this.price).format("0.00");this.isAdding=!0,this.apollo.mutate({mutation:E,variables:{loanId:this.loanId,price:e},optimisticResponse:{__typename:"Mutation",shop:{__typename:"ShopMutation",updateLoanReservation:{__typename:"LoanReservation",id:this.loanId,price:e}}},awaitRefetchQueries:!0,refetchQueries:[{query:F,variables:{basketId:this.cookieStore.get("kvbskt")}}]}).then(t=>{this.isAdding=!1,t.error&&this.handleError(t.error)}).catch(t=>{this.isAdding=!1,this.handleError(t)})},handleError(e){console.error(e),this.$showTipMsg("There was a problem adding the loan to your basket","error");try{x(t=>{t.setTag("loan_id",this.loanId),C(e)})}catch{}}}};function Y(e,t,n,g,o,a){const s=d("kv-button"),_=d("kv-loading-spinner"),b=d("kv-icon"),y=S("kv-track-event");return a.showLend||a.showLendAgain?u((i(),c(s,{key:0,onClick:a.addToBasket,class:j({secondary:a.showLendAgain})},{default:k(()=>[a.showLend?w(e.$slots,"default",{key:0},()=>[t[0]||(t[0]=m(" Lend now "))],!0):l("",!0),a.showLendAgain?w(e.$slots,"lent-to",{key:1},()=>[t[1]||(t[1]=m(" Lend again "))],!0):l("",!0)],void 0),_:3},8,["onClick","class"])),[[y,["Lending","Add to basket","lend-button-click",n.loanId,n.loanId]]]):a.showAdding?(i(),c(s,{key:1,class:"lend-button__adding"},{default:k(()=>[w(e.$slots,"adding",{},()=>[p(_),t[2]||(t[2]=r("span",null,"Adding to Basket",-1))],!0)],void 0),_:3})):a.showCheckout?u((i(),c(s,{key:2,class:"secondary",to:"/basket"},{default:k(()=>[w(e.$slots,"checkout",{},()=>[p(b,{class:"icon",name:"checkmark"}),t[3]||(t[3]=r("span",null,"Checkout now",-1))],!0)],void 0),_:3})),[[y,["Lending","click-Read more","checkout-now-button-click",n.loanId,n.loanId]]]):l("",!0)}const Z=I(R,[["render",Y],["__scopeId","data-v-1f6fe4e1"]]);R.__docgenInfo={displayName:"LendButton2",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"null"}},{name:"isInBasket",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"isLentTo",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"price",type:{name:"number|string"},defaultValue:{func:!1,value:"25"}}],slots:[{name:"default"},{name:"lent-to"},{name:"adding"},{name:"checkout"}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/Buttons/LendButton2.vue"]};const B={name:"WhySpecial",props:{text:{type:String,required:!0}},components:{KvMaterialIcon:H},data(){return{mdiStar:G}}},$={class:"tw-flex tw-items-stretch tw-flex-nowrap tw-overflow-hidden tw-border tw-border-tertiary tw-rounded tw-w-full tw-mb-2"},ee={class:"tw-bg-tertiary tw-p-1 tw-flex-shrink-0 tw-flex tw-items-center"},te={class:"tw-bg-primary tw-p-2 tw-flex-1"};function ae(e,t,n,g,o,a){const s=d("kv-material-icon");return i(),v("div",$,[r("div",ee,[p(s,{icon:o.mdiStar,class:"tw-w-3 tw-h-3 tw-fill-current tw-text-primary-inverse"},null,8,["icon"])]),r("p",te,[t[0]||(t[0]=r("strong",null,"This loan is special because",-1)),m(" "+h(n.text),1)])])}const ne=I(B,[["render",ae]]);B.__docgenInfo={displayName:"WhySpecial",exportName:"default",description:"",tags:{},props:[{name:"text",type:{name:"string"},required:!0}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/WhySpecial.vue"]};const L=K`query recLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
	lend {
		loan(id: $loanId) {
			id
			geocode {
				country {
					id
					name
					isoCode
				}
			}
			image {
				id
				default: url(customSize: "w480h300")
				retina: url(customSize: "w960h600")
			}
			name
			sector {
				id
				name
			}
			whySpecial

			# for isLentTo
			userProperties {
				lentTo
			}

			# for fullLoanUse
			anonymizationLevel
			borrowerCount
			loanAmount
			status
			use
			fullLoanUse(maxLength: 100) @client

			# for percent-raised-mixin
			loanFundraisingInfo {
				id
				fundedAmount
				reservedAmount
			}

			# for time-left-mixin
			plannedExpirationDate
		}
	}
}`,N={name:"RecommendedLoanCard",props:{loanId:{type:Number,required:!0}},inject:["apollo","cookieStore"],mixins:[U,M],components:{FundraisingStatusMeter:O,KvFlag:X,KvLoadingPlaceholder:J,KvLoadingParagraph:V,LendButton:Z,WhySpecial:ne},data(){return{loan:null,basketItems:null,isLoading:!1,queryObserver:null}},computed:{borrowerName(){var e;return((e=this.loan)==null?void 0:e.name)||""},countryISO(){var e,t,n;return((n=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:n.isoCode)||""},countryName(){var e,t,n;return((n=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:n.name)||""},imageRetinaUrl(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.retina)||""},imageUrl(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.default)||""},isInBasket(){return Array.isArray(this.basketItems)?this.basketItems.filter(n=>n.__typename==="LoanReservation").map(n=>n.id).indexOf(this.loanId)>-1:!1},isLentTo(){var e,t;return(t=(e=this.loan)==null?void 0:e.userProperties)==null?void 0:t.lentTo},loanUse(){var e;return((e=this.loan)==null?void 0:e.fullLoanUse)??""},sectorName(){var e,t;return(((t=(e=this.loan)==null?void 0:e.sector)==null?void 0:t.name)||"").toLowerCase()},whySpecial(){var t;const e=((t=this.loan)==null?void 0:t.whySpecial)||"";return e.toString().charAt(0).toLowerCase()+e.toString().slice(1)}},methods:{prefetchLoanData(){return this.loan||(this.isLoading=!0),this.apollo.query({variables:{loanId:this.loanId},query:L}).then(e=>{this.processQueryResult(e)})},readLoanData(){try{const e=this.apollo.readQuery({query:L,variables:{basketId:this.cookieStore.get("kvbskt"),loanId:this.loanId}});e.lend?this.processQueryResult({data:e}):this.isLoading=!0}catch{this.isLoading=!0}},watchQueryLoanData(){this.queryObserver=this.apollo.watchQuery({query:L,variables:{basketId:this.cookieStore.get("kvbskt"),loanId:this.loanId}}),this.queryObserver.subscribe({next:e=>this.processQueryResult(e),error:e=>this.processQueryResult({error:e})})},processQueryResult(e){var t,n,g,o,a,s;if(e.error){console.error(e.error),this.$showTipMsg("There was a problem loading your loan recommendations","error");try{x(_=>{_.setTag("wizard_stage","results"),_.setTag("loan_id",this.loanId),C(e.error)})}catch{}}this.isLoading=!1,this.loan=((n=(t=e.data)==null?void 0:t.lend)==null?void 0:n.loan)||null,this.basketItems=((s=(a=(o=(g=e.data)==null?void 0:g.shop)==null?void 0:o.basket)==null?void 0:a.items)==null?void 0:s.values)||null}},serverPrefetch(){return this.prefetchLoanData()},created(){typeof window<"u"&&(this.readLoanData(),this.watchQueryLoanData())},watch:{loanId(e){this.queryObserver&&this.queryObserver.setVariables({basketId:this.cookieStore.get("kvbskt"),loanId:e})}}},oe=["id"],re={class:"rec-loan-card__sector"},se={class:"tw-text-brand tw-font-book"},ie={class:"tw-text-brand tw-font-book"},le={class:"rec-loan-card__card"},de={class:"rec-loan-card__image-wrapper"},ce=["srcset","src","alt"],ue={class:"rec-loan-card__image-overlay"},me={key:0,class:"rec-loan-card__country-flag"},_e={class:"rec-loan-card__time-left"},he={class:"rec-loan-card__amount-left"},pe={class:"rec-loan-card__summary"},fe={class:"rec-loan-card__loan-use tw-mb-1.5"};function ge(e,t,n,g,o,a){const s=d("kv-loading-placeholder"),_=d("kv-flag"),b=d("fundraising-status-meter"),y=d("kv-loading-paragraph"),A=d("router-link"),q=d("why-special"),T=d("lend-button"),Q=S("kv-track-event");return i(),v("div",{class:"rec-loan-card",id:`${n.loanId}-loan-card`},[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__sector rec-loan-card__sector--loading"})):l("",!0),u(r("div",re,[t[0]||(t[0]=m(" A loan for ")),r("strong",se,h(a.sectorName),1),t[1]||(t[1]=m(" in ")),r("strong",ie,h(a.countryName),1)],512),[[f,!o.isLoading]]),r("div",le,[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__image-wrapper tw-bg-tertiary rec-loan-card__image-wrapper--loading"})):l("",!0),u(r("div",de,[a.imageUrl?(i(),v("img",{key:0,class:"rec-loan-card__image",srcset:a.imageRetinaUrl+" 2x",src:a.imageUrl,alt:"photo of "+a.borrowerName,loading:"lazy"},null,8,ce)):l("",!0),r("div",ue,[a.countryISO?(i(),v("div",me,[p(_,{country:a.countryISO,name:a.countryName,"aspect-ratio":"1x1"},null,8,["country","name"])])):l("",!0),r("span",_e,h(e.timeLeftMessage),1),r("span",he,h(e.$filters.numeral(e.amountLeftWithoutReservation,"$0,0"))+" to go ",1)])],512),[[f,!o.isLoading]]),p(b,{class:"medium square","percent-raised":e.percentRaised},null,8,["percent-raised"]),r("div",pe,[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__name tw-text-h3 rec-loan-card__name--loading"})):l("",!0),u(r("h2",{class:"rec-loan-card__name tw-text-h3 tw-mb-1"},h(a.borrowerName),513),[[f,!o.isLoading]]),o.isLoading?(i(),c(y,{key:1,class:"rec-loan-card__loan-use rec-loan-card__loan-use--loading"})):l("",!0),u(r("p",fe,[m(h(a.loanUse)+" ",1),u((i(),c(A,{class:"rec-loan-card__learn-more",to:`/lend/${n.loanId}`},{default:k(()=>t[2]||(t[2]=[m(" Learn more → ")]),void 0),_:1,__:[2]},8,["to"])),[[Q,["Lending","click-Read more","loan-use-learn-more",n.loanId,n.loanId]]])],512),[[f,!o.isLoading]]),o.isLoading?(i(),c(s,{key:2,class:"rec-loan-card__why-special rec-loan-card__why-special--loading"})):l("",!0),u(p(q,{text:a.whySpecial},null,8,["text"]),[[f,!o.isLoading]]),o.isLoading?(i(),c(s,{key:3,class:"rec-loan-card__button rec-loan-card__button--loading"})):l("",!0),u(p(T,{class:"rec-loan-card__button rounded","loan-id":n.loanId,"is-in-basket":a.isInBasket,"is-lent-to":a.isLentTo,price:25},{default:k(()=>t[3]||(t[3]=[m(" Lend $25 ")]),void 0),_:1,__:[3]},8,["loan-id","is-in-basket","is-lent-to"]),[[f,!o.isLoading]])])])],8,oe)}const De=I(N,[["render",ge],["__scopeId","data-v-df38a629"]]);N.__docgenInfo={displayName:"RecommendedLoanCard",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},required:!0}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/RecommendedLoanCard.vue"]};export{De as R};
