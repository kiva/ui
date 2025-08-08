import{g as W}from"./entry-index-DzTqzqs3pZ.js";import{p as G,t as Z}from"./entry-time-left-mixin-BgOgttSZrl.js";import{F as H}from"./entry-FundraisingStatusMeter-BDRZWlM6DJ.js";import{K as J}from"./entry-KvLoadingParagraph-DB7tdEK2Vj.js";import{n as X}from"./entry-numeral-xVHG5DEP0A.js";import{_ as Y}from"./entry-basketItems-AJqL_yrdZS.js";import{_ as $}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{_ as ee}from"./entry-KvButton-CQ3gigg4cW.js";import{K as te}from"./entry-KvIcon-Bm6XaY5NHf.js";import{K as ne}from"./entry-KvLoadingSpinner-BIBzAxWg43.js";import{E as u,f as c,d as l,I as T,b as y,n as ae,r as d,o as i,g as k,F as m,a as h,e as r,c as b,G as _,K as f}from"./entry-vue.esm-bundler-6I7BZrzll1.js";import{_ as x}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{w as D,a as O}from"./entry-exports-CudK1O5XNw.js";import{G as oe}from"./entry-mdi-tbnfdHUa_P.js";import{w as re}from"./entry-KvMaterialIcon-BlqYKufAko.js";import"./entry-KvWwwHeader-H1zV_3ei7j.js";import{_ as se}from"./entry-KvLoadingPlaceholder-BW1dVl0XcC.js";import{j as ie}from"./entry-KvFlag-BDQzOxmYFv.js";import{a as Q}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as V}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-index-CNzTSTNafD.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-DwHITppAlA.js";import"./entry-getCacheKey-BkqVopK9Sh.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./iframe-BDRL3Y6r.js";const K={name:"LendButton2",inject:["apollo","cookieStore"],props:{loanId:{type:Number,default:null},isInBasket:{type:Boolean,default:!1},isLentTo:{type:Boolean,default:!1},price:{type:[Number,String],default:25}},components:{KvButton:ee,KvIcon:te,KvLoadingSpinner:ne},data(){return{isAdding:!1}},computed:{state(){return this.isAdding?"adding":this.isInBasket?"basketed":this.isLentTo?"lent-to":"lend"},showLend(){return this.state==="lend"},showLendAgain(){return this.state==="lent-to"},showAdding(){return this.state==="adding"},showCheckout(){return this.state==="basketed"}},methods:{addToBasket(){const e=X(this.price).format("0.00");this.isAdding=!0,this.apollo.mutate({mutation:$,variables:{loanId:this.loanId,price:e},optimisticResponse:{__typename:"Mutation",shop:{__typename:"ShopMutation",updateLoanReservation:{__typename:"LoanReservation",id:this.loanId,price:e}}},awaitRefetchQueries:!0,refetchQueries:[{query:Y,variables:{basketId:this.cookieStore.get("kvbskt")}}]}).then(t=>{this.isAdding=!1,t.error&&this.handleError(t.error)}).catch(t=>{this.isAdding=!1,this.handleError(t)})},handleError(e){console.error(e),this.$showTipMsg("There was a problem adding the loan to your basket","error");try{D(t=>{t.setTag("loan_id",this.loanId),O(e)})}catch{}}}};function le(e,t,a,g,o,n){const s=d("kv-button"),p=d("kv-loading-spinner"),I=d("kv-icon"),w=T("kv-track-event");return n.showLend||n.showLendAgain?u((i(),c(s,{key:0,onClick:n.addToBasket,class:ae({secondary:n.showLendAgain})},{default:y(()=>[n.showLend?k(e.$slots,"default",{key:0},()=>[t[0]||(t[0]=m(" Lend now "))],!0):l("",!0),n.showLendAgain?k(e.$slots,"lent-to",{key:1},()=>[t[1]||(t[1]=m(" Lend again "))],!0):l("",!0)],void 0),_:3},8,["onClick","class"])),[[w,["Lending","Add to basket","lend-button-click",a.loanId,a.loanId]]]):n.showAdding?(i(),c(s,{key:1,class:"lend-button__adding"},{default:y(()=>[k(e.$slots,"adding",{},()=>[h(p),t[2]||(t[2]=r("span",null,"Adding to Basket",-1))],!0)],void 0),_:3})):n.showCheckout?u((i(),c(s,{key:2,class:"secondary",to:"/basket"},{default:y(()=>[k(e.$slots,"checkout",{},()=>[h(I,{class:"icon",name:"checkmark"}),t[3]||(t[3]=r("span",null,"Checkout now",-1))],!0)],void 0),_:3})),[[w,["Lending","click-Read more","checkout-now-button-click",a.loanId,a.loanId]]]):l("",!0)}const de=x(K,[["render",le],["__scopeId","data-v-1f6fe4e1"]]);K.__docgenInfo={displayName:"LendButton2",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"null"}},{name:"isInBasket",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"isLentTo",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"price",type:{name:"number|string"},defaultValue:{func:!1,value:"25"}}],slots:[{name:"default"},{name:"lent-to"},{name:"adding"},{name:"checkout"}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/Buttons/LendButton2.vue"]};const U={name:"WhySpecial",props:{text:{type:String,required:!0}},components:{KvMaterialIcon:re},data(){return{mdiStar:oe}}},ce={class:"tw-flex tw-items-stretch tw-flex-nowrap tw-overflow-hidden tw-border tw-border-tertiary tw-rounded tw-w-full tw-mb-2"},ue={class:"tw-bg-tertiary tw-p-1 tw-flex-shrink-0 tw-flex tw-items-center"},me={class:"tw-bg-primary tw-p-2 tw-flex-1"};function pe(e,t,a,g,o,n){const s=d("kv-material-icon");return i(),b("div",ce,[r("div",ue,[h(s,{icon:o.mdiStar,class:"tw-w-3 tw-h-3 tw-fill-current tw-text-primary-inverse"},null,8,["icon"])]),r("p",me,[t[0]||(t[0]=r("strong",null,"This loan is special because",-1)),m(" "+_(a.text),1)])])}const _e=x(U,[["render",pe]]);U.__docgenInfo={displayName:"WhySpecial",exportName:"default",description:"",tags:{},props:[{name:"text",type:{name:"string"},required:!0}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/WhySpecial.vue"]};const S=W`query recLoanCard($basketId: String, $loanId: Int!) {
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
}`,E={name:"RecommendedLoanCard",props:{loanId:{type:Number,required:!0}},inject:["apollo","cookieStore"],mixins:[G,Z],components:{FundraisingStatusMeter:H,KvFlag:ie,KvLoadingPlaceholder:se,KvLoadingParagraph:J,LendButton:de,WhySpecial:_e},data(){return{loan:null,basketItems:null,isLoading:!1,queryObserver:null}},computed:{borrowerName(){var e;return((e=this.loan)==null?void 0:e.name)||""},countryISO(){var e,t,a;return((a=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:a.isoCode)||""},countryName(){var e,t,a;return((a=(t=(e=this.loan)==null?void 0:e.geocode)==null?void 0:t.country)==null?void 0:a.name)||""},imageRetinaUrl(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.retina)||""},imageUrl(){var e,t;return((t=(e=this.loan)==null?void 0:e.image)==null?void 0:t.default)||""},isInBasket(){return Array.isArray(this.basketItems)?this.basketItems.filter(a=>a.__typename==="LoanReservation").map(a=>a.id).indexOf(this.loanId)>-1:!1},isLentTo(){var e,t;return(t=(e=this.loan)==null?void 0:e.userProperties)==null?void 0:t.lentTo},loanUse(){var e;return((e=this.loan)==null?void 0:e.fullLoanUse)??""},sectorName(){var e,t;return(((t=(e=this.loan)==null?void 0:e.sector)==null?void 0:t.name)||"").toLowerCase()},whySpecial(){var t;const e=((t=this.loan)==null?void 0:t.whySpecial)||"";return e.toString().charAt(0).toLowerCase()+e.toString().slice(1)}},methods:{prefetchLoanData(){return this.loan||(this.isLoading=!0),this.apollo.query({variables:{loanId:this.loanId},query:S}).then(e=>{this.processQueryResult(e)})},readLoanData(){try{const e=this.apollo.readQuery({query:S,variables:{basketId:this.cookieStore.get("kvbskt"),loanId:this.loanId}});e.lend?this.processQueryResult({data:e}):this.isLoading=!0}catch{this.isLoading=!0}},watchQueryLoanData(){this.queryObserver=this.apollo.watchQuery({query:S,variables:{basketId:this.cookieStore.get("kvbskt"),loanId:this.loanId}}),this.queryObserver.subscribe({next:e=>this.processQueryResult(e),error:e=>this.processQueryResult({error:e})})},processQueryResult(e){var t,a,g,o,n,s;if(e.error){console.error(e.error),this.$showTipMsg("There was a problem loading your loan recommendations","error");try{D(p=>{p.setTag("wizard_stage","results"),p.setTag("loan_id",this.loanId),O(e.error)})}catch{}}this.isLoading=!1,this.loan=((a=(t=e.data)==null?void 0:t.lend)==null?void 0:a.loan)||null,this.basketItems=((s=(n=(o=(g=e.data)==null?void 0:g.shop)==null?void 0:o.basket)==null?void 0:n.items)==null?void 0:s.values)||null}},serverPrefetch(){return this.prefetchLoanData()},created(){typeof window<"u"&&(this.readLoanData(),this.watchQueryLoanData())},watch:{loanId(e){this.queryObserver&&this.queryObserver.setVariables({basketId:this.cookieStore.get("kvbskt"),loanId:e})}}},he=["id"],fe={class:"rec-loan-card__sector"},ge={class:"tw-text-brand tw-font-book"},ye={class:"tw-text-brand tw-font-book"},we={class:"rec-loan-card__card"},ke={class:"rec-loan-card__image-wrapper"},ve=["srcset","src","alt"],Le={class:"rec-loan-card__image-overlay"},be={key:0,class:"rec-loan-card__country-flag"},Ie={class:"rec-loan-card__time-left"},Se={class:"rec-loan-card__amount-left"},xe={class:"rec-loan-card__summary"},Ce={class:"rec-loan-card__loan-use tw-mb-1.5"};function Re(e,t,a,g,o,n){const s=d("kv-loading-placeholder"),p=d("kv-flag"),I=d("fundraising-status-meter"),w=d("kv-loading-paragraph"),F=d("router-link"),P=d("why-special"),z=d("lend-button"),j=T("kv-track-event");return i(),b("div",{class:"rec-loan-card",id:`${a.loanId}-loan-card`},[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__sector rec-loan-card__sector--loading"})):l("",!0),u(r("div",fe,[t[0]||(t[0]=m(" A loan for ")),r("strong",ge,_(n.sectorName),1),t[1]||(t[1]=m(" in ")),r("strong",ye,_(n.countryName),1)],512),[[f,!o.isLoading]]),r("div",we,[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__image-wrapper tw-bg-tertiary rec-loan-card__image-wrapper--loading"})):l("",!0),u(r("div",ke,[n.imageUrl?(i(),b("img",{key:0,class:"rec-loan-card__image",srcset:n.imageRetinaUrl+" 2x",src:n.imageUrl,alt:"photo of "+n.borrowerName,loading:"lazy"},null,8,ve)):l("",!0),r("div",Le,[n.countryISO?(i(),b("div",be,[h(p,{country:n.countryISO,name:n.countryName,"aspect-ratio":"1x1"},null,8,["country","name"])])):l("",!0),r("span",Ie,_(e.timeLeftMessage),1),r("span",Se,_(e.$filters.numeral(e.amountLeftWithoutReservation,"$0,0"))+" to go ",1)])],512),[[f,!o.isLoading]]),h(I,{class:"medium square","percent-raised":e.percentRaised},null,8,["percent-raised"]),r("div",xe,[o.isLoading?(i(),c(s,{key:0,class:"rec-loan-card__name tw-text-h3 rec-loan-card__name--loading"})):l("",!0),u(r("h2",{class:"rec-loan-card__name tw-text-h3 tw-mb-1"},_(n.borrowerName),513),[[f,!o.isLoading]]),o.isLoading?(i(),c(w,{key:1,class:"rec-loan-card__loan-use rec-loan-card__loan-use--loading"})):l("",!0),u(r("p",Ce,[m(_(n.loanUse)+" ",1),u((i(),c(F,{class:"rec-loan-card__learn-more",to:`/lend/${a.loanId}`},{default:y(()=>t[2]||(t[2]=[m(" Learn more → ")]),void 0),_:1,__:[2]},8,["to"])),[[j,["Lending","click-Read more","loan-use-learn-more",a.loanId,a.loanId]]])],512),[[f,!o.isLoading]]),o.isLoading?(i(),c(s,{key:2,class:"rec-loan-card__why-special rec-loan-card__why-special--loading"})):l("",!0),u(h(P,{text:n.whySpecial},null,8,["text"]),[[f,!o.isLoading]]),o.isLoading?(i(),c(s,{key:3,class:"rec-loan-card__button rec-loan-card__button--loading"})):l("",!0),u(h(z,{class:"rec-loan-card__button rounded","loan-id":a.loanId,"is-in-basket":n.isInBasket,"is-lent-to":n.isLentTo,price:25},{default:y(()=>t[3]||(t[3]=[m(" Lend $25 ")]),void 0),_:1,__:[3]},8,["loan-id","is-in-basket","is-lent-to"]),[[f,!o.isLoading]])])])],8,he)}const C=x(E,[["render",Re],["__scopeId","data-v-df38a629"]]);E.__docgenInfo={displayName:"RecommendedLoanCard",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},required:!0}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCards/RecommendedLoanCard.vue"]};const Ae={data:{lend:{loan:{id:1998250,geocode:{country:{name:"Malawi",isoCode:"MW"}},image:{default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w480h300/d5ad26cd7acc24317edc1c04c6250074.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w960h600/d5ad26cd7acc24317edc1c04c6250074.jpg"},name:"Microloan Foundation Malawi",sector:{name:"Services"},whySpecial:"It helps Lending Partners withstand negative economic impacts of the COVID-19 pandemic.",userProperties:{lentTo:null},use:"this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",status:"fundraising",loanAmount:"250000.00",borrowerCount:1,anonymizationLevel:"none",fullLoanUse:"A loan of $250,000 helps this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",loanFundraisingInfo:{fundedAmount:"218950.00",reservedAmount:"0.00",isExpiringSoon:!1},plannedExpirationDate:"2020-09-10T19:30:13Z"}}}},ot={title:"Loan Cards/Recommended Loan Card",component:C},v=()=>({mixins:[Q({queryResult:Ae}),V()],components:{RecommendedLoanCard:C},template:`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    `}),L=()=>({mixins:[Q({loading:!0}),V()],components:{RecommendedLoanCard:C},template:`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    `});var R,A,q;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    queryResult
  }), cookieStoreStoryMixin()],
  components: {
    RecommendedLoanCard
  },
  template: \`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    \`
})`,...(q=(A=v.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var B,M,N;L.parameters={...L.parameters,docs:{...(B=L.parameters)==null?void 0:B.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  components: {
    RecommendedLoanCard
  },
  template: \`
        <div class="row">
            <div class="small-4 columns">
                <recommended-loan-card :loan-id="1998250" />
            </div>
        </div>
    \`
})`,...(N=(M=L.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};const rt=["Default","Loading"];export{v as Default,L as Loading,rt as __namedExportsOrder,ot as default};
