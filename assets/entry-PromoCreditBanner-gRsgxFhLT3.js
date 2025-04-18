import{n as l}from"./entry-numeral-CmvrP3KSIW.js";import{g as O}from"./entry-index-DGXt1zOePE.js";import{i as R}from"./entry-comparators-Dl7wUbGSK1.js";import{c,D as h,E as m,F as u,f as S,G as j,e as p,h as w,w as D,r as L,H as V,o as d}from"./entry-vue.esm-bundler-CTwdbZZHjD.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const $=O`
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
`,q={name:"PromoCreditBanner",inject:["apollo","cookieStore"],props:{basketState:{type:Object,default:()=>{}}},data(){return{bonusBalance:0,hasFreeCredits:!1,lendingRewardOffered:!1,promoCampaignData:null}},created(){this.basketState&&Object.entries(this.basketState).length&&this.setPromoState(this.basketState)},mounted(){this.fetchManagedAccountCampaign()},computed:{impactDashboardLink(){var t;const e={...this.$route.query};return delete e.fromContext,`${(t=this.$route.query)==null?void 0:t.fromContext}?${new URLSearchParams(e).toString()}`},isFromImpactDashboard(){var e,t;return((t=(e=this.$route.query)==null?void 0:e.fromContext)==null?void 0:t.startsWith("/impact-dashboard"))??!1},priorityBasketCredit(){var n,r,a,i;const e=((i=(a=(r=(n=this.basketState)==null?void 0:n.shop)==null?void 0:r.basket)==null?void 0:a.credits)==null?void 0:i.values)??[];if(!e.length)return!1;const t=["universal_code","redemption_code","bonus_credit","kiva_credit"],o=e.map(s=>s);return o.sort(R(t,"creditType")),o.length?o[0]:null},creditAvailable(){var e;return((e=this.priorityBasketCredit)==null?void 0:e.available)??null},promoFundId(){var t,o,n,r;const e=((o=(t=this.promoCampaignData)==null?void 0:t.promoFund)==null?void 0:o.id)??null;return((r=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:r.id)??e},promoFundDisplayName(){var t,o,n,r;const e=((o=(t=this.promoCampaignData)==null?void 0:t.promoFund)==null?void 0:o.displayName)??null;return((r=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:r.displayName)??e},managedAccountPageId(){var e,t;return((t=(e=this.promoCampaignData)==null?void 0:e.managedAccount)==null?void 0:t.pageId)??null},promoData(){return{bonusBalance:this.bonusBalance,bonusBalanceFormatted:l(this.bonusBalance).format("$0[.]00"),available:this.creditAvailable,displayName:this.promoFundDisplayName,pageId:this.managedAccountPageId}}},watch:{basketState:{handler(e){e&&Object.entries(e).length&&this.setPromoState(e)},immediate:!0,deep:!0}},methods:{fetchManagedAccountCampaign(){this.apollo.query({query:$,variables:this.promoFundId?{promoFundId:String(this.promoFundId)}:{}}).then(({data:e})=>{var t;this.promoCampaignData=((t=e==null?void 0:e.shop)==null?void 0:t.promoCampaign)??null})},setPromoState(e){var s,b,v,f,g,k,y,_,C,x,B,F,I,P,A,N,T;const t=l((v=(b=(s=e.shop)==null?void 0:s.basket)==null?void 0:b.totals)==null?void 0:v.bonusAvailableTotal).value(),o=l((k=(g=(f=e.shop)==null?void 0:f.basket)==null?void 0:g.totals)==null?void 0:k.freeTrialAvailableTotal).value(),n=l((C=(_=(y=e.shop)==null?void 0:y.basket)==null?void 0:_.totals)==null?void 0:C.redemptionCodeAvailableTotal).value(),r=l((F=(B=(x=e.shop)==null?void 0:x.basket)==null?void 0:B.totals)==null?void 0:F.universalCodeAvailableTotal).value(),a=t+o+n+r,i=l(((P=(I=e==null?void 0:e.my)==null?void 0:I.userAccount)==null?void 0:P.promoBalance)??0).value();this.bonusBalance=i>=a?i:a,this.lendingRewardOffered=(A=e.shop)==null?void 0:A.lendingRewardOffered,this.hasFreeCredits=(T=(N=e==null?void 0:e.shop)==null?void 0:N.basket)==null?void 0:T.hasFreeCredits}}},E={key:0,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner-impact-dashboard"},K=["href"],W=p("span",{class:"tw-underline"}," click here",-1),G={key:1,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner"},H={class:"tw-underline"},U=p("br",{class:"sm:tw-inline md:tw-hidden"},null,-1),Y={key:2,class:"bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"bonus-banner"},z={key:0,href:"/lend/freeCreditEligible",class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"free-credit-banner"},J={class:"tw-underline"},Q={class:"tw-underline"};function X(e,t,o,n,r,a){const i=L("router-link"),s=V("kv-track-event");return a.isFromImpactDashboard?(d(),c("div",E,[h((d(),c("a",{href:a.impactDashboardLink,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[m(" Please go back to your first Kiva tab or "),W,m(" to use your "+u(a.promoData.bonusBalanceFormatted)+" promo credit. ",1)],8,K)),[[s,["TopNav","click-Promo","Lending Reward Banner"]]])])):r.lendingRewardOffered?(d(),c("div",G,[a.promoData.displayName&&a.promoData.pageId?h((d(),S(i,{key:0,to:`/cc/${a.promoData.pageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:D(()=>[p("span",H," Complete a loan to receive your lending reward from "+u(a.promoData.displayName)+"! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","Lending Reward Banner"]]]):(d(),c(j,{key:1},[m(" Make a Kiva loan "),U,m("and receive a $25 free credit to lend again. ")],64))])):r.bonusBalance>0?(d(),c("div",Y,[a.promoData&&!a.promoData.pageId?h((d(),c("a",z,[m(" Select a borrower to "),p("span",J," lend your "+u(e.$filters.numeral(a.promoData.bonusBalance,"$0.00"))+" free credit",1)])),[[s,["TopNav","click-Promo","Bonus Banner"]]]):w("",!0),a.promoData&&a.promoData.pageId?h((d(),S(i,{key:1,to:`/cc/${a.promoData.pageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:D(()=>[p("span",Q," You have "+u(e.$filters.numeral(a.promoData.available,"$0.00"))+" from "+u(a.promoData.displayName)+" to lend! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","MVP Bonus Banner"]]]):w("",!0)])):w("",!0)}const oe=M(q,[["render",X]]);q.__docgenInfo={displayName:"PromoCreditBanner",exportName:"default",description:"",tags:{},props:[{name:"basketState",type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue"]};export{oe as P};
