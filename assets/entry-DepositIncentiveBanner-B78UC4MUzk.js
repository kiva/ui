import{G as y}from"./entry-GenericPromoBanner-gCxkH-anmi.js";import{n as f,g as b}from"./entry-numeral-DJCTM12wUX.js";import{l as u}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{c as h,d as _,a as I,r as S,o as L}from"./entry-vue.esm-bundler-DRMQxQJg8r.js";import{_ as N}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const T=`query configSetting($key: String!) {
	general {
		configSetting(key: $key) {
			key
			value
		}
	}
}
`,g={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"configSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"configSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:140,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:T}}},p="deposit_incentive_active_campaign_id",k=b`
	query amountToLendQuery ($basketId: String, $campaignId: String) {
		shop(basketId: $basketId) {
			id
			basket {
				id
				totals {
					loanReservationTotal
				}
			}
		}
		my {
			id
			depositIncentiveAmountToLend
			userAccount {
				id
				hasCampaignReward(campaignId: $campaignId)
			}
		}
	}
`,v={name:"DepositIncentiveBanner",components:{GenericPromoBanner:y},data(){return{hasCampaignReward:!1,amountToLend:0,isLoggedIn:!1,basketTotal:0}},inject:["apollo","cookieStore"],apollo:{preFetch(i,t){return t.query({query:g,variables:{key:p}}).then(o=>{var n,a,r;const s=JSON.parse(((r=(a=(n=o==null?void 0:o.data)==null?void 0:n.general)==null?void 0:a.configSetting)==null?void 0:r.value)??'""');return s?t.query({query:k,variables:{campaignId:s}}):null})}},created(){var t,o,s,n,a,r,c,d,l,m;let i;try{i=JSON.parse(((s=(o=(t=this.apollo.readQuery({query:g,variables:{key:p}}))==null?void 0:t.general)==null?void 0:o.configSetting)==null?void 0:s.value)??'""')}catch(e){u(e,"DepositIncentiveBanner configSettingQuery")}if(i)try{const e=this.apollo.readQuery({query:k,variables:{campaignId:i,basketId:this.cookieStore.get("kvbskt")}});this.amountToLend=parseFloat(((n=e==null?void 0:e.my)==null?void 0:n.depositIncentiveAmountToLend)??0),this.isLoggedIn=!!((a=e==null?void 0:e.my)!=null&&a.id),this.basketTotal=parseFloat(((d=(c=(r=e==null?void 0:e.shop)==null?void 0:r.basket)==null?void 0:c.totals)==null?void 0:d.loanReservationTotal)??0),this.hasCampaignReward=!!((m=(l=e==null?void 0:e.my)==null?void 0:l.userAccount)!=null&&m.hasCampaignReward)}catch(e){u(e,"DepositIncentiveBanner amountToLendQuery")}},computed:{promoBannerContent(){const i=this.isLoggedIn?`Just for you! Lend ${f(this.amountToLend).format("$0,0")} and get a $25 lending credit!¹`:"Lend & get a free lending credit reward!¹ Log in or sign up to get started →",t=this.isLoggedIn?"/lend/filter":"/ui-login?force=true&doneUrl=/lend/filter";return{richText:i,link:t,disclaimer:""}}}},q={key:0};function B(i,t,o,s,n,a){const r=S("generic-promo-banner");return!n.isLoggedIn||!n.hasCampaignReward?(L(),h("div",q,[I(r,{class:"tw-text-center","promo-banner-content":a.promoBannerContent,"enable-deposit-incentive-exp":n.isLoggedIn,"progress-bar-value":n.basketTotal,"amount-to-lend":n.amountToLend},null,8,["promo-banner-content","enable-deposit-incentive-exp","progress-bar-value","amount-to-lend"])])):_("",!0)}const Q=N(v,[["render",B]]);v.__docgenInfo={displayName:"DepositIncentiveBanner",exportName:"default",description:"",tags:{},sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner.vue"]};export{Q as D};
