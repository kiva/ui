import{n as y}from"./entry-numeral-xVHG5DEP0A.js";import{g as b}from"./entry-index-DzTqzqs3pZ.js";import{i as v}from"./entry-comparators-BRogqMVmB_.js";import{b as k,i as x,u as C,a as B}from"./entry-promoCredit-Ccn1XEEJ6c.js";import{c as s,d as w,E as p,F as m,e as c,G as u,f as h,b as g,H as F,r as P,I,o}from"./entry-vue.esm-bundler-6I7BZrzll1.js";import{_}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const N=b`
	query userPromoCredits($basketId: String) {
		my {
			id
			...UserPromoBalance
		}
		shop (basketId: $basketId) {
			id
			lendingRewardOffered
			basket {
				id
				credits {
					values {
						id
						available
						promoFund {
							id
							displayName
						}
					}
				}
			}
			...BasketPromoAvailable
		}
	}
	${C}
	${B}
`,D=b`
	query promoCampaign($basketId: String, $promoFundId: String) {
		shop (basketId: $basketId) {
			id
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
`,f={name:"PromoCreditBanner",inject:{apollo:{default:null},cookieStore:{default:null}},data(){return{bonusBalance:0,lendingRewardOffered:!1,promoCampaignData:null,priorityBasketCredit:null,isUserDataLoading:!1}},apollo:[{query:N,preFetch:!0,shouldPreFetch(t,{renderConfig:e}){return!e.useCDNCaching},result({data:t}){this.isUserDataLoading=!1,this.setPromoState(t),this.setPriorityBasketCredit(t)}},{query:D,preFetch:!1,variables(){return{promoFundId:this.promoFundId?String(this.promoFundId):null}},result({data:t}){var e;this.promoCampaignData=((e=t==null?void 0:t.shop)==null?void 0:e.promoCampaign)??null}}],created(){const{useCDNCaching:t}=this.$renderConfig;this.isUserDataLoading=t},computed:{bonusBalanceFormatted(){return y(this.bonusBalance).format("$0[.]00")},impactDashboardLink(){var e;const t={...this.$route.query};return delete t.fromContext,`${(e=this.$route.query)==null?void 0:e.fromContext}?${new URLSearchParams(t).toString()}`},isFromImpactDashboard(){return x(this.$route)},creditAvailable(){var t;return((t=this.priorityBasketCredit)==null?void 0:t.available)??null},promoFundId(){var e,i,n,a;const t=((i=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:i.id)??null;return((a=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:a.id)??t},promoFundDisplayName(){var e,i,n,a;const t=((i=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:i.displayName)??null;return((a=(n=this.priorityBasketCredit)==null?void 0:n.promoFund)==null?void 0:a.displayName)??t},managedAccountPageId(){var t,e;return((e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.pageId)??null}},methods:{setPromoState(t){var e;this.bonusBalance=k(t),this.lendingRewardOffered=(e=t.shop)==null?void 0:e.lendingRewardOffered},setPriorityBasketCredit(t){var a,r,l;const e=((l=(r=(a=t==null?void 0:t.shop)==null?void 0:a.basket)==null?void 0:r.credits)==null?void 0:l.values)??[],i=["universal_code","redemption_code","bonus_credit","kiva_credit"],n=e.map(d=>d);n.sort(v(i,"creditType")),this.priorityBasketCredit=n[0]??null}}},A={key:0,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"banner-placeholder",style:{display:"var(--ui-data-promo-credit-banner-display, block)"}},S={key:1,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner-impact-dashboard"},$=["href"],L={key:2,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner"},q={class:"tw-underline"},R={key:3,class:"bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"bonus-banner"},T={key:0,href:"/lend/freeCreditEligible",class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"free-credit-banner"},U={class:"tw-underline"},O={class:"tw-underline"};function V(t,e,i,n,a,r){const l=P("router-link"),d=I("kv-track-event");return a.isUserDataLoading?(o(),s("div",A,"   ")):r.isFromImpactDashboard?(o(),s("div",S,[p((o(),s("a",{href:r.impactDashboardLink,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[e[0]||(e[0]=m(" Please go back to your first Kiva tab or ")),e[1]||(e[1]=c("span",{class:"tw-underline"}," click here",-1)),m(" to use your "+u(r.bonusBalanceFormatted)+" promo credit. ",1)],8,$)),[[d,["TopNav","click-Promo","Lending Reward Banner"]]])])):a.lendingRewardOffered?(o(),s("div",L,[r.promoFundDisplayName&&r.managedAccountPageId?p((o(),h(l,{key:0,to:`/cc/${r.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:g(()=>[c("span",q," Complete a loan to receive your lending reward from "+u(r.promoFundDisplayName)+"! ",1)],void 0),_:1},8,["to"])),[[d,["TopNav","click-Promo","Lending Reward Banner"]]]):(o(),s(F,{key:1},[e[2]||(e[2]=m(" Make a Kiva loan ")),e[3]||(e[3]=c("br",{class:"sm:tw-inline md:tw-hidden"},null,-1)),e[4]||(e[4]=m("and receive a $25 free credit to lend again. "))],64))])):a.bonusBalance>0?(o(),s("div",R,[r.managedAccountPageId?w("",!0):p((o(),s("a",T,[e[5]||(e[5]=m(" Select a borrower to ")),c("span",U," lend your "+u(t.$filters.numeral(a.bonusBalance,"$0.00"))+" free credit",1)])),[[d,["TopNav","click-Promo","Bonus Banner"]]]),r.managedAccountPageId?p((o(),h(l,{key:1,to:`/cc/${r.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:g(()=>[c("span",O," You have "+u(t.$filters.numeral(r.creditAvailable,"$0.00"))+" from "+u(r.promoFundDisplayName)+" to lend! ",1)],void 0),_:1},8,["to"])),[[d,["TopNav","click-Promo","MVP Bonus Banner"]]]):w("",!0)])):w("",!0)}const W=_(f,[["render",V]]);f.__docgenInfo={displayName:"PromoCreditBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue"]};export{W as P};
