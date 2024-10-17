import{n as l}from"./entry-numeral-BEwyVwpTZh.js";import{g as L}from"./entry-index-CKVkeXup4D.js";import{c,D as w,H as m,I as p,f as S,F as R,e as h,h as b,w as D,r as j,N as V,o as d}from"./entry-vue.esm-bundler-CCMUuEADRp.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";function O(){return(e,t)=>e<t?-1:1}function $(e,t){if(!Array.isArray(e))throw new TypeError("list must be an array");return(r,n)=>{const o=t?r[t]:r,a=t?n[t]:n;return e.indexOf(o)<e.indexOf(a)?-1:1}}function oe(e,t){const r=e.toLowerCase();return(n,o)=>{const a=n[t].toLowerCase(),s=o[t].toLowerCase(),i=a.indexOf(r),u=s.indexOf(r);return i===0?u===0?O()(a,s):-1:u===0?1:O()(a,s)}}const E=L`
	query promoCampaign($basketId: String, $promoFundId: String) {
		my {
			id
			userAccount {
				id
				promoBalance
			}
		}
		shop (basketId: $basketId) {
			id
			lendingRewardOffered
			basket {
				id
				hasFreeCredits
				credits {
					values {
						id
						available
						promoFund {
							id
						}
					}
				}
				totals {
					creditAvailableTotal
				}
			}
			promoCampaign (promoFundId: $promoFundId) {
				promoFund {
					id
					displayName
				}
				managedAccount {
					id
					managementType
					pageId
				}
			}
		}
	}
`,q={name:"PromoCreditBanner",inject:["apollo","cookieStore"],props:{basketState:{type:Object,default:()=>{}}},data(){return{bonusBalance:0,hasFreeCredits:!1,lendingRewardOffered:!1,promoCampaignData:null}},created(){this.basketState&&Object.entries(this.basketState).length&&this.setPromoState(this.basketState)},mounted(){this.fetchManagedAccountCampaign()},computed:{impactDashboardLink(){var t;const e={...this.$route.query};return delete e.fromContext,`${(t=this.$route.query)==null?void 0:t.fromContext}?${new URLSearchParams(e).toString()}`},isFromImpactDashboard(){var e,t;return((t=(e=this.$route.query)==null?void 0:e.fromContext)==null?void 0:t.startsWith("/impact-dashboard"))??!1},priorityBasketCredit(){var n,o,a,s;const e=((s=(a=(o=(n=this.basketState)==null?void 0:n.shop)==null?void 0:o.basket)==null?void 0:a.credits)==null?void 0:s.values)??[];if(!e.length)return!1;const t=["universal_code","redemption_code","bonus_credit","kiva_credit"],r=e.map(i=>i);return r.sort($(t,"creditType")),r.length?r[0]:null},creditAvailable(){var e;return((e=this.priorityBasketCredit)==null?void 0:e.available)??null},promoFundId(){var t,r,n,o;const e=((r=(t=this.promoCampaignData)==null?void 0:t.promoFund)==null?void 0:r.id)??null;return((o=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:o.id)??e},promoFundDisplayName(){var t,r,n,o;const e=((r=(t=this.promoCampaignData)==null?void 0:t.promoFund)==null?void 0:r.displayName)??null;return((o=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:o.displayName)??e},managedAccountPageId(){var e,t;return((t=(e=this.promoCampaignData)==null?void 0:e.managedAccount)==null?void 0:t.pageId)??null},promoData(){return{bonusBalance:this.bonusBalance,bonusBalanceFormatted:l(this.bonusBalance).format("$0[.]00"),available:this.creditAvailable,displayName:this.promoFundDisplayName,pageId:this.managedAccountPageId}}},watch:{basketState:{handler(e){e&&Object.entries(e).length&&this.setPromoState(e)},immediate:!0,deep:!0}},methods:{fetchManagedAccountCampaign(){this.apollo.query({query:E,variables:this.promoFundId?{promoFundId:String(this.promoFundId)}:{}}).then(({data:e})=>{var t;this.promoCampaignData=((t=e==null?void 0:e.shop)==null?void 0:t.promoCampaign)??null})},setPromoState(e){var i,u,f,v,g,y,k,C,_,x,B,F,I,A,P,N,T;const t=l((f=(u=(i=e.shop)==null?void 0:i.basket)==null?void 0:u.totals)==null?void 0:f.bonusAvailableTotal).value(),r=l((y=(g=(v=e.shop)==null?void 0:v.basket)==null?void 0:g.totals)==null?void 0:y.freeTrialAvailableTotal).value(),n=l((_=(C=(k=e.shop)==null?void 0:k.basket)==null?void 0:C.totals)==null?void 0:_.redemptionCodeAvailableTotal).value(),o=l((F=(B=(x=e.shop)==null?void 0:x.basket)==null?void 0:B.totals)==null?void 0:F.universalCodeAvailableTotal).value(),a=t+r+n+o,s=l(((A=(I=e==null?void 0:e.my)==null?void 0:I.userAccount)==null?void 0:A.promoBalance)??0).value();this.bonusBalance=s>=a?s:a,this.lendingRewardOffered=(P=e.shop)==null?void 0:P.lendingRewardOffered,this.hasFreeCredits=(T=(N=e==null?void 0:e.shop)==null?void 0:N.basket)==null?void 0:T.hasFreeCredits}}},W={key:0,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner-impact-dashboard"},K=["href"],H=h("span",{class:"tw-underline"}," click here",-1),U={key:1,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner"},Y={class:"tw-underline"},z=h("br",{class:"sm:tw-inline md:tw-hidden"},null,-1),G={key:2,class:"bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"bonus-banner"},J={key:0,href:"/lend/freeCreditEligible",class:"tw-text-white hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"free-credit-banner"},Q={class:"tw-underline"},X={class:"tw-underline"};function Z(e,t,r,n,o,a){const s=j("router-link"),i=V("kv-track-event");return a.isFromImpactDashboard?(d(),c("div",W,[w((d(),c("a",{href:a.impactDashboardLink,class:"tw-text-white hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[m(" Please go back to your first Kiva tab or "),H,m(" to use your "+p(a.promoData.bonusBalanceFormatted)+" promo credit. ",1)],8,K)),[[i,["TopNav","click-Promo","Lending Reward Banner"]]])])):o.lendingRewardOffered?(d(),c("div",U,[a.promoData.displayName&&a.promoData.pageId?w((d(),S(s,{key:0,to:`/cc/${a.promoData.pageId}`,class:"tw-text-white hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:D(()=>[h("span",Y," Complete a loan to receive your lending reward from "+p(a.promoData.displayName)+"! ",1)],void 0),_:1},8,["to"])),[[i,["TopNav","click-Promo","Lending Reward Banner"]]]):(d(),c(R,{key:1},[m(" Make a Kiva loan "),z,m("and receive a $25 free credit to lend again. ")],64))])):o.bonusBalance>0?(d(),c("div",G,[a.promoData&&!a.promoData.pageId?w((d(),c("a",J,[m(" Select a borrower to "),h("span",Q," lend your "+p(e.$filters.numeral(a.promoData.bonusBalance,"$0.00"))+" free credit",1)])),[[i,["TopNav","click-Promo","Bonus Banner"]]]):b("",!0),a.promoData&&a.promoData.pageId?w((d(),S(s,{key:1,to:`/cc/${a.promoData.pageId}`,class:"tw-text-white hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:D(()=>[h("span",X," You have "+p(e.$filters.numeral(a.promoData.available,"$0.00"))+" from "+p(a.promoData.displayName)+" to lend! ",1)],void 0),_:1},8,["to"])),[[i,["TopNav","click-Promo","MVP Bonus Banner"]]]):b("",!0)])):b("",!0)}const ne=M(q,[["render",Z]]);q.__docgenInfo={displayName:"PromoCreditBanner",exportName:"default",description:"",tags:{},props:[{name:"basketState",type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue"]};export{ne as P,$ as i,oe as s};
