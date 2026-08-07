import{g as $}from"./entry-index-CWclSTHHJk.js";import{n as p}from"./entry-numeral-xVHG5DEP0A.js";import{_ as T}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{t as P,F as N}from"./entry-index-BiD-ulQMNv.js";import{K as I}from"./entry-KvIcon-DwxBcAik-4.js";import{c as m,a as r,d as f,t as h,g as i,f as l,M as B,r as E,h as c,K as U,o,e as w,b as A,j as C}from"./entry-vue.esm-bundler-BYzU99W7uH.js";import{b as F,_ as D,y as K}from"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{z as S}from"./entry-KvCarousel-BaQpOXmIy6.js";import{_ as V}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{c as z,a as M}from"./entry-exports-CudK1O5XNw.js";const q=$`query upsellLoansQuery(
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
}`,v={name:"DepositIncentiveUpsell",inject:["apollo"],emits:["adding-loan","done-adding"],props:{maxLoans:{type:Number,default:4},goal:{type:Number,default:0},progress:{type:Number,default:0},excludeLoanIds:{type:Array,default:()=>[]}},components:{KvButton:K,KvCarousel:S,KvIcon:I,KvLoadingPlaceholder:D,KvProgressBar:F},data(){return{loadingLoans:!0,loans:[]}},computed:{amountLeft(){return this.goal-this.progress},amountLeftFormatted(){return p(this.amountLeft).format("$0,0[.]00")},loadingProgress(){return this.goal===0},progressPercent(){return this.goal===0?0:Math.min(100,this.progress/this.goal*100)},displayLoans(){return this.loadingLoans||this.loadingProgress||!this.loans.length?new Array(this.maxLoans).fill({id:0}):this.loans}},methods:{addToBasket(s){this.$emit("adding-loan");const e=this.amountLeft;this.apollo.mutate({mutation:T,variables:{loanId:s,price:p(e).format("0.00")}}).then(({errors:n})=>{var g;if(this.$emit("done-adding"),n!=null&&n[0]){const d=n[0];if(((g=d.extensions)==null?void 0:g.code)==="no_shares_added_regular_xb")this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s} reserved`,e),this.$showTipMsg("Looks like that loan was reserved by someone else! Try one of these instead.","info"),this.fetchLoans();else{this.$showTipMsg(d.message,"error");try{this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${d.message.substring(0,40)}...`,e),z(`Add to Basket: ${d.message}`)}catch{}}}else this.$kvTrackEvent("basket","add-to-basket","incentive-upsell-add-to-basket",s,e),P(N,e)}).catch(n=>{this.$emit("done-adding"),this.$showTipMsg("Failed to add loan. Please try again.","error"),this.$kvTrackEvent("basket","fail","incentive-upsell-add-to-basket",`loan ${s}: ${n.toString().substring(0,40)}...`,e),M(n)})},fetchLoans(){this.loadingLoans=!0,this.apollo.query({query:q,variables:{maxLoans:this.maxLoans,minAmount:this.amountLeft,excludeLoanIds:this.excludeLoanIds},fetchPolicy:"network-only"}).then(({data:s})=>{var e;this.loans=((e=s==null?void 0:s.fundraisingLoans)==null?void 0:e.values)??[],this.loadingLoans=!1,this.loans.forEach(n=>{this.$kvTrackEvent("basket","show","incentive-upsell-loan",n.id,this.amountLeft)})})}},watch:{progress:{immediate:!0,handler(s,e){Number.isFinite(s)&&s!==e&&this.fetchLoans()}}}},R={class:"tw-w-full tw-mb-1 tw-text-small tw-inline-flex tw-items-center"},j={key:0},O={class:"loan-slide-image tw-overflow-hidden tw-rounded tw-bg-secondary tw-mb-1"},Q={key:0,class:"tw-w-full tw-h-full tw-block"},G=["srcset"],Y=["srcset"],H=["src","alt"],J={class:"loan-info tw-mb-1"},W={key:0};function X(s,e,n,g,d,a){const _=c("kv-icon"),u=c("kv-loading-placeholder"),k=c("kv-progress-bar"),b=c("kv-button"),y=c("kv-carousel"),L=U("kv-track-event");return o(),m("li",null,[e[1]||(e[1]=r("h4",{class:"tw-mb-1"}," Earn your $25 Reward¹ ",-1)),r("p",R,[f(_,{name:"present",id:"present-icon",class:"tw-h-2.5 tw-w-2.5 tw--rotate-12 tw-mr-0.5"}),a.loadingProgress?i("",!0):(o(),m("span",j,h(a.amountLeftFormatted)+" away! Don't miss out on your free lending credit. ",1)),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-2.5 tw-max-w-xs"})):i("",!0)]),a.loadingProgress?i("",!0):(o(),l(k,{key:0,class:"tw-w-full tw-max-w-sm tw-mb-2",label:"Percent progress towards lending reward",value:a.progressPercent},null,8,["value"])),a.loadingProgress?(o(),l(u,{key:1,class:"tw-h-1 tw-w-full tw-max-w-sm tw-mb-2"})):i("",!0),f(y,{class:"tw-w-full","multiple-slides-visible":!0,"slides-to-scroll":"visible","embla-options":{loop:!1}},B({_:2},[E(a.displayLoans,(t,x)=>({name:`slide${x+1}`,fn:w(()=>[r("div",null,[r("div",O,[t.id?(o(),m("picture",Q,[r("source",{srcset:`${t.image.lgRetinaUrl} 2x, ${t.image.lgUrl} 1x`,media:"(min-width: 1024px)"},null,8,G),r("source",{srcset:`${t.image.retinaUrl} 2x, ${t.image.url} 1x`,media:"(min-width: 0)"},null,8,Y),r("img",{class:"tw-w-full tw-h-full tw-object-cover",src:t.image.lgUrl,alt:"Photo of "+t.name,loading:"lazy"},null,8,H)])):i("",!0),t.id?i("",!0):(o(),l(u,{key:1,style:{height:"0","padding-bottom":"100%"}}))]),r("p",J,[t.id?(o(),m("span",W," Lend "+h(a.amountLeftFormatted)+" to "+h(t.name)+" in "+h(t.geocode.country.name),1)):i("",!0),t.id?i("",!0):(o(),l(u,{key:1,class:"tw-h-2.5 tw-w-10/12 tw-mb-1"})),t.id?i("",!0):(o(),l(u,{key:2,class:"tw-h-2.5 tw-w-1/2 lg:tw-hidden"}))]),A((o(),l(b,{onClick:Z=>a.addToBasket(t.id),state:t.id?"":"disabled",variant:"secondary"},{default:w(()=>e[0]||(e[0]=[C(" Add to basket ")]),void 0,!0),_:2,__:[0]},1032,["onClick","state"])),[[L,["basket","click","incentive-upsell-add-to-basket",t.id,a.amountLeft]]])])])}))]),1024)])}const ce=V(v,[["render",X],["__scopeId","data-v-08fbef97"]]);v.__docgenInfo={displayName:"DepositIncentiveUpsell",exportName:"default",description:"",tags:{},props:[{name:"maxLoans",type:{name:"number"},defaultValue:{func:!1,value:"4"}},{name:"goal",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"progress",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"excludeLoanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}}],events:[{name:"adding-loan"},{name:"done-adding"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Checkout/DepositIncentiveUpsell.vue"]};export{ce as D};
