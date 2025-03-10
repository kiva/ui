import{g as $}from"./entry-index-CKVkeXup4D.js";import{n as g}from"./entry-numeral-BEwyVwpTZh.js";import{d as I}from"./entry-updateLoanReservation-CMshdCI3Lr.js";import{K as P}from"./entry-KvIcon-R1lu0zKzNH.js";import{c as m,e as r,a as f,F as h,h as i,f as l,O as T,K as U,r as u,H as S,o,w,D,E,R as N,S as B}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import{U as F}from"./entry-KvButton-CBJoMUsMFr.js";import{l as A}from"./entry-KvCarousel-CTbmKeWU7m.js";import"./entry-KvWideLoanCard-CfbcqIxttL.js";import{q as C}from"./entry-KvProgressBar-Bbe1xlT8eS.js";import{_ as K}from"./entry-KvLoadingPlaceholder-D3FOqFpIEE.js";import{_ as V}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{c as q,a as z}from"./entry-exports-B6EYZdgWeI.js";const M=$`query upsellLoansQuery(
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
}`,v={name:"DepositIncentiveUpsell",inject:["apollo"],emits:["adding-loan","done-adding"],props:{maxLoans:{type:Number,default:4},goal:{type:Number,default:0},progress:{type:Number,default:0},excludeLoanIds:{type:Array,default:()=>[]}},components:{KvButton:F,KvCarousel:A,KvIcon:P,KvLoadingPlaceholder:K,KvProgressBar:C},data(){return{loadingLoans:!0,loans:[]}},computed:{amountLeft(){return this.goal-this.progress},amountLeftFormatted(){return g(this.amountLeft).format("$0,0[.]00")},loadingProgress(){return this.goal===0},progressPercent(){return this.goal===0?0:Math.min(100,this.progress/this.goal*100)},displayLoans(){return this.loadingLoans||this.loadingProgress||!this.loans.length?new Array(this.maxLoans).fill({id:0}):this.loans}},methods:{addToBasket(e){this.$emit("adding-loan");const s=this.amountLeft;this.apollo.mutate({mutation:I,variables:{loanid:e,price:g(s).format("0.00")}}).then(({errors:n})=>{var p;if(this.$emit("done-adding"),n!=null&&n[0]){const d=n[0];if(((p=d.extensions)==null?void 0:p.code)==="no_shares_added_regular_xb")this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${e} reserved`,s),this.$showTipMsg("Looks like that loan was reserved by someone else! Try one of these instead.","info"),this.fetchLoans();else{this.$showTipMsg(d.message,"error");try{this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${e}: ${d.message.substring(0,40)}...`,s),q(`Add to Basket: ${d.message}`)}catch{}}}else this.$kvTrackEvent("basket","add-to-basket","incentive-upsell-add-to-basket",e,s)}).catch(n=>{this.$emit("done-adding"),this.$showTipMsg("Failed to add loan. Please try again.","error"),this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${e}: ${n.toString().substring(0,40)}...`,s),z(n)})},fetchLoans(){this.loadingLoans=!0,this.apollo.query({query:M,variables:{maxLoans:this.maxLoans,minAmount:this.amountLeft,excludeLoanIds:this.excludeLoanIds},fetchPolicy:"network-only"}).then(({data:e})=>{var s;this.loans=((s=e==null?void 0:e.fundraisingLoans)==null?void 0:s.values)??[],this.loadingLoans=!1,this.loans.forEach(n=>{this.$kvTrackEvent("basket","show","incentive-upsell-loan",n.id,this.amountLeft)})})}},watch:{progress:{immediate:!0,handler(e,s){Number.isFinite(e)&&e!==s&&this.fetchLoans()}}}},R=e=>(N("data-v-ced6ef6c"),e=e(),B(),e),j=R(()=>r("h3",{class:"tw-mb-1"}," Earn your $25 Reward¹ ",-1)),Q={class:"tw-w-full tw-mb-1 tw-text-small tw-inline-flex tw-items-center"},H={key:0},O={class:"loan-slide-image tw-overflow-hidden tw-rounded tw-bg-secondary tw-mb-1"},G={key:0,class:"tw-w-full tw-h-full tw-block"},J=["srcset"],W=["srcset"],X=["src","alt"],Y={class:"loan-info tw-mb-1"},Z={key:0};function ee(e,s,n,p,d,a){const _=u("kv-icon"),c=u("kv-loading-placeholder"),k=u("kv-progress-bar"),b=u("kv-button"),y=u("kv-carousel"),L=S("kv-track-event");return o(),m("li",null,[j,r("p",Q,[f(_,{name:"present",id:"present-icon",class:"tw-h-2.5 tw-w-2.5 tw--rotate-12 tw-mr-0.5"}),a.loadingProgress?i("",!0):(o(),m("span",H,h(a.amountLeftFormatted)+" away! Don't miss out on your free lending credit. ",1)),a.loadingProgress?(o(),l(c,{key:1,class:"tw-h-2.5 tw-max-w-xs"})):i("",!0)]),a.loadingProgress?i("",!0):(o(),l(k,{key:0,class:"tw-w-full tw-max-w-sm tw-mb-2","aria-label":"Percent progress towards lending reward",value:a.progressPercent},null,8,["value"])),a.loadingProgress?(o(),l(c,{key:1,class:"tw-h-1 tw-w-full tw-max-w-sm tw-mb-2"})):i("",!0),f(y,{class:"tw-w-full","multiple-slides-visible":!0,"slides-to-scroll":"visible","embla-options":{loop:!1}},T({_:2},[U(a.displayLoans,(t,x)=>({name:`slide${x+1}`,fn:w(()=>[r("div",null,[r("div",O,[t.id?(o(),m("picture",G,[r("source",{srcset:`${t.image.lgRetinaUrl} 2x, ${t.image.lgUrl} 1x`,media:"(min-width: 1024px)"},null,8,J),r("source",{srcset:`${t.image.retinaUrl} 2x, ${t.image.url} 1x`,media:"(min-width: 0)"},null,8,W),r("img",{class:"tw-w-full tw-h-full tw-object-cover",src:t.image.lgUrl,alt:"Photo of "+t.name,loading:"lazy"},null,8,X)])):i("",!0),t.id?i("",!0):(o(),l(c,{key:1,style:{height:"0","padding-bottom":"100%"}}))]),r("p",Y,[t.id?(o(),m("span",Z," Lend "+h(a.amountLeftFormatted)+" to "+h(t.name)+" in "+h(t.geocode.country.name),1)):i("",!0),t.id?i("",!0):(o(),l(c,{key:1,class:"tw-h-2.5 tw-w-10/12 tw-mb-1"})),t.id?i("",!0):(o(),l(c,{key:2,class:"tw-h-2.5 tw-w-1/2 lg:tw-hidden"}))]),D((o(),l(b,{onClick:te=>a.addToBasket(t.id),state:t.id?"":"disabled",variant:"secondary"},{default:w(()=>[E(" Add to basket ")],void 0,!0),_:2},1032,["onClick","state"])),[[L,["basket","click","incentive-upsell-add-to-basket",t.id,a.amountLeft]]])])])}))]),1024)])}const pe=V(v,[["render",ee],["__scopeId","data-v-ced6ef6c"]]);v.__docgenInfo={displayName:"DepositIncentiveUpsell",exportName:"default",description:"",tags:{},props:[{name:"maxLoans",type:{name:"number"},defaultValue:{func:!1,value:"4"}},{name:"goal",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"progress",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"excludeLoanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}}],events:[{name:"adding-loan"},{name:"done-adding"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Checkout/DepositIncentiveUpsell.vue"]};export{pe as D};
