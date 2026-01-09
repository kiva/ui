import{n as y}from"./entry-numeral-xVHG5DEP0A.js";import{g as v}from"./entry-index-CWclSTHHJk.js";import{b as k,i as x,u as P,a as B}from"./entry-promoCredit-w2GeqDaA1T.js";import{c,m as w,D as u,M as m,L as l,q as p,z as g,C as f,J as F,r as I,K as _,o as d}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as N}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";function b(){return(t,e)=>t<e?-1:1}function D(t,e){if(!Array.isArray(t))throw new TypeError("list must be an array");return(r,o)=>{const n=e?r[e]:r,a=e?o[e]:o;return t.indexOf(n)<t.indexOf(a)?-1:1}}function H(t,e){const r=t.toLowerCase();return(o,n)=>{const a=o[e].toLowerCase(),i=(e?n[e]:n).toLowerCase(),s=a.indexOf(r),h=i.indexOf(r);return s===0?h===0?b()(a,i):-1:h===0?1:b()(a,i)}}const A=v`
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
	${P}
	${B}
`,L=v`
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
`,C={name:"PromoCreditBanner",inject:{apollo:{default:null},cookieStore:{default:null}},data(){return{bonusBalance:0,lendingRewardOffered:!1,promoCampaignData:null,priorityBasketCredit:null,isUserDataLoading:!1}},apollo:[{query:A,preFetch:!0,shouldPreFetch(t,{renderConfig:e}){return!e.useCDNCaching},result({data:t}){this.isUserDataLoading=!1,this.setPromoState(t),this.setPriorityBasketCredit(t)}},{query:L,preFetch:!1,variables(){return{promoFundId:this.promoFundId?String(this.promoFundId):null}},result({data:t}){var e;this.promoCampaignData=((e=t==null?void 0:t.shop)==null?void 0:e.promoCampaign)??null}}],created(){const{useCDNCaching:t}=this.$renderConfig;this.isUserDataLoading=t},computed:{bonusBalanceFormatted(){return y(this.bonusBalance).format("$0[.]00")},impactDashboardLink(){var e;const t={...this.$route.query};return delete t.fromContext,`${(e=this.$route.query)==null?void 0:e.fromContext}?${new URLSearchParams(t).toString()}`},isUpcCampaign(){var t,e,r;return((r=(e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.campaignInfo)==null?void 0:r.upc)??!1},isFromImpactDashboard(){return x(this.$route)},creditAvailable(){var t;return((t=this.priorityBasketCredit)==null?void 0:t.available)??null},partnerName(){var t,e,r;return((r=(e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.strategicPartner)==null?void 0:r.partnerName)??null},promoFundId(){var e,r,o,n;const t=((r=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:r.id)??null;return((n=(o=this.priorityBasketCredit)==null?void 0:o.promoFund)==null?void 0:n.id)??t},promoFundDisplayName(){var e,r,o,n;const t=((r=(e=this.promoCampaignData)==null?void 0:e.promoFund)==null?void 0:r.displayName)??null;return((n=(o=this.priorityBasketCredit)==null?void 0:o.promoFund)==null?void 0:n.displayName)??t},managedAccountPageId(){var t,e;return((e=(t=this.promoCampaignData)==null?void 0:t.managedAccount)==null?void 0:e.pageId)??null},upcCampaignLink(){var r,o,n,a,i,s;const t=((n=(o=(r=this.promoCampaignData)==null?void 0:r.managedAccount)==null?void 0:o.strategicPartner)==null?void 0:n.partnerContentfulPage)??null,e=((s=(i=(a=this.promoCampaignData)==null?void 0:a.managedAccount)==null?void 0:i.campaignInfo)==null?void 0:s.upc)??null;return!t||!e?null:`/impact-dashboard/${t}/upc/${e}`}},methods:{setPromoState(t){var e;this.bonusBalance=k(t),this.lendingRewardOffered=(e=t.shop)==null?void 0:e.lendingRewardOffered},setPriorityBasketCredit(t){var n,a,i;const e=((i=(a=(n=t==null?void 0:t.shop)==null?void 0:n.basket)==null?void 0:a.credits)==null?void 0:i.values)??[],r=["universal_code","redemption_code","bonus_credit","kiva_credit"],o=e.map(s=>s);o.sort(D(r,"creditType")),this.priorityBasketCredit=o[0]??null}}},S={key:0,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"banner-placeholder",style:{display:"var(--ui-data-promo-credit-banner-display, block)"}},q={key:1,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"upc-campaign-banner"},O=["href"],T={key:2,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner-impact-dashboard"},U=["href"],R={key:3,class:"tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"lending-reward-banner"},$={class:"tw-underline"},K={key:4,class:"bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2","data-testid":"bonus-banner"},V={key:0,href:"/lend/freeCreditEligible",class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"free-credit-banner"},E={class:"tw-underline"},M={class:"tw-underline"};function W(t,e,r,o,n,a){const i=I("router-link"),s=_("kv-track-event");return n.isUserDataLoading?(d(),c("div",S,"   ")):a.isUpcCampaign&&a.partnerName&&a.upcCampaignLink?(d(),c("div",q,[u((d(),c("a",{href:a.upcCampaignLink,class:"tw-text-white hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[m(" You have Kiva credit from "+l(a.partnerName)+" to lend ",1)],8,O)),[[s,["TopNav","click-Promo","UPC Campaign Banner"]]])])):a.isFromImpactDashboard?(d(),c("div",T,[u((d(),c("a",{href:a.impactDashboardLink,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"impact-dashboard-promo-banner"},[e[0]||(e[0]=m(" Please go back to your first Kiva tab or ")),e[1]||(e[1]=p("span",{class:"tw-underline"}," click here",-1)),m(" to use your "+l(a.bonusBalanceFormatted)+" promo credit. ",1)],8,U)),[[s,["TopNav","click-Promo","Lending Reward Banner"]]])])):n.lendingRewardOffered?(d(),c("div",R,[a.promoFundDisplayName&&a.managedAccountPageId?u((d(),g(i,{key:0,to:`/cc/${a.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:f(()=>[p("span",$," Complete a loan to receive your lending reward from "+l(a.promoFundDisplayName)+"! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","Lending Reward Banner"]]]):(d(),c(F,{key:1},[e[2]||(e[2]=m(" Make a Kiva loan ")),e[3]||(e[3]=p("br",{class:"sm:tw-inline md:tw-hidden"},null,-1)),e[4]||(e[4]=m("and receive a $25 free credit to lend again. "))],64))])):n.bonusBalance>0?(d(),c("div",K,[a.managedAccountPageId?w("",!0):u((d(),c("a",V,[e[5]||(e[5]=m(" Select a borrower to ")),p("span",E," lend your "+l(t.$filters.numeral(n.bonusBalance,"$0.00"))+" free credit",1)])),[[s,["TopNav","click-Promo","Bonus Banner"]]]),a.managedAccountPageId?u((d(),g(i,{key:1,to:`/cc/${a.managedAccountPageId}`,class:"tw-text-white tw-no-underline hover:tw-no-underline hover:tw-text-white active:tw-text-white visited:tw-text-white focus:tw-text-white","data-testid":"cc-promo-banner"},{default:f(()=>[p("span",M," You have "+l(t.$filters.numeral(a.creditAvailable,"$0.00"))+" from "+l(a.promoFundDisplayName)+" to lend! ",1)],void 0),_:1},8,["to"])),[[s,["TopNav","click-Promo","MVP Bonus Banner"]]]):w("",!0)])):w("",!0)}const Q=N(C,[["render",W]]);C.__docgenInfo={displayName:"PromoCreditBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue"]};export{Q as P,D as i,H as s};
