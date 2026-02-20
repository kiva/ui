import{g as $}from"./entry-index-CWclSTHHJk.js";import{n as p}from"./entry-numeral-xVHG5DEP0A.js";import{_ as P}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{K as I}from"./entry-KvIcon-BUhAos7YaB.js";import{c as m,q as r,z as l,m as i,a as f,L as g,H as T,I as U,r as c,K as D,o,C as w,D as N,M as B}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as E}from"./entry-KvLoadingPlaceholder-B_9_tltQhY.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import{g as C}from"./entry-KvButton-BA7nBLyz1b.js";import{z}from"./entry-KvCarousel-Dw4gUt9u7G.js";import{x as A}from"./entry-KvProgressBar-FMYdx0i-mf.js";import{_ as F}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{c as K,a as S}from"./entry-exports-CudK1O5XNw.js";const V=$`query upsellLoansQuery(
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
}`,v={name:"DepositIncentiveUpsell",inject:["apollo"],emits:["adding-loan","done-adding"],props:{maxLoans:{type:Number,default:4},goal:{type:Number,default:0},progress:{type:Number,default:0},excludeLoanIds:{type:Array,default:()=>[]}},components:{KvButton:C,KvCarousel:z,KvIcon:I,KvLoadingPlaceholder:E,KvProgressBar:A},data(){return{loadingLoans:!0,loans:[]}},computed:{amountLeft(){return this.goal-this.progress},amountLeftFormatted(){return p(this.amountLeft).format("$0,0[.]00")},loadingProgress(){return this.goal===0},progressPercent(){return this.goal===0?0:Math.min(100,this.progress/this.goal*100)},displayLoans(){return this.loadingLoans||this.loadingProgress||!this.loans.length?new Array(this.maxLoans).fill({id:0}):this.loans}},methods:{addToBasket(s){this.$emit("adding-loan");const t=this.amountLeft;this.apollo.mutate({mutation:P,variables:{loanId:s,price:p(t).format("0.00")}}).then(({errors:n})=>{var h;if(this.$emit("done-adding"),n!=null&&n[0]){const d=n[0];if(((h=d.extensions)==null?void 0:h.code)==="no_shares_added_regular_xb")this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s} reserved`,t),this.$showTipMsg("Looks like that loan was reserved by someone else! Try one of these instead.","info"),this.fetchLoans();else{this.$showTipMsg(d.message,"error");try{this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${d.message.substring(0,40)}...`,t),K(`Add to Basket: ${d.message}`)}catch{}}}else this.$kvTrackEvent("basket","add-to-basket","incentive-upsell-add-to-basket",s,t)}).catch(n=>{this.$emit("done-adding"),this.$showTipMsg("Failed to add loan. Please try again.","error"),this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${n.toString().substring(0,40)}...`,t),S(n)})},fetchLoans(){this.loadingLoans=!0,this.apollo.query({query:V,variables:{maxLoans:this.maxLoans,minAmount:this.amountLeft,excludeLoanIds:this.excludeLoanIds},fetchPolicy:"network-only"}).then(({data:s})=>{var t;this.loans=((t=s==null?void 0:s.fundraisingLoans)==null?void 0:t.values)??[],this.loadingLoans=!1,this.loans.forEach(n=>{this.$kvTrackEvent("basket","show","incentive-upsell-loan",n.id,this.amountLeft)})})}},watch:{progress:{immediate:!0,handler(s,t){Number.isFinite(s)&&s!==t&&this.fetchLoans()}}}},q={class:"tw-w-full tw-mb-1 tw-text-small tw-inline-flex tw-items-center"},M={key:0},R={class:"loan-slide-image tw-overflow-hidden tw-rounded tw-bg-secondary tw-mb-1"},j={key:0,class:"tw-w-full tw-h-full tw-block"},Q=["srcset"],H=["srcset"],G=["src","alt"],J={class:"loan-info tw-mb-1"},O={key:0};function W(s,t,n,h,d,a){const k=c("kv-icon"),u=c("kv-loading-placeholder"),_=c("kv-progress-bar"),b=c("kv-button"),y=c("kv-carousel"),L=D("kv-track-event");return o(),m("li",null,[t[1]||(t[1]=r("h3",{class:"tw-mb-1"}," Earn your $25 Reward¹ ",-1)),r("p",q,[f(k,{name:"present",id:"present-icon",class:"tw-h-2.5 tw-w-2.5 tw--rotate-12 tw-mr-0.5"}),a.loadingProgress?i("",!0):(o(),m("span",M,g(a.amountLeftFormatted)+" away! Don't miss out on your free lending credit. ",1)),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-2.5 tw-max-w-xs"})):i("",!0)]),a.loadingProgress?i("",!0):(o(),l(_,{key:0,class:"tw-w-full tw-max-w-sm tw-mb-2",label:"Percent progress towards lending reward",value:a.progressPercent},null,8,["value"])),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-1 tw-w-full tw-max-w-sm tw-mb-2"})):i("",!0),f(y,{class:"tw-w-full","multiple-slides-visible":!0,"slides-to-scroll":"visible","embla-options":{loop:!1}},T({_:2},[U(a.displayLoans,(e,x)=>({name:`slide${x+1}`,fn:w(()=>[r("div",null,[r("div",R,[e.id?(o(),m("picture",j,[r("source",{srcset:`${e.image.lgRetinaUrl} 2x, ${e.image.lgUrl} 1x`,media:"(min-width: 1024px)"},null,8,Q),r("source",{srcset:`${e.image.retinaUrl} 2x, ${e.image.url} 1x`,media:"(min-width: 0)"},null,8,H),r("img",{class:"tw-w-full tw-h-full tw-object-cover",src:e.image.lgUrl,alt:"Photo of "+e.name,loading:"lazy"},null,8,G)])):i("",!0),e.id?i("",!0):(o(),l(u,{key:1,style:{height:"0","padding-bottom":"100%"}}))]),r("p",J,[e.id?(o(),m("span",O," Lend "+g(a.amountLeftFormatted)+" to "+g(e.name)+" in "+g(e.geocode.country.name),1)):i("",!0),e.id?i("",!0):(o(),l(u,{key:1,class:"tw-h-2.5 tw-w-10/12 tw-mb-1"})),e.id?i("",!0):(o(),l(u,{key:2,class:"tw-h-2.5 tw-w-1/2 lg:tw-hidden"}))]),N((o(),l(b,{onClick:X=>a.addToBasket(e.id),state:e.id?"":"disabled",variant:"secondary"},{default:w(()=>t[0]||(t[0]=[B(" Add to basket ")]),void 0,!0),_:2,__:[0]},1032,["onClick","state"])),[[L,["basket","click","incentive-upsell-add-to-basket",e.id,a.amountLeft]]])])])}))]),1024)])}const ue=F(v,[["render",W],["__scopeId","data-v-3d09f651"]]);v.__docgenInfo={displayName:"DepositIncentiveUpsell",exportName:"default",description:"",tags:{},props:[{name:"maxLoans",type:{name:"number"},defaultValue:{func:!1,value:"4"}},{name:"goal",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"progress",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"excludeLoanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}}],events:[{name:"adding-loan"},{name:"done-adding"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Checkout/DepositIncentiveUpsell.vue"]};export{ue as D};
