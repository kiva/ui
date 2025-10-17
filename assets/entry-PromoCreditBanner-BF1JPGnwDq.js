import{n as v,g as b}from"./entry-numeral-DJCTM12wUX.js";import{i as y}from"./entry-comparators-BRogqMVmB_.js";import{b as k,i as C,u as x,a as P}from"./entry-promoCredit-A8tDfJh8uJ.js";import{c as d,d as w,E as u,F as l,G as m,e as p,f as h,b as g,H as B,r as F,I,o as i}from"./entry-vue.esm-bundler-6I7BZrzll1.js";import{_}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const N=b`
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
	${x}
	${P}
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
					campaignInfo {
						campaignPromoFundId
						upc
					}
					id
					managementType
					pageId
					strategicPartner {
						id
						partnerName
						partnerContentfulPage
					}
				}
			}
		}
	}
`,f={name:"PromoCreditBanner",inject:{apollo:{default:null},cookieStore:{default:null}},data(){return{bonusBalance:0,lendingRewardOffered:!1,promoCampaignData:null,priorityBasketCredit:null,isUserDataLoading:!1}},apollo:[{query:N,preFetch:!0,shouldPreFetch(t,{renderConfig:e}){return!e.useCDNCaching},result({data:t}){this.isUserDataLoading=!1,this.setPromoState(t),this.setPriorityBasketCredit(t)}},{query:D,preFetch:!1,variables(){return{promoFundId:this.promoFundId?String(this.promoFundId):null}},result({data:t}){var e;this.promoCampaignData=((e=t==null?void 0:t.shop)==null?void 0:e.promoCampaign)??null}}],created(){const{useCDNCaching:t}=this.$renderConfig;this.isUserDataLoading=t},computed:{bonusBalanceFormatted(){return v(this.bonusBalance).format("$0[.]00")},impactDashboardLink(){var e;const t={...this.$route.query};return delete t.fromContext,`${(e=this.$route.query)==null?void 0:e.fromContext}?${new URLSearchParams(t).toString()}`},isUpcCampaign(){var t,e,r;return((r=(e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.campaignInfo)==null?void 0:r.upc)??!1},isFromImpactDashboard(){return C(this.$route)},creditAvailable(){var t;return((t=this.priorityBasketCredit)==null?void 0:t.available)??null},partnerName(){var t,e,r;return((r=(e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.strategicPartner)==null?void 0:r.partnerName)??null},promoFundId(){var e,r,o,n;const t=((r=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:r.id)??null;return((n=(o=this.priorityBasketCredit)==null?void 0:o.promoFund)==null?void 0:n.id)??t},promoFundDisplayName(){var e,r,o,n;const t=((r=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:r.displayName)??null;return((n=(o=this.priorityBasketCredit)==null?void 0:o.promoFund)==null?void 0:n.displayName)??t},managedAccountPageId(){var t,e;return((e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.pageId)??null},upcCampaignLink(){var r,o,n,a,c,s;const t=((n=(o=(r=this.promoCampaignData)==null?void 0:r.managedAccount)==null?void 0:o.strategicPartner)==null?void 0:n.partnerContentfulPage)??null,e=((s=(c=(a=this.promoCampaignData)==null?void 0:a.managedAccount)==null?void 0:c.campaignInfo)==null?void 0:s.upc)??null;return!t||!e?null:`/impact-dashboard/${t}/upc/${e}`}},methods:{setPromoState(t){var e;this.bonusBalance=k(t),this.lendingRewardOffered=(e=t.shop)==null?void 0:e.lendingRewardOffered},setPriorityBasketCredit(t){var n,a,c;const e=((c=(a=(n=t==null?void 0:t.shop)==null?void 0:n.basket)==null?void 0:a.credits)==null?void 0:c.values)??[],r=["universal_code","redemption_code","bonus_credit","kiva_credit"],o=e.map(s=>s);o.sort(y(r,"creditType")),this.priorityBasketCredit=o[0]??null}}},A={key:0,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"banner-placeholder",style:{display:"var(--ui-data-promo-credit-banner-display, block)"}},L={key:1,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"upc-campaign-banner"},S=["href"],U={key:2,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner-impact-dashboard"},q=["href"],R={key:3,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner"},T={class:"tw-underline"},$={key:4,class:"bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"bonus-banner"},O={key:0,href:"/lend/freeCreditEligible",class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"free-credit-banner"},V={class:"tw-underline"},E={class:"tw-underline"};function K(t,e,r,o,n,a){const c=F("router-link"),s=I("kv-track-event");return n.isUserDataLoading?(i(),d("div",A,"   ")):a.isUpcCampaign&&a.partnerName&&a.upcCampaignLink?(i(),d("div",L,[u((i(),d("a",{href:a.upcCampaignLink,class:"tw-text-white hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[l(" You have Kiva credit from "+m(a.partnerName)+" to lend ",1)],8,S)),[[s,["TopNav","click-Promo","UPC Campaign Banner"]]])])):a.isFromImpactDashboard?(i(),d("div",U,[u((i(),d("a",{href:a.impactDashboardLink,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[e[0]||(e[0]=l(" Please go back to your first Kiva tab or ")),e[1]||(e[1]=p("span",{class:"tw-underline"}," click here",-1)),l(" to use your "+m(a.bonusBalanceFormatted)+" promo credit. ",1)],8,q)),[[s,["TopNav","click-Promo","Lending Reward Banner"]]])])):n.lendingRewardOffered?(i(),d("div",R,[a.promoFundDisplayName&&a.managedAccountPageId?u((i(),h(c,{key:0,to:`/cc/${a.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:g(()=>[p("span",T," Complete a loan to receive your lending reward from "+m(a.promoFundDisplayName)+"! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","Lending Reward Banner"]]]):(i(),d(B,{key:1},[e[2]||(e[2]=l(" Make a Kiva loan ")),e[3]||(e[3]=p("br",{class:"sm:tw-inline md:tw-hidden"},null,-1)),e[4]||(e[4]=l("and receive a $25 free credit to lend again. "))],64))])):n.bonusBalance>0?(i(),d("div",$,[a.managedAccountPageId?w("",!0):u((i(),d("a",O,[e[5]||(e[5]=l(" Select a borrower to ")),p("span",V," lend your "+m(t.$filters.numeral(n.bonusBalance,"$0.00"))+" free credit",1)])),[[s,["TopNav","click-Promo","Bonus Banner"]]]),a.managedAccountPageId?u((i(),h(c,{key:1,to:`/cc/${a.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:g(()=>[p("span",E," You have "+m(t.$filters.numeral(a.creditAvailable,"$0.00"))+" from "+m(a.promoFundDisplayName)+" to lend! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","MVP Bonus Banner"]]]):w("",!0)])):w("",!0)}const W=_(f,[["render",K]]);f.__docgenInfo={displayName:"PromoCreditBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue"]};export{W as P};
