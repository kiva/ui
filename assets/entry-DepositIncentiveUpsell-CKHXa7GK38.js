import{g as $}from"./entry-index-DzTqzqs3pZ.js";import{n as p}from"./entry-numeral-xVHG5DEP0A.js";import{_ as P}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{K as I}from"./entry-KvIcon-4qIKz7bYED.js";import{c as m,e as r,f as l,d as i,a as f,G as h,P as T,L as U,r as c,I as E,o,b as w,E as N,F as B}from"./entry-vue.esm-bundler-6I7BZrzll1.js";import{_ as D}from"./entry-KvLoadingPlaceholder-C3-lblN9QT.js";import{U as F}from"./entry-KvButton-DXNHq24Xyy.js";import"./entry-KvWwwHeader-DfIV6OlGkO.js";import{l as A}from"./entry-KvCarousel-BjNivyFG-0.js";import{q as C}from"./entry-KvProgressBar-CME9x1sGhl.js";import{_ as S}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{c as V,a as q}from"./entry-exports-CudK1O5XNw.js";const K=$`query upsellLoansQuery(
	$maxLoans: Int!
	$minAmount: Float!
	$excludeLoanIds: [Int!]
) {
	fundraisingLoans(
		filters: [{
			amountLeft: {
				range: {
					gte: $minAmount
				}
			}
			loanIds: {
				none: $excludeLoanIds
			}
		}]
		limit: $maxLoans
	) {
		values {
			id
			image {
				id
				url(customSize: "w150,h138")
				retinaUrl: url(customSize: "w300,h276")
				lgUrl: url(customSize: "w244,h185")
				lgRetinaUrl: url(customSize: "w488,h370")
			}
			name
			geocode {
				country {
					id
					name
				}
			}
		}
	}
}`,v={name:"DepositIncentiveUpsell",inject:["apollo"],emits:["adding-loan","done-adding"],props:{maxLoans:{type:Number,default:4},goal:{type:Number,default:0},progress:{type:Number,default:0},excludeLoanIds:{type:Array,default:()=>[]}},components:{KvButton:F,KvCarousel:A,KvIcon:I,KvLoadingPlaceholder:D,KvProgressBar:C},data(){return{loadingLoans:!0,loans:[]}},computed:{amountLeft(){return this.goal-this.progress},amountLeftFormatted(){return p(this.amountLeft).format("$0,0[.]00")},loadingProgress(){return this.goal===0},progressPercent(){return this.goal===0?0:Math.min(100,this.progress/this.goal*100)},displayLoans(){return this.loadingLoans||this.loadingProgress||!this.loans.length?new Array(this.maxLoans).fill({id:0}):this.loans}},methods:{addToBasket(s){this.$emit("adding-loan");const t=this.amountLeft;this.apollo.mutate({mutation:P,variables:{loanId:s,price:p(t).format("0.00")}}).then(({errors:n})=>{var g;if(this.$emit("done-adding"),n!=null&&n[0]){const d=n[0];if(((g=d.extensions)==null?void 0:g.code)==="no_shares_added_regular_xb")this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s} reserved`,t),this.$showTipMsg("Looks like that loan was reserved by someone else! Try one of these instead.","info"),this.fetchLoans();else{this.$showTipMsg(d.message,"error");try{this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${d.message.substring(0,40)}...`,t),V(`Add to Basket: ${d.message}`)}catch{}}}else this.$kvTrackEvent("basket","add-to-basket","incentive-upsell-add-to-basket",s,t)}).catch(n=>{this.$emit("done-adding"),this.$showTipMsg("Failed to add loan. Please try again.","error"),this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${n.toString().substring(0,40)}...`,t),q(n)})},fetchLoans(){this.loadingLoans=!0,this.apollo.query({query:K,variables:{maxLoans:this.maxLoans,minAmount:this.amountLeft,excludeLoanIds:this.excludeLoanIds},fetchPolicy:"network-only"}).then(({data:s})=>{var t;this.loans=((t=s==null?void 0:s.fundraisingLoans)==null?void 0:t.values)??[],this.loadingLoans=!1,this.loans.forEach(n=>{this.$kvTrackEvent("basket","show","incentive-upsell-loan",n.id,this.amountLeft)})})}},watch:{progress:{immediate:!0,handler(s,t){Number.isFinite(s)&&s!==t&&this.fetchLoans()}}}},z={class:"tw-w-full tw-mb-1 tw-text-small tw-inline-flex tw-items-center"},M={key:0},R={class:"loan-slide-image tw-overflow-hidden tw-rounded tw-bg-secondary tw-mb-1"},j={key:0,class:"tw-w-full tw-h-full tw-block"},Q=["srcset"],G=["srcset"],H=["src","alt"],J={class:"loan-info tw-mb-1"},O={key:0};function W(s,t,n,g,d,a){const k=c("kv-icon"),u=c("kv-loading-placeholder"),_=c("kv-progress-bar"),b=c("kv-button"),y=c("kv-carousel"),L=E("kv-track-event");return o(),m("li",null,[t[1]||(t[1]=r("h3",{class:"tw-mb-1"}," Earn your $25 Reward¹ ",-1)),r("p",z,[f(k,{name:"present",id:"present-icon",class:"tw-h-2.5 tw-w-2.5 tw--rotate-12 tw-mr-0.5"}),a.loadingProgress?i("",!0):(o(),m("span",M,h(a.amountLeftFormatted)+" away! Don't miss out on your free lending credit. ",1)),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-2.5 tw-max-w-xs"})):i("",!0)]),a.loadingProgress?i("",!0):(o(),l(_,{key:0,class:"tw-w-full tw-max-w-sm tw-mb-2","aria-label":"Percent progress towards lending reward",value:a.progressPercent},null,8,["value"])),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-1 tw-w-full tw-max-w-sm tw-mb-2"})):i("",!0),f(y,{class:"tw-w-full","multiple-slides-visible":!0,"slides-to-scroll":"visible","embla-options":{loop:!1}},T({_:2},[U(a.displayLoans,(e,x)=>({name:`slide${x+1}`,fn:w(()=>[r("div",null,[r("div",R,[e.id?(o(),m("picture",j,[r("source",{srcset:`${e.image.lgRetinaUrl} 2x, ${e.image.lgUrl} 1x`,media:"(min-width: 1024px)"},null,8,Q),r("source",{srcset:`${e.image.retinaUrl} 2x, ${e.image.url} 1x`,media:"(min-width: 0)"},null,8,G),r("img",{class:"tw-w-full tw-h-full tw-object-cover",src:e.image.lgUrl,alt:"Photo of "+e.name,loading:"lazy"},null,8,H)])):i("",!0),e.id?i("",!0):(o(),l(u,{key:1,style:{height:"0","padding-bottom":"100%"}}))]),r("p",J,[e.id?(o(),m("span",O," Lend "+h(a.amountLeftFormatted)+" to "+h(e.name)+" in "+h(e.geocode.country.name),1)):i("",!0),e.id?i("",!0):(o(),l(u,{key:1,class:"tw-h-2.5 tw-w-10/12 tw-mb-1"})),e.id?i("",!0):(o(),l(u,{key:2,class:"tw-h-2.5 tw-w-1/2 lg:tw-hidden"}))]),N((o(),l(b,{onClick:X=>a.addToBasket(e.id),state:e.id?"":"disabled",variant:"secondary"},{default:w(()=>t[0]||(t[0]=[B(" Add to basket ")]),void 0,!0),_:2,__:[0]},1032,["onClick","state"])),[[L,["basket","click","incentive-upsell-add-to-basket",e.id,a.amountLeft]]])])])}))]),1024)])}const ue=S(v,[["render",W],["__scopeId","data-v-59b22909"]]);v.__docgenInfo={displayName:"DepositIncentiveUpsell",exportName:"default",description:"",tags:{},props:[{name:"maxLoans",type:{name:"number"},defaultValue:{func:!1,value:"4"}},{name:"goal",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"progress",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"excludeLoanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}}],events:[{name:"adding-loan"},{name:"done-adding"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Checkout/DepositIncentiveUpsell.vue"]};export{ue as D};
